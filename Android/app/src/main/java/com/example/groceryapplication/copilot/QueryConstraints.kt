package com.example.groceryapplication.copilot

/**
 * Price constraints lifted out of a natural-language query and pushed into SQL++.
 *
 * "electrolyte drink under $3" is two questions, not one: a semantic one ("electrolyte drink")
 * and a numeric one ("price < 3"). Embedding the whole string answers neither well — the price
 * phrase is noise in the vector, and MiniLM has no notion of "under" as an ordering.
 *
 * So the numeric half is extracted first, applied as a WHERE predicate in the same SQL++
 * statement as APPROX_VECTOR_DISTANCE, and the phrase is stripped before embedding. That is what
 * makes it genuinely hybrid: one query, one index scan, the database doing both halves.
 * Filtering in the app afterwards would look identical on screen while quietly returning the
 * wrong thing — the vector search would spend its LIMIT on rows the filter then discards, so a
 * cheap item ranked 30th would never surface at all.
 *
 * Deliberately rule-based rather than model-driven. The grammar is tiny and closed, an LLM
 * round-trip would dwarf the search it precedes, and a pattern that fails to match degrades to
 * plain semantic search rather than to a wrong answer.
 *
 * Kotlin counterpart of iOS `QueryConstraints.swift`; keep the two patterns in step.
 */
data class QueryConstraints(
    /** The query with any price phrase removed — this is what gets embedded. */
    val semanticQuery: String,
    /** Exclusive upper bound, from "under $3" / "below $3" / "less than $3". */
    val maxPrice: Double? = null,
    /** Exclusive lower bound, from "over $3" / "above $3" / "more than $3". */
    val minPrice: Double? = null
) {
    val hasPriceFilter: Boolean get() = maxPrice != null || minPrice != null

    /**
     * Short description of what was pulled out, for the UI to echo back. Worth showing: a filter
     * the user typed in prose and did not knowingly set, silently removing results, is
     * indistinguishable from a broken search.
     */
    val summary: String?
        get() {
            val parts = buildList {
                maxPrice?.let { add("under ${money(it)}") }
                minPrice?.let { add("over ${money(it)}") }
            }
            return parts.takeIf { it.isNotEmpty() }?.joinToString(" and ")
        }

    private fun money(value: Double): String =
        if (value == Math.floor(value)) "$%.0f".format(value) else "$%.2f".format(value)

    companion object {
        // Currency symbol optional so "under 3 dollars" and "under $3" both work.
        private val UNDER = Regex(
            """\b(?:under|below|less than|cheaper than|no more than|at most)\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:dollars?|bucks?)?""",
            RegexOption.IGNORE_CASE
        )
        private val OVER = Regex(
            """\b(?:over|above|more than|greater than|at least|pricier than)\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:dollars?|bucks?)?""",
            RegexOption.IGNORE_CASE
        )
        private val TRAILING = listOf("that is", "that's", "which is", "and", "that", "for", "at")

        fun parse(query: String): QueryConstraints {
            var remainder = query
            var maxPrice: Double? = null
            var minPrice: Double? = null

            // Each pattern is matched against the original string and removed from the
            // remainder, so a query carrying both bounds ("over $2 under $5") yields both.
            UNDER.find(query)?.let { m ->
                maxPrice = m.groupValues[1].toDoubleOrNull()
                if (maxPrice != null) remainder = remainder.replace(m.value, " ")
            }
            OVER.find(query)?.let { m ->
                minPrice = m.groupValues[1].toDoubleOrNull()
                if (minPrice != null) remainder = remainder.replace(m.value, " ")
            }

            // Collapse the whitespace the removal leaves behind, and drop a dangling connective
            // so "protein bar that is under $3" does not embed as "protein bar that is".
            var cleaned = remainder.replace(Regex("""\s+"""), " ").trim()
            for (tail in TRAILING) {
                if (cleaned.lowercase().endsWith(" $tail")) {
                    cleaned = cleaned.dropLast(tail.length + 1).trim()
                }
            }

            // If the price phrase was the whole query there is nothing left to embed; fall back
            // to the original text rather than issuing an empty vector query.
            val semantic = cleaned.ifEmpty { query }
            return QueryConstraints(semantic, maxPrice, minPrice)
        }
    }
}
