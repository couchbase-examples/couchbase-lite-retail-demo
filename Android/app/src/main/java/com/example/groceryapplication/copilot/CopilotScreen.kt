package com.example.groceryapplication.copilot

import android.Manifest
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import com.example.groceryapplication.StoreLocation
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.groceryapplication.AppConfig
import com.example.groceryapplication.DatabaseManager
import com.example.groceryapplication.GroceryItem
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

// Matches the iOS palette so the two apps read as one product.
private val Accent = Color(0xFFFC9C0C)
private val Cream = Color(0xFFFFF0DB)

private enum class CopilotMode(val label: String) {
    FIND("Find"),
    // Named "Planogram" rather than "Shelf" per review feedback — the planogram is the
    // expected layout being checked against, the term the retail audience uses.
    PLANOGRAM("Planogram"),
    ASK("Ask")
}

/**
 * The Store Associate Copilot — the Android counterpart of the iOS Copilot tab.
 *
 * Step 1 (Find) and Step 3 (Ask) run the same on-device pipeline as iOS: the query is embedded
 * with all-MiniLM-L6-v2 via ONNX Runtime and matched with `APPROX_VECTOR_DISTANCE` against
 * vectors in the local Couchbase Lite database, with no network call.
 *
 * Step 2 (Planogram) is UI-only here, which is what was asked for on Android — the image model
 * and per-facing crop matching exist on iOS and can be ported once the flow is agreed. The
 * screen says so rather than implying a check has run.
 */
@Composable
fun CopilotScreen(databaseManager: DatabaseManager) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val keyboard = LocalSoftwareKeyboardController.current

    val searchService = remember {
        CopilotSearchService(context) { databaseManager.getDatabase() }
    }

    var mode by remember { mutableStateOf(CopilotMode.FIND) }
    // Aisle and shelf carried from a Find result into the planogram audit (PRD Case 1).
    var shelfContext by remember { mutableStateOf<ShelfContext?>(null) }
    /** Product carried from a Find result into Ask, so the question has context. */
    var askAbout by remember { mutableStateOf<GroceryItem?>(null) }
    var threshold by remember { mutableStateOf(AppConfig.DEFAULT_RELEVANCE_THRESHOLD) }
    var showDiagnostics by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Cream)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Copilot", fontSize = 32.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.weight(1f))
            IconButton(onClick = { showDiagnostics = true }) {
                Icon(Icons.Default.Memory, "Behind the scenes", tint = Accent)
            }
        }

        // Mode picker
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            CopilotMode.entries.forEach { candidate ->
                val selected = mode == candidate
                Surface(
                    onClick = { mode = candidate },
                    shape = RoundedCornerShape(9.dp),
                    color = if (selected) Accent else MaterialTheme.colorScheme.surface,
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        candidate.label,
                        modifier = Modifier
                            .padding(vertical = 10.dp, horizontal = 2.dp)
                            .fillMaxWidth(),
                        color = if (selected) Color.White else MaterialTheme.colorScheme.onSurface,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            }
        }

        when (mode) {
            CopilotMode.FIND -> ProductSearchSection(
                searchService = searchService,
                threshold = threshold,
                onThresholdChange = { threshold = it },
                onSearchStart = { keyboard?.hide() },
                onAskAbout = { item ->
                    askAbout = item
                    mode = CopilotMode.ASK
                },
                // Case 1: the associate looked the product up, now they walk to the shelf.
                // Tapping the location carries it straight into the audit.
                onAuditShelf = { context ->
                    shelfContext = context
                    mode = CopilotMode.PLANOGRAM
                },
                scope = scope
            )
            CopilotMode.PLANOGRAM -> PlanogramSection(databaseManager, shelfContext)
            CopilotMode.ASK -> AskSection(
                searchService = searchService,
                product = askAbout,
                scope = scope
            )
        }
    }

    if (showDiagnostics) {
        DiagnosticsSheet(
            telemetry = searchService.telemetry,
            storedMetadata = searchService.storedVectorMetadata(),
            indexReports = databaseManager.vectorIndexReports,
            threshold = threshold,
            onThresholdChange = { threshold = it },
            onDismiss = { showDiagnostics = false }
        )
    }
}

// MARK: - Step 1

/**
 * Scripted demo queries, all grocery. Each was measured against the real corpus before being
 * put here — every one returns the right product first, and keyword search on the same
 * catalogue either misses it or buries it. Same list as iOS.
 */
private val suggestions: List<String>
    get() = buildList {
        add("high-protein shake that's low in sugar and dairy-free")
        add("plant-based protein with no whey")
        add("a drink with electrolytes for after a workout")
        add("sustainably sourced fish")
        if (AppConfig.FOOTWEAR_NARRATIVE_ENABLED) {
            add("breathable lightweight blue running shoes")
        }
    }

@Composable
private fun ProductSearchSection(
    searchService: CopilotSearchService,
    threshold: Double,
    onThresholdChange: (Double) -> Unit,
    onSearchStart: () -> Unit,
    /** Carries the tapped product into the Ask step, matching the iOS result card. */
    onAskAbout: (GroceryItem) -> Unit,
    /** Carries the product's aisle/shelf into the planogram audit (PRD Case 1). */
    onAuditShelf: (ShelfContext) -> Unit,
    scope: kotlinx.coroutines.CoroutineScope
) {
    var queryText by remember { mutableStateOf("") }
    var hits by remember { mutableStateOf<List<SemanticHit>>(emptyList()) }
    var keywordHits by remember { mutableStateOf<List<GroceryItem>>(emptyList()) }
    var isSearching by remember { mutableStateOf(false) }
    var hasSearched by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var showFilters by remember { mutableStateOf(false) }
    var showKeywordDetail by remember { mutableStateOf(false) }
    var categoryFilter by remember { mutableStateOf("") }
    var inStockOnly by remember { mutableStateOf(false) }
    val speech = rememberSpeechInput()

    fun runSearch(text: String) {
        val query = text.trim()
        if (query.isEmpty()) return
        onSearchStart()
        // Submitting has to end dictation too. The recogniser keeps a live audio session and
        // goes on appending to the field, so leaving it running meant the query kept mutating
        // after the search was issued — and the mic stayed hot with no obvious way to stop it.
        // A no-op when it is not listening, so the mic's own onFinal path is unaffected.
        speech?.stop()
        isSearching = true
        errorMessage = null
        showKeywordDetail = false
        scope.launch {
            try {
                // Embedding plus the vector query are blocking work; keep them off the UI
                // thread so the search button does not freeze mid-tap.
                val (semantic, keyword) = withContext(Dispatchers.Default) {
                    val s = searchService.search(
                        query = query,
                        threshold = threshold,
                        category = categoryFilter.ifEmpty { null },
                        inStockOnly = inStockOnly
                    )
                    s to searchService.keywordSearch(query)
                }
                hits = semantic
                keywordHits = keyword
                hasSearched = true
            } catch (e: Exception) {
                errorMessage = "Search failed: ${e.message}"
                hits = emptyList()
                hasSearched = true
            } finally {
                isSearching = false
            }
        }
    }

    Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            OutlinedTextField(
                value = queryText,
                onValueChange = { queryText = it },
                placeholder = { Text("Describe what the shopper wants…") },
                leadingIcon = { Icon(Icons.Default.Search, null, tint = Accent) },
                trailingIcon = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (queryText.isNotEmpty() && speech?.isListening != true) {
                            IconButton(onClick = {
                                queryText = ""; hits = emptyList()
                                keywordHits = emptyList(); hasSearched = false
                            }) { Icon(Icons.Default.Clear, "Clear") }
                        }
                        speech?.let { MicButton(it) { spoken -> runSearch(spoken) } }
                    }
                },
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(onSearch = { runSearch(queryText) }),
                modifier = Modifier.fillMaxWidth(),
                maxLines = 3
            )

            // Spoken words appear in the field as they are recognised, matching iOS, so the
            // associate reads them where they would have typed and can edit before searching.
            if (speech != null) {
                LaunchedEffect(speech.transcript) {
                    if (speech.isListening && speech.transcript.isNotEmpty()) {
                        queryText = speech.transcript
                    }
                }
                ListeningRow(speech)
                speech.errorMessage?.let { message ->
                    Text(message, fontSize = 12.sp, color = Color(0xFFE65100))
                }
            }

            Button(
                onClick = { runSearch(queryText) },
                enabled = queryText.isNotBlank() && !isSearching,
                colors = ButtonDefaults.buttonColors(containerColor = Accent),
                modifier = Modifier.fillMaxWidth()
            ) { Text("Search", fontWeight = FontWeight.SemiBold) }

            TextButton(onClick = { showFilters = !showFilters }) {
                Text("Hybrid filters", color = Accent, fontWeight = FontWeight.SemiBold)
            }
            if (showFilters) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Category filter and stock predicate run in the same SQL++ statement " +
                        "as the vector distance — that is the hybrid search path.",
                        fontSize = 11.sp, color = Color.Gray)
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("In stock only", fontSize = 13.sp)
                        Spacer(Modifier.weight(1f))
                        Switch(checked = inStockOnly, onCheckedChange = { inStockOnly = it })
                    }
                    Text("Relevance cutoff  ${"%.2f".format(threshold)}", fontSize = 13.sp)
                    Slider(
                        value = threshold.toFloat(),
                        onValueChange = { onThresholdChange(it.toDouble()) },
                        valueRange = 0.2f..1.2f,
                        colors = SliderDefaults.colors(thumbColor = Accent, activeTrackColor = Accent)
                    )
                }
            }
        }
    }

    errorMessage?.let { message ->
        Card(colors = CardDefaults.cardColors(Color(0xFFFFE0B2))) {
            Row(Modifier.padding(12.dp), verticalAlignment = Alignment.Top) {
                Icon(Icons.Default.Warning, null, tint = Color(0xFFE65100))
                Spacer(Modifier.width(8.dp))
                Text(message, fontSize = 13.sp)
            }
        }
    }

    if (isSearching) {
        Row(Modifier.fillMaxWidth().padding(vertical = 20.dp),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically) {
            CircularProgressIndicator(color = Accent, modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(10.dp))
            Text("Embedding query on-device…", fontSize = 13.sp, color = Color.Gray)
        }
    }

    if (hasSearched && !isSearching && errorMessage == null) {
        // Echo back a price bound the query itself carried. Worth showing rather than applying
        // silently: results are being excluded by a filter the user typed in prose, and it makes
        // the hybrid query legible — the phrase visibly leaves the vector search and becomes SQL.
        searchService.lastConstraints.summary?.let { summary ->
            Surface(color = Accent.copy(alpha = 0.10f), shape = RoundedCornerShape(8.dp)) {
                Row(
                    Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 7.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.FilterAlt, null, tint = Accent,
                        modifier = Modifier.size(15.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Price filter from your query: ", fontSize = 11.sp, color = Color.Gray)
                    Text(summary, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.weight(1f))
                    Text("SQL++ WHERE", fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace, color = Color.Gray)
                }
            }
        }
        ComparisonStrip(
            semanticCount = hits.size,
            keywordHits = keywordHits,
            relevantIds = hits.map { it.item.id }.toSet(),
            threshold = threshold,
            expanded = showKeywordDetail,
            onToggle = { showKeywordDetail = !showKeywordDetail }
        )
        if (hits.isEmpty()) {
            Column(Modifier.fillMaxWidth().padding(vertical = 24.dp),
                horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Default.Search, null, tint = Color.Gray)
                Spacer(Modifier.height(6.dp))
                Text("No products within the relevance cutoff", fontWeight = FontWeight.Medium)
                Text("Nothing scored below a cosine distance of ${"%.2f".format(threshold)}. " +
                    "Raise the cutoff in Hybrid filters to see the nearest matches anyway.",
                    fontSize = 12.sp, color = Color.Gray,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center)
            }
        } else {
            hits.forEachIndexed { index, hit ->
                SemanticResultCard(
                    hit = hit,
                    rank = index + 1,
                    onAsk = { onAskAbout(hit.item) },
                    // Only offered when the product's location names a shelf — without one there
                    // is no planogram to open.
                    onAuditShelf = hit.item.location?.let { loc ->
                        loc.shelf?.let { shelf ->
                            { onAuditShelf(ShelfContext(loc.aisle, shelf)) }
                        }
                    }
                )
            }
        }
    }

    if (!hasSearched && !isSearching && errorMessage == null) {
        Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Semantic product lookup", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text("Describe what the shopper is asking for in their own words. The query is " +
                    "embedded on this device and matched against product description vectors " +
                    "in Couchbase Lite — no network call, no cloud round-trip.",
                    fontSize = 12.sp, color = Color.Gray)
                Text("TRY ONE OF THESE", fontSize = 11.sp, fontWeight = FontWeight.Bold,
                    color = Color.Gray)
                suggestions.forEach { suggestion ->
                    Surface(
                        onClick = { queryText = suggestion; runSearch(suggestion) },
                        color = Cream, shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text("“$suggestion”", fontSize = 12.sp,
                                modifier = Modifier.weight(1f))
                            Icon(Icons.Default.ArrowForward, null, tint = Accent)
                        }
                    }
                }
            }
        }
    }
}

/** The head-to-head strip. This is the argument of Step 1 made visible. */
@Composable
private fun ComparisonStrip(
    semanticCount: Int,
    keywordHits: List<GroceryItem>,
    relevantIds: Set<String>,
    threshold: Double,
    expanded: Boolean,
    onToggle: () -> Unit
) {
    val overlap = keywordHits.count { relevantIds.contains(it.id) }
    val explanation = when {
        // Claiming semantic "ranked the right products first" while showing zero results would
        // be false, and the demo's argument rests on this strip being trustworthy.
        semanticCount == 0 ->
            "Nothing in this store's catalogue came within the relevance cutoff, so the " +
                "copilot reports no match rather than guessing."
        keywordHits.isEmpty() ->
            "A keyword search over product names and categories returns nothing for this " +
                "query — no product is literally named this. Semantic search matched against " +
                "the product descriptions instead."
        overlap == 0 ->
            "Keyword search returned ${keywordHits.size} products, none of which are what the " +
                "shopper asked for — it matched on incidental words. Semantic search ranked " +
                "the right products first."
        else ->
            "Keyword search returned ${keywordHits.size} products and happened to include " +
                "$overlap relevant one${if (overlap == 1) "" else "s"}, unranked and mixed in " +
                "with the rest. Semantic search ordered them by how well they actually match."
    }

    Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(color = Accent, shape = RoundedCornerShape(6.dp)) {
                    Text("Semantic", Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.width(6.dp))
                Text("$semanticCount relevant", fontSize = 12.sp, color = Color.Gray)
                Spacer(Modifier.weight(1f))
                Surface(color = Color(0x2E888888), shape = RoundedCornerShape(6.dp)) {
                    Text("Keyword", Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        color = Color.Gray, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.width(6.dp))
                Text(
                    if (keywordHits.isEmpty()) "0 results" else "${keywordHits.size} hits",
                    fontSize = 12.sp,
                    color = if (keywordHits.isEmpty()) Color.Red else Color.Gray
                )
            }
            Text(explanation, fontSize = 12.sp, color = Color.Gray)
            if (keywordHits.isNotEmpty()) {
                TextButton(onClick = onToggle, contentPadding = PaddingValues(0.dp)) {
                    Text(
                        if (expanded) "Hide what keyword search returned"
                        else "Show what keyword search returned",
                        color = Accent, fontSize = 12.sp, fontWeight = FontWeight.SemiBold
                    )
                }
                if (expanded) {
                    keywordHits.take(8).forEach { item ->
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            val relevant = relevantIds.contains(item.id)
                            Icon(
                                if (relevant) Icons.Default.CheckCircle else Icons.Default.Cancel,
                                null,
                                tint = if (relevant) Color(0xFF2E7D32) else Color.Red,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(Modifier.width(6.dp))
                            Text(item.name, fontSize = 12.sp)
                            Spacer(Modifier.width(6.dp))
                            Text(item.type, fontSize = 11.sp, color = Color.Gray)
                        }
                    }
                    if (keywordHits.size > 8) {
                        Text("+ ${keywordHits.size - 8} more", fontSize = 11.sp, color = Color.Gray)
                    }
                }
            }
        }
    }
}

/** A single semantic match. Leads with location, because that is what the associate acts on. */
@Composable
private fun SemanticResultCard(
    hit: SemanticHit,
    rank: Int,
    onAsk: (() -> Unit)? = null,
    onAuditShelf: (() -> Unit)? = null
) {
    val item = hit.item
    Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
        Row(Modifier.padding(12.dp)) {
            AsyncImage(
                model = item.imageURL,
                contentDescription = item.name,
                contentScale = ContentScale.Fit,
                modifier = Modifier.size(70.dp)
            )
            Spacer(Modifier.width(12.dp))
            // weight(1f) is load-bearing: without it this Column is measured unbounded, the
            // single-line location text demands its full intrinsic width, and the whole card
            // blows out — the location control stretched and its trailing label and chevron
            // were pushed off-screen entirely.
            Column(
                Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Row {
                    Text("$rank.", color = Accent, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(Modifier.width(6.dp))
                    Text(item.name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                }
                Row {
                    item.brand?.let {
                        Text(it, fontSize = 11.sp, color = Color.Gray)
                        Text(" · ", fontSize = 11.sp, color = Color.Gray)
                    }
                    Text("$%.2f".format(item.price), fontSize = 11.sp,
                        fontWeight = FontWeight.Medium)
                    Text(" · ", fontSize = 11.sp, color = Color.Gray)
                    Text("${item.quantity} in stock", fontSize = 11.sp,
                        color = if (item.quantity > 0) Color.Gray else Color.Red)
                }
                item.location?.let { loc ->
                    val label = buildString {
                        append("Aisle ${loc.aisle}")
                        loc.shelf?.let { append(" shelf $it") }
                        if (loc.bin > 0) append(" bin ${loc.bin}")
                        loc.section?.let { append(" · $it") }
                    }
                    // When it can open the planogram it is drawn as an actual control — tinted
                    // fill, border, named action. It previously rendered as plain text with a
                    // small chevron, which read as a label, so the only way to discover it was
                    // tappable was to tap it by accident.
                    if (onAuditShelf != null) {
                        Surface(
                            onClick = onAuditShelf,
                            color = Accent.copy(alpha = 0.12f),
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, Accent.copy(alpha = 0.45f)),
                            modifier = Modifier.fillMaxWidth().wrapContentHeight()
                        ) {
                            Row(
                                Modifier.padding(horizontal = 9.dp, vertical = 7.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Place, null, tint = Accent,
                                    modifier = Modifier.size(13.dp))
                                Spacer(Modifier.width(6.dp))
                                // The location gets the flexible space and ellipsizes; the
                                // trailing action must never be the thing that gets pushed out,
                                // since it is what signals this is tappable at all.
                                Text(
                                    label, fontSize = 12.sp, fontWeight = FontWeight.SemiBold,
                                    maxLines = 1, overflow = TextOverflow.Ellipsis,
                                    modifier = Modifier.weight(1f)
                                )
                                Spacer(Modifier.width(6.dp))
                                Text("Check shelf", fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold, color = Accent,
                                    maxLines = 1)
                                Icon(Icons.Default.ChevronRight, null, tint = Accent,
                                    modifier = Modifier.size(14.dp))
                            }
                        }
                    } else {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Place, null, tint = Color.Gray,
                                modifier = Modifier.size(13.dp))
                            Spacer(Modifier.width(4.dp))
                            Text(label, fontSize = 12.sp, color = Color.Gray)
                        }
                    }
                }
                item.attributes?.displayBadges?.takeIf { it.isNotEmpty() }?.let { badges ->
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        badges.take(4).forEach { badge ->
                            Surface(color = Accent.copy(alpha = 0.14f),
                                shape = RoundedCornerShape(4.dp)) {
                                Text(badge, Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                    fontSize = 10.sp)
                            }
                        }
                    }
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("${hit.similarityPercent}% match", color = Accent, fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.width(6.dp))
                    Text("distance ${"%.4f".format(hit.distance)}", fontSize = 11.sp,
                        color = Color.Gray, fontFamily = FontFamily.Monospace)
                    if (onAsk != null) {
                        Spacer(Modifier.weight(1f))
                        Surface(
                            onClick = onAsk,
                            color = Accent.copy(alpha = 0.16f),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Row(
                                Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.QuestionAnswer, null,
                                    modifier = Modifier.size(13.dp))
                                Spacer(Modifier.width(3.dp))
                                Text("Ask", fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                            }
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Step 2 (UI only on Android)

@Composable
private fun PlanogramSection(databaseManager: DatabaseManager, incoming: ShelfContext? = null) {
    // Real now, not a placeholder: this wires Priya's own PlanogramSearch.kt / ClipImageEmbedder
    // — the grid-tiling, per-cell APPROX_VECTOR_DISTANCE, per-column median verdict logic she
    // documented and tested — rather than reinventing it. The screen layout is the merge she
    // asked for on Aug 6: her shelf-map grid and per-product findings, combined with the golden
    // reference card and dropdown from the review-feedback rebuild, so nothing from either design
    // is dropped.
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var shelves by remember { mutableStateOf<List<ShelfRef>>(emptyList()) }
    var selectedShelf by remember { mutableStateOf<ShelfRef?>(null) }
    var shelfMenuOpen by remember { mutableStateOf(false) }
    // Whether the current shelf actually came from the Find hand-off. Distinct from
    // `incoming != null`, which stays true for the life of the screen — so the hint used to keep
    // claiming the shelf was carried over long after the user had picked a different one.
    var cameFromFind by remember { mutableStateOf(false) }
    var goldenUrl by remember { mutableStateOf<String?>(null) }
    var previewBitmap by remember { mutableStateOf<Bitmap?>(null) }
    var previewLabel by remember { mutableStateOf<String?>(null) }
    // Which sample variant is loaded. Without this the two check buttons cannot show
    // which one produced the result on screen.
    var previewVariant by remember { mutableStateOf<String?>(null) }
    var result by remember { mutableStateOf<PlanogramAuditResult?>(null) }
    var isAuditing by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var elapsedMs by remember { mutableStateOf(0L) }

    fun loadSample(store: String, shelf: ShelfRef, variant: String, label: String) {
        val name = "shelf_samples/${store}_aisle${shelf.aisle}_${shelf.shelf}_${variant}.png"
        val bmp = try {
            context.assets.open(name).use { BitmapFactory.decodeStream(it) }
        } catch (e: Exception) {
            null
        }
        if (bmp == null) {
            errorMessage = "Sample image $name is not in assets. All 24 shelves ship golden " +
                "and missing-stock views for both stores, so this usually means the asset " +
                "folder is incomplete."
            return
        }
        errorMessage = null
        previewBitmap = bmp
        previewLabel = label
        previewVariant = variant
        result = null
    }

    LaunchedEffect(Unit) {
        withContext(Dispatchers.IO) {
            shelves = databaseManager.planogramShelves()
        }
        // Case 1 hands us a location from the product just looked up; Case 2 is a cold open,
        // where there is nothing to infer and the first shelf is as good as any.
        if (selectedShelf == null) {
            val matched = incoming?.let { ctx ->
                shelves.firstOrNull { it.aisle == ctx.aisle && it.shelf == ctx.shelf }
            }
            selectedShelf = matched ?: shelves.firstOrNull()
            cameFromFind = matched != null
        }
    }
    LaunchedEffect(selectedShelf) {
        val shelf = selectedShelf ?: return@LaunchedEffect
        goldenUrl = null
        previewBitmap = null
        previewLabel = null
        previewVariant = null
        result = null
        errorMessage = null
        goldenUrl = withContext(Dispatchers.IO) { databaseManager.planogramGoldenUrl(shelf.shelf) }
    }

    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
        // Shelf picker
        Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
            Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("SHELF TO AUDIT", fontSize = 11.sp, fontWeight = FontWeight.Bold,
                    color = Color.Gray)
                Box {
                    Surface(
                        onClick = { shelfMenuOpen = true },
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            Modifier.padding(horizontal = 14.dp, vertical = 11.dp).fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text(
                                    selectedShelf?.let { "Aisle ${it.aisle} · Shelf ${it.shelf}" }
                                        ?: "Choose a shelf",
                                    fontSize = 15.sp, fontWeight = FontWeight.SemiBold
                                )
                                selectedShelf?.section?.takeIf { it.isNotEmpty() }?.let {
                                    Text(it, fontSize = 12.sp, color = Color.Gray)
                                }
                            }
                            Icon(Icons.Default.UnfoldMore, null, tint = Color.Gray,
                                modifier = Modifier.size(16.dp))
                        }
                    }
                    DropdownMenu(shelfMenuOpen, onDismissRequest = { shelfMenuOpen = false }) {
                        shelves.forEach { shelf ->
                            DropdownMenuItem(
                                text = {
                                    Text(
                                        "Aisle ${shelf.aisle} · Shelf ${shelf.shelf}" +
                                            if (shelf.section.isNotEmpty()) " — ${shelf.section}"
                                            else ""
                                    )
                                },
                                onClick = {
                                    selectedShelf = shelf
                                    cameFromFind = false
                                    shelfMenuOpen = false
                                }
                            )
                        }
                    }
                }
                if (cameFromFind) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.SubdirectoryArrowRight, null,
                            tint = Color(0xFF1565C0), modifier = Modifier.size(13.dp)
                        )
                        Spacer(Modifier.width(4.dp))
                        Text(
                            "Carried over from the product you looked up in Find.",
                            fontSize = 11.sp, color = Color(0xFF1565C0)
                        )
                    }
                }
            }
        }

        val shelf = selectedShelf
        if (shelf != null) {
            // Golden reference — same framing as iOS, no "Photograph this shelf": golden imagery
            // is shot from one fixed angle, so a live camera capture could never line up with it.
            Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
                Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("GOLDEN IMAGE REFERENCE (IDEAL LAYOUT)", fontSize = 11.sp,
                        fontWeight = FontWeight.Bold, color = Color.Gray)
                    if (goldenUrl != null) {
                        AsyncImage(
                            model = goldenUrl, contentDescription = "Golden layout",
                            contentScale = ContentScale.Fit,
                            modifier = Modifier.fillMaxWidth().height(150.dp)
                                .background(Color(0x0D000000)).clip(RoundedCornerShape(8.dp))
                        )
                    } else {
                        Box(
                            Modifier.fillMaxWidth().height(150.dp)
                                .background(Color(0x0D000000), RoundedCornerShape(8.dp)),
                            contentAlignment = Alignment.Center
                        ) { Text("Golden image not reachable", fontSize = 11.sp, color = Color.Gray) }
                    }

                    Divider()
                    Text(
                        "Pick a shelf image to check against this reference. Each cell is " +
                            "embedded on-device with CLIP and matched against the golden layout " +
                            "cell by cell.",
                        fontSize = 12.sp, color = Color.Gray
                    )

                    val store = if (AppConfig.currentStore == StoreLocation.AA) "aa" else "nyc"
                    // Styled as a selection, not as two competing calls to action. Hard-coding
                    // Organized as the filled primary made it look active even while the screen
                    // showed disorganized results. Accent now follows the selection; the real
                    // primary action is "Audit shelf" below.
                    if (!shelf.auditable) {
                        // The golden image and shelf identity are still worth showing — only the
                        // audit needs the grid. Saying so next to the disabled action beats
                        // failing after the tap.
                        Surface(
                            color = Color(0xFFF5A623).copy(alpha = 0.14f),
                            shape = RoundedCornerShape(9.dp)
                        ) {
                            Row(Modifier.padding(10.dp), verticalAlignment = Alignment.Top) {
                                Icon(Icons.Default.Warning, null, tint = Color(0xFFF5A623),
                                    modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(8.dp))
                                Text(
                                    "This shelf's golden layout has not synced yet, so it " +
                                        "cannot be audited. Import the current planograms " +
                                        "dataset to enable it.",
                                    fontSize = 12.sp
                                )
                            }
                        }
                    }

                    // Stacked full-width, matching iOS. Side by side, the two titles wrapped
                    // onto three lines each and the subtitles were truncated to the point of
                    // being useless.
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        checkVariantButton(
                            title = "Check Organized Shelf",
                            subtitle = "A correctly stocked shelf — should come back fully " +
                                "compliant.",
                            selected = previewVariant == "golden",
                            enabled = shelf.auditable,
                            modifier = Modifier.fillMaxWidth()
                        ) { loadSample(store, shelf, "golden", "Check Organized Shelf") }
                        checkVariantButton(
                            title = "Check Disorganized Shelf",
                            subtitle = "A shelf with a product missing — should flag the gap.",
                            selected = previewVariant == "actual_missing",
                            enabled = shelf.auditable,
                            modifier = Modifier.fillMaxWidth()
                        ) { loadSample(store, shelf, "actual_missing", "Check Disorganized Shelf") }
                    }
                }
            }
        }

        if (previewBitmap != null && shelf != null) {
            Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
                Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    previewLabel?.let {
                        Text(it.uppercase(), fontSize = 11.sp, fontWeight = FontWeight.Bold,
                            color = Color.Gray)
                    }
                    Image(
                        previewBitmap!!.asImageBitmap(), contentDescription = "Selected view",
                        contentScale = ContentScale.Fit,
                        modifier = Modifier.fillMaxWidth().height(180.dp)
                            .clip(RoundedCornerShape(8.dp))
                    )
                    Button(
                        onClick = {
                            val bmp = previewBitmap ?: return@Button
                            // The 335MB CLIP graph loads on a background thread at app start, so
                            // an early tap can arrive before it is usable. Say so plainly instead
                            // of letting every cell silently fail to embed and reporting the
                            // shelf as empty — which looks like a real audit result.
                            if (!ClipImageEmbedder.isReady) {
                                errorMessage = "CLIP model not ready yet " +
                                    "(${ClipImageEmbedder.status}). It loads in the background " +
                                    "at startup — wait a moment and try again."
                                return@Button
                            }
                            isAuditing = true
                            errorMessage = null
                            scope.launch {
                                val started = System.nanoTime()
                                val audit = withContext(Dispatchers.Default) {
                                    databaseManager.auditShelf(shelf.shelf, bmp)
                                }
                                elapsedMs = (System.nanoTime() - started) / 1_000_000
                                isAuditing = false
                                if (audit == null) {
                                    errorMessage = "Audit failed — is the CLIP model loaded? " +
                                        "Status: ${ClipImageEmbedder.status}"
                                } else {
                                    result = audit
                                }
                            }
                        },
                        enabled = !isAuditing,
                        colors = ButtonDefaults.buttonColors(containerColor = Accent),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        if (isAuditing) {
                            CircularProgressIndicator(Modifier.size(16.dp), color = Color.White,
                                strokeWidth = 2.dp)
                            Spacer(Modifier.width(8.dp))
                        }
                        Text(if (isAuditing) "Auditing…" else "Audit shelf",
                            fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        }

        errorMessage?.let {
            Card(colors = CardDefaults.cardColors(Color(0xFFFFE0B2))) {
                Text(it, Modifier.padding(12.dp), fontSize = 12.sp)
            }
        }

        result?.let { r -> auditResultCard(r, elapsedMs) }
    }
}

/** One of the two sample-view choices. Filled when selected so the active view is unambiguous. */
@Composable
private fun checkVariantButton(
    title: String,
    subtitle: String,
    selected: Boolean,
    enabled: Boolean = true,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    val content = if (selected) Color.White else MaterialTheme.colorScheme.onSurface
    Surface(
        onClick = onClick,
        enabled = enabled,
        color = if (selected) Accent else MaterialTheme.colorScheme.surfaceVariant,
        shape = RoundedCornerShape(10.dp),
        modifier = modifier.alpha(if (enabled) 1f else 0.5f)
    ) {
        Row(Modifier.padding(horizontal = 10.dp, vertical = 9.dp)) {
            Icon(
                if (selected) Icons.Default.RadioButtonChecked else Icons.Default.RadioButtonUnchecked,
                null,
                tint = if (selected) Color.White else Color.Gray,
                modifier = Modifier.size(15.dp).padding(top = 1.dp)
            )
            Spacer(Modifier.width(7.dp))
            Column {
                Text(title, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = content)
                Text(
                    subtitle, fontSize = 10.sp,
                    color = if (selected) Color.White.copy(alpha = 0.9f) else Color.Gray
                )
            }
        }
    }
}

/** Status colour for one shelf-map cell. Matches iOS `CopilotTheme` so the two read alike. */
private fun cellColor(status: CellStatus): Color = when (status) {
    CellStatus.CORRECT -> Color(0xFF0F9D58)
    CellStatus.MISPLACED -> Color(0xFFF5A623)
    CellStatus.EMPTY -> Color(0xFFEA2328)
}

@Composable
private fun mapLegend(label: String, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Surface(color = color, shape = RoundedCornerShape(2.dp), modifier = Modifier.size(9.dp)) {}
        Spacer(Modifier.width(4.dp))
        Text(label, fontSize = 10.sp, color = Color.Gray)
    }
}

/** Priya's shelf-map grid, merged with a per-product findings list underneath it. */
@Composable
private fun auditResultCard(result: PlanogramAuditResult, elapsedMs: Long) {
    val flagged = result.verdicts.count { !it.ok }
    Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    if (flagged == 0) Icons.Default.CheckCircle else Icons.Default.Warning,
                    null,
                    tint = if (flagged == 0) Color(0xFF0F9D58) else Color(0xFFF5A623),
                    modifier = Modifier.size(16.dp)
                )
                Spacer(Modifier.width(6.dp))
                Text(
                    "$flagged of ${result.verdicts.size} products flagged · ${elapsedMs} ms",
                    fontSize = 13.sp, fontWeight = FontWeight.Medium
                )
            }

            // One column per product with the product named underneath, rather than an anonymous
            // row×col matrix: a shelf's tiers hold the same product top to bottom, so the column
            // is the unit that maps onto something the associate can actually go and fix.
            Text(
                "SHELF MAP (PER PRODUCT)",
                fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray
            )
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                for (col in 0 until result.grid.cols) {
                    val columnCells = result.cells.filter { it.col == col }.sortedBy { it.row }
                    Column(
                        Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(3.dp)
                    ) {
                        columnCells.forEach { cell ->
                            Surface(
                                color = cellColor(cell.status),
                                shape = RoundedCornerShape(5.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    "%.2f".format(cell.distance),
                                    Modifier.padding(vertical = 9.dp).fillMaxWidth(),
                                    color = Color.White, fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                                )
                            }
                        }
                        Text(
                            columnCells.firstOrNull()?.expectedProduct ?: "",
                            fontSize = 9.sp, color = Color.Gray, maxLines = 2,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                mapLegend("In place", Color(0xFF0F9D58))
                mapLegend("Misplaced", Color(0xFFF5A623))
                mapLegend("Empty", Color(0xFFEA2328))
            }

            Text("FINDINGS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
            result.verdicts.forEach { v ->
                Row(verticalAlignment = Alignment.Top) {
                    Icon(
                        if (v.ok) Icons.Default.CheckCircle else Icons.Default.Warning,
                        null,
                        tint = if (v.ok) Color(0xFF0F9D58) else Color(0xFFF5A623),
                        modifier = Modifier.size(16.dp).padding(top = 2.dp)
                    )
                    Spacer(Modifier.width(8.dp))
                    Column {
                        Text(v.product, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                        Text(
                            "${v.note} · median d ${"%.3f".format(v.medianDistance)}",
                            fontSize = 12.sp, color = Color.Gray
                        )
                    }
                }
            }
        }
    }
}

// MARK: - Step 3: retrieval-augmented answers

/**
 * Retrieval runs on-device by vector search over the store's `product_knowledge` collection.
 * Generation is availability-gated: with a model present the answer is grounded in the
 * retrieved chunks, and without one the chunks themselves are shown rather than an invented
 * answer.
 */
@Composable
private fun AskSection(
    searchService: CopilotSearchService,
    /** Set when the associate tapped Ask on a search result. */
    product: GroceryItem?,
    scope: kotlinx.coroutines.CoroutineScope
) {
    val context = LocalContext.current
    var question by remember { mutableStateOf("") }
    var chunks by remember { mutableStateOf<List<KnowledgeHit>>(emptyList()) }
    var isWorking by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var retrieveMillis by remember { mutableStateOf(0.0) }
    var answer by remember { mutableStateOf("") }
    var generateMillis by remember { mutableStateOf(0.0) }
    var stage by remember { mutableStateOf<String?>(null) }
    val speech = rememberSpeechInput()
    val askKeyboard = LocalSoftwareKeyboardController.current
    var llmAvailability by remember { mutableStateOf(LocalLanguageModel.availability(context)) }
    // Progress and errors live on LocalLanguageModel, not here, so the transfer keeps running
    // when this screen leaves composition — see startDownload().
    val downloadProgress = LocalLanguageModel.downloadProgress
    val downloadError = LocalLanguageModel.downloadError

    // Re-check availability whenever a download completes, including one that finished while
    // the user was on another tab.
    LaunchedEffect(LocalLanguageModel.downloadGeneration) {
        llmAvailability = LocalLanguageModel.availability(context)
    }

    val prompts = listOf(
        "I'm training for my first 5k — what should I drink after a run?",
        "How much protein do I need for endurance recovery?",
        "What are my dairy-free protein options?"
    )

    fun ask(text: String) {
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return
        // Find hides the keyboard via onSearchStart; Ask had no equivalent, so the keyboard
        // stayed up over the answer the user had just asked for.
        askKeyboard?.hide()
        // Ends dictation on submit — see runSearch().
        speech?.stop()
        isWorking = true
        errorMessage = null
        chunks = emptyList()
        answer = ""
        generateMillis = 0.0
        stage = "Searching the knowledge collection…"
        scope.launch {
            try {
                val started = System.nanoTime()
                val retrieved = withContext(Dispatchers.Default) {
                    searchService.retrieveKnowledge(trimmed, relatedCategory = product?.type)
                }
                retrieveMillis = (System.nanoTime() - started) / 1_000_000.0
                chunks = retrieved
                if (retrieved.isEmpty()) {
                    errorMessage = "Nothing in this store's knowledge collection covers that."
                    stage = null
                    isWorking = false
                    return@launch
                }

                // ---- generate ----
                if (llmAvailability !is LocalLanguageModel.Availability.Ready) {
                    // Retrieval already succeeded, so just stop before generation rather than
                    // erroring the whole ask — the sources retrieved above are still shown.
                    stage = null
                    isWorking = false
                    return@launch
                }

                stage = "Writing an answer from ${retrieved.size} sources…"
                val generateStarted = System.nanoTime()
                val generated = withContext(Dispatchers.Default) {
                    LocalLanguageModel.generate(
                        context,
                        LocalLanguageModel.buildPrompt(
                            question = trimmed,
                            chunks = retrieved,
                            product = product?.let {
                                LocalLanguageModel.GroceryItemContext(
                                    name = it.name,
                                    brand = it.brand,
                                    description = it.description,
                                    badges = it.attributes?.displayBadges ?: emptyList()
                                )
                            }
                        )
                    )
                }
                generateMillis = (System.nanoTime() - generateStarted) / 1_000_000.0
                if (generated == null) {
                    errorMessage = "Retrieval worked and the sources below are what a grounded " +
                        "answer would be written from, but generation failed on this device. " +
                        "Check logcat for LocalLLM."
                } else {
                    answer = generated
                }
            } catch (e: Exception) {
                errorMessage = if (chunks.isEmpty()) {
                    "Retrieval failed: ${e.message}"
                } else {
                    "Could not generate an answer: ${e.message}. The retrieved sources are shown."
                }
            } finally {
                stage = null
                isWorking = false
            }
        }
    }

    product?.let { item ->
        Surface(color = Accent.copy(alpha = 0.12f), shape = RoundedCornerShape(10.dp)) {
            Row(Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
                AsyncImage(
                    model = item.imageURL,
                    contentDescription = item.name,
                    contentScale = ContentScale.Fit,
                    modifier = Modifier.size(44.dp)
                )
                Spacer(Modifier.width(10.dp))
                Column {
                    Text("Asking about", fontSize = 11.sp, color = Color.Gray)
                    Text(item.name, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }

    Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            OutlinedTextField(
                value = question,
                onValueChange = { question = it },
                placeholder = { Text("Ask a question…") },
                leadingIcon = { Icon(Icons.Default.QuestionAnswer, null, tint = Accent) },
                trailingIcon = {
                    speech?.let { MicButton(it) { spoken -> ask(spoken) } }
                },
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                keyboardActions = KeyboardActions(onSend = { ask(question) }),
                modifier = Modifier.fillMaxWidth(), maxLines = 3
            )

            if (speech != null) {
                LaunchedEffect(speech.transcript) {
                    if (speech.isListening && speech.transcript.isNotEmpty()) {
                        question = speech.transcript
                    }
                }
                ListeningRow(speech)
                speech.errorMessage?.let { message ->
                    Text(message, fontSize = 12.sp, color = Color(0xFFE65100))
                }
            }

            Button(
                onClick = { ask(question) },
                enabled = question.isNotBlank() && !isWorking,
                colors = ButtonDefaults.buttonColors(containerColor = Accent),
                modifier = Modifier.fillMaxWidth()
            ) { Text("Ask", fontWeight = FontWeight.SemiBold) }
        }
    }

    // Says which half is running. Both halves are on-device: retrieval by vector search over
    // `product_knowledge`, generation by MediaPipe over a side-loaded Gemma model. When no model
    // is installed the screen says so rather than implying an answer was withheld.
    Surface(color = Color(0x1F2196F3), shape = RoundedCornerShape(10.dp)) {
        Row(Modifier.padding(12.dp)) {
            Icon(Icons.Default.Info, null, tint = Color(0xFF1565C0),
                modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text(
                when (llmAvailability) {
                    is LocalLanguageModel.Availability.Ready ->
                        "Retrieval and generation both run on-device: vector search over the " +
                            "store's `product_knowledge` collection, then " +
                            "${LocalLanguageModel.modelName(context)} via MediaPipe. No cloud " +
                            "round-trip in either half."
                    is LocalLanguageModel.Availability.Downloadable ->
                        "Retrieval runs on-device by vector search over the store's " +
                            "`product_knowledge` collection. Generation needs a one-time model " +
                            "download, after which it also runs fully on-device."
                    is LocalLanguageModel.Availability.RetrievalOnly ->
                        "Retrieval runs on-device by vector search over the store's " +
                            "`product_knowledge` collection. No language model is installed, so " +
                            "the retrieved sources are shown as-is — the retrieval half of RAG."
                },
                fontSize = 12.sp
            )
        }
    }

    val downloadable = llmAvailability as? LocalLanguageModel.Availability.Downloadable
    if (downloadable != null) {
        Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
            Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                val progress = downloadProgress
                if (progress != null) {
                    if (progress.total > 0) {
                        LinearProgressIndicator(
                            progress = { progress.fraction },
                            modifier = Modifier.fillMaxWidth()
                        )
                        Text(
                            "Downloading assistant model — ${progress.percent}% " +
                                "(${progress.bytes / 1_000_000}MB of ${progress.total / 1_000_000}MB)",
                            fontSize = 12.sp, color = Color.Gray
                        )
                    } else {
                        LinearProgressIndicator(modifier = Modifier.fillMaxWidth())
                        Text("Starting download…", fontSize = 12.sp, color = Color.Gray)
                    }
                } else {
                    downloadError?.let {
                        Text(it, fontSize = 12.sp, color = Color(0xFFC62828))
                    }
                    Button(
                        onClick = { LocalLanguageModel.startDownload(context, downloadable.url) },
                        // Couchbase red rather than the amber Accent: this is a one-time setup
                        // step, not one of the screen's primary actions, and the amber read as a
                        // warning sitting next to genuine warning banners.
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFCC2A2E)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.Download, null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text(
                            "Download assistant model " +
                                "(${downloadable.approxBytes / 1_000_000}MB)",
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    Text(
                        "One-time download, cached on this device. Generation runs entirely " +
                            "on-device afterward — no data leaves the phone.",
                        fontSize = 11.sp, color = Color.Gray
                    )
                }
            }
        }
    }

    if (isWorking || answer.isNotEmpty()) {
        Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
            Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AutoAwesome, null, tint = Accent,
                        modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(6.dp))
                    Text(
                        LocalLanguageModel.modelName(context) ?: "retrieval only",
                        fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color.Gray
                    )
                    Spacer(Modifier.weight(1f))
                    if (isWorking) {
                        CircularProgressIndicator(color = Accent, modifier = Modifier.size(14.dp))
                    }
                }
                stage?.takeIf { answer.isEmpty() }?.let {
                    Text(it, fontSize = 12.sp, color = Color.Gray)
                }
                if (answer.isNotEmpty()) {
                    Text(answer, fontSize = 14.sp)
                }
                if (generateMillis > 0.0) {
                    Text(
                        "Retrieved ${chunks.size} chunks in ${"%.1f".format(retrieveMillis)} ms, " +
                            "generated in ${"%.0f".format(generateMillis)} ms",
                        fontSize = 11.sp, color = Color.Gray, fontFamily = FontFamily.Monospace
                    )
                }
            }
        }
    }

    errorMessage?.let {
        Card(colors = CardDefaults.cardColors(Color(0xFFFFE0B2))) {
            Text(it, Modifier.padding(12.dp), fontSize = 12.sp)
        }
    }

    if (chunks.isNotEmpty()) {
        Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
            Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("${chunks.size} sources retrieved in ${"%.1f".format(retrieveMillis)} ms",
                    fontSize = 11.sp, color = Color.Gray, fontFamily = FontFamily.Monospace)
                chunks.forEach { chunk ->
                    Surface(color = Cream, shape = RoundedCornerShape(8.dp)) {
                        Column(Modifier.padding(10.dp),
                            verticalArrangement = Arrangement.spacedBy(3.dp)) {
                            Row {
                                Text(chunk.title, fontWeight = FontWeight.SemiBold, fontSize = 12.sp,
                                    modifier = Modifier.weight(1f))
                                Text("d=${"%.3f".format(chunk.distance)}", fontSize = 11.sp,
                                    color = Color.Gray, fontFamily = FontFamily.Monospace)
                            }
                            Text(chunk.chunkText, fontSize = 11.sp, color = Color.Gray)
                            Text(chunk.sourceDoc, fontSize = 10.sp, color = Color.Gray)
                        }
                    }
                }
            }
        }
    }

    if (chunks.isEmpty() && !isWorking) {
        Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("TRY ONE OF THESE", fontSize = 11.sp, fontWeight = FontWeight.Bold,
                    color = Color.Gray)
                prompts.forEach { prompt ->
                    Surface(onClick = { question = prompt; ask(prompt) },
                        color = Cream, shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()) {
                        Row(Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
                            Text("“$prompt”", fontSize = 12.sp, modifier = Modifier.weight(1f))
                            Icon(Icons.Default.ArrowForward, null, tint = Accent)
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Behind the scenes

@Composable
private fun DiagnosticsSheet(
    telemetry: SearchTelemetry,
    storedMetadata: Map<String, String>?,
    indexReports: List<String>,
    threshold: Double,
    onThresholdChange: (Double) -> Unit,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var parity by remember { mutableStateOf<String?>(null) }
    var running by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = { TextButton(onClick = onDismiss) { Text("Done") } },
        title = { Text("Behind the Scenes") },
        text = {
            Column(
                Modifier.verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Section("QUERY EMBEDDING (ON THIS DEVICE)")
                DiagRow("Model", TextEmbedder.MODEL_NAME)
                DiagRow("Dimensions", "${TextEmbedder.DIMENSIONS}")
                DiagRow("Distance metric", TextEmbedder.METRIC)
                DiagRow("Max sequence length", "${TextEmbedder.SEQUENCE_LENGTH} tokens")
                DiagRow("Runtime", TextEmbedder.RUNTIME)

                if (telemetry.queryText.isNotEmpty()) {
                    Section("LAST QUERY")
                    DiagRow("Text", telemetry.queryText)
                    DiagRow("Tokens", "${telemetry.tokenCount}")
                    DiagRow("Embed time", "%.1f ms".format(telemetry.embedMillis))
                    DiagRow("Vector search time", "%.1f ms".format(telemetry.searchMillis))
                    DiagRow("Candidates from index", "${telemetry.candidatesReturned}")
                    DiagRow("Within cutoff", "${telemetry.resultsAfterThreshold}")
                    DiagRow("Keyword would return", "${telemetry.keywordResultCount}")
                }

                Section("ON-DEVICE VECTOR INDEXES")
                if (indexReports.isEmpty()) {
                    Text("No indexes reported yet.", fontSize = 12.sp, color = Color.Gray)
                } else {
                    indexReports.forEach {
                        Text(it, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                    }
                }
                Text("The index is built by Couchbase Lite on this device from the synced " +
                    "documents. Capella stores the vectors as ordinary JSON arrays and does no " +
                    "vector work — every search runs locally.",
                    fontSize = 11.sp, color = Color.Gray)

                storedMetadata?.let { meta ->
                    Section("STORED VECTOR PROVENANCE")
                    meta.forEach { (k, v) -> DiagRow(k, v) }
                    if (meta["Model"] != TextEmbedder.MODEL_NAME) {
                        Text("Stored vectors were produced by a different model than the one " +
                            "embedding queries. Rankings will be meaningless until these match.",
                            fontSize = 12.sp, color = Color.Red)
                    }
                }

                Section("RELEVANCE CUTOFF")
                Text("Cosine distance ≤ ${"%.2f".format(threshold)}", fontSize = 13.sp)
                Slider(
                    value = threshold.toFloat(),
                    onValueChange = { onThresholdChange(it.toDouble()) },
                    valueRange = 0.2f..1.2f,
                    colors = SliderDefaults.colors(thumbColor = Accent, activeTrackColor = Accent)
                )

                Section("CLOUD ↔ EDGE PARITY SELF-CHECK")
                Text("Confirms this device's tokenizer produces the exact token ids the offline " +
                    "embedding job used — the same probes the iOS check runs. A mismatch " +
                    "silently degrades ranking rather than raising an error.",
                    fontSize = 11.sp, color = Color.Gray)
                TextButton(
                    onClick = {
                        running = true
                        scope.launch {
                            val result = withContext(Dispatchers.Default) {
                                CopilotDiagnostics.runTokenizerParityCheck(context)
                            }
                            parity = result
                            running = false
                        }
                    },
                    enabled = !running
                ) { Text("Run self-check", color = Accent) }
                parity?.let {
                    Text(it, fontSize = 11.sp, fontFamily = FontFamily.Monospace,
                        color = if (it.startsWith("PASS")) Color(0xFF2E7D32) else Color.Red)
                }
            }
        }
    )
}

// MARK: - Voice input

/**
 * A [SpeechInput] for this composition, or null when the device has no recogniser at all — in
 * which case callers simply do not draw a mic rather than offering a button that cannot work.
 */
@Composable
private fun rememberSpeechInput(): SpeechInput? {
    val context = LocalContext.current
    return remember { if (SpeechInput.isSupported(context)) SpeechInput(context) else null }
}

/**
 * Mic toggle, including the RECORD_AUDIO permission request.
 *
 * The permission is asked for on first tap rather than at launch, so the prompt arrives with
 * obvious context instead of during startup alongside the sync permissions.
 */
@Composable
private fun MicButton(speech: SpeechInput, onFinal: (String) -> Unit) {
    val context = LocalContext.current
    var startAfterGrant by remember { mutableStateOf(false) }
    val permission = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted && startAfterGrant) speech.start(onFinal)
        startAfterGrant = false
    }

    IconButton(onClick = {
        if (speech.isListening) {
            speech.stop()
        } else {
            speech.clearError()
            val granted = ContextCompat.checkSelfPermission(
                context, Manifest.permission.RECORD_AUDIO
            ) == PackageManager.PERMISSION_GRANTED
            if (granted) {
                speech.start(onFinal)
            } else {
                startAfterGrant = true
                permission.launch(Manifest.permission.RECORD_AUDIO)
            }
        }
    }) {
        Icon(
            if (speech.isListening) Icons.Default.Stop else Icons.Default.Mic,
            contentDescription = if (speech.isListening) "Stop listening" else "Search by voice",
            tint = if (speech.isListening) Color.Red else Accent
        )
    }
}

/**
 * Listening state. Deliberately does not repeat the words — those go into the text field, so
 * showing them here too would put the same sentence on screen twice.
 *
 * The badge reports what actually happened: "on-device" only when the recogniser genuinely
 * cannot reach the network, and "cloud" otherwise, because Android's default recogniser is
 * network-backed and claiming otherwise would be untrue.
 */
@Composable
private fun ListeningRow(speech: SpeechInput) {
    if (!speech.isListening) return
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(Icons.Default.GraphicEq, null, tint = Color.Red, modifier = Modifier.size(16.dp))
        Spacer(Modifier.width(6.dp))
        Text("Listening — tap stop when done", fontSize = 12.sp, color = Color.Gray)
        Spacer(Modifier.weight(1f))
        val onDevice = speech.isOnDevice
        Surface(
            color = if (onDevice) Color(0x2600C853) else Color(0x26FF6D00),
            shape = RoundedCornerShape(4.dp)
        ) {
            Text(
                if (onDevice) "on-device" else "cloud fallback",
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = if (onDevice) Color(0xFF1B5E20) else Color(0xFFE65100),
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
            )
        }
    }
}

@Composable
private fun Section(title: String) {
    Spacer(Modifier.height(6.dp))
    Text(title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
}

@Composable
private fun DiagRow(label: String, value: String) {
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.Top) {
        Text(label, fontSize = 12.sp, color = Color.Gray)
        Spacer(Modifier.width(12.dp))
        Text(value, fontSize = 12.sp, modifier = Modifier.weight(1f),
            textAlign = androidx.compose.ui.text.style.TextAlign.End)
    }
}
