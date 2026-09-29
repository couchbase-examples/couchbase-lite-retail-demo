import Foundation

/// Price constraints lifted out of a natural-language query and pushed into SQL++.
///
/// "electrolyte drink under $3" is two questions, not one: a semantic one ("electrolyte drink")
/// and a numeric one ("price < 3"). Embedding the whole string answers neither well — the price
/// phrase is noise in the vector, and MiniLM has no notion of "under" as an ordering.
///
/// So the numeric half is extracted first, applied as a `WHERE` predicate in the same SQL++
/// statement as `APPROX_VECTOR_DISTANCE`, and the phrase is stripped before embedding. That is
/// what makes it genuinely hybrid: one query, one index scan, the database doing both halves.
/// Filtering in the app after the fact would look identical on screen while quietly returning
/// the wrong thing — the vector search would spend its `LIMIT` on results the filter then throws
/// away, so a cheap item ranked 30th would never surface at all.
///
/// Deliberately rule-based rather than model-driven. The grammar is tiny and closed, an LLM
/// round-trip would dwarf the search it precedes, and a regex that fails to match degrades to
/// plain semantic search rather than to a wrong answer.
struct QueryConstraints: Equatable {
    /// The query with any price phrase removed — this is what gets embedded.
    let semanticQuery: String
    /// Exclusive upper bound, from "under $3" / "below $3" / "less than $3" / "cheaper than $3".
    let maxPrice: Double?
    /// Exclusive lower bound, from "over $3" / "above $3" / "more than $3".
    let minPrice: Double?

    var hasPriceFilter: Bool { maxPrice != nil || minPrice != nil }

    /// A short human-readable description of what was pulled out, for the UI to echo back.
    /// Showing this matters: a filter the user did not knowingly set, silently removing results,
    /// is indistinguishable from a broken search.
    var summary: String? {
        var parts: [String] = []
        if let maxPrice { parts.append("under \(Self.money(maxPrice))") }
        if let minPrice { parts.append("over \(Self.money(minPrice))") }
        return parts.isEmpty ? nil : parts.joined(separator: " and ")
    }

    private static func money(_ value: Double) -> String {
        value == value.rounded()
            ? String(format: "$%.0f", value)
            : String(format: "$%.2f", value)
    }

    // Currency symbol optional so "under 3 dollars" and "under $3" both work. The number is
    // matched with an optional decimal part; "under $3." would capture 3 and leave the stray dot
    // in the semantic remainder, which is harmless.
    private static let under = try! NSRegularExpression(
        pattern: #"\b(?:under|below|less than|cheaper than|no more than|at most)\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:dollars?|bucks?)?"#,
        options: .caseInsensitive)
    private static let over = try! NSRegularExpression(
        pattern: #"\b(?:over|above|more than|greater than|at least|pricier than)\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:dollars?|bucks?)?"#,
        options: .caseInsensitive)

    /// Parses `query`, returning the semantic remainder plus whatever bounds were found.
    static func parse(_ query: String) -> QueryConstraints {
        var remainder = query
        var maxPrice: Double?
        var minPrice: Double?

        // Longest-match-first is not a concern here because the two patterns are disjoint, but
        // each is applied to the *original* string and removed from the remainder so that a
        // query carrying both bounds ("over $2 under $5") still yields both.
        if let (value, range) = firstMatch(under, in: query) {
            maxPrice = value
            remainder = remainder.replacingOccurrences(of: String(query[range]), with: " ")
        }
        if let (value, range) = firstMatch(over, in: query) {
            minPrice = value
            remainder = remainder.replacingOccurrences(of: String(query[range]), with: " ")
        }

        // Collapse the whitespace the removal leaves behind, and drop a dangling connective so
        // "protein bar that is under $3" does not embed as "protein bar that is".
        var cleaned = remainder
            .replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
            .trimmingCharacters(in: .whitespacesAndNewlines)
        for tail in ["that is", "that's", "which is", "and", "that", "for", "at"] {
            if cleaned.lowercased().hasSuffix(" " + tail) {
                cleaned = String(cleaned.dropLast(tail.count + 1))
                    .trimmingCharacters(in: .whitespacesAndNewlines)
            }
        }

        // If the price phrase was the entire query there is nothing left to embed. Fall back to
        // the original text rather than sending an empty vector query.
        let semantic = cleaned.isEmpty ? query : cleaned
        return QueryConstraints(semanticQuery: semantic, maxPrice: maxPrice, minPrice: minPrice)
    }

    private static func firstMatch(_ regex: NSRegularExpression,
                                   in text: String) -> (Double, Range<String.Index>)? {
        let full = NSRange(text.startIndex..., in: text)
        guard let match = regex.firstMatch(in: text, range: full),
              let whole = Range(match.range, in: text),
              let captured = Range(match.range(at: 1), in: text),
              let value = Double(text[captured]) else { return nil }
        return (value, whole)
    }
}
