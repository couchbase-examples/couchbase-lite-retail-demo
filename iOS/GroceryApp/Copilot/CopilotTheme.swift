import SwiftUI

/// One palette for the whole copilot, drawn from the Couchbase brand.
///
/// This exists because of specific review feedback: "This stuff seems way too orange tinted.
/// Would be nice to have more pop of colors." The cause was structural rather than decorative —
/// the page background, every card, every badge and every button were all drawn from the same
/// two orange-family values, so orange was carrying meaning *and* being the wallpaper. Once
/// everything is orange, nothing reads as important.
///
/// The fix is to give orange one job. `action` is the only orange left, and it is reserved for
/// the primary button on a screen ("we may need the buttons to be orange - I think rest of app
/// uses that theme"). Everything else moves to a neutral surface stack, and status is carried by
/// colours that actually mean something: green for compliant, red for missing, amber for
/// degraded, blue for informational.
enum CopilotTheme {

    // MARK: Brand

    /// Couchbase orange. Primary actions only — buttons the associate is meant to press.
    static let action = Color(hex: "FC9C0C")
    /// Couchbase red. Reserved for genuine problems, never for decoration.
    static let brandRed = Color(hex: "EA2328")

    // MARK: Surfaces

    /// Page background. Neutral, so coloured elements on top of it actually stand out.
    static let canvas = Color(hex: "F4F5F7")
    /// Card background.
    static let surface = Color(UIColor.systemBackground)
    /// A quiet inset panel inside a card — source rows, sample thumbnails.
    static let inset = Color(hex: "EEF0F4")

    // MARK: Status
    //
    // These map to the three planogram outcomes plus an informational tone, so the shelf map,
    // the finding rows and the summary chips all say the same thing with the same colour.

    static let compliant = Color(hex: "0F9D58")
    static let degraded = Color(hex: "F5A623")
    static let missing = Color(hex: "EA2328")
    static let info = Color(hex: "1565C0")

    /// Soft fill for a status chip or cell, so the palette stays legible against white.
    static func tint(_ color: Color) -> Color { color.opacity(0.14) }
}
