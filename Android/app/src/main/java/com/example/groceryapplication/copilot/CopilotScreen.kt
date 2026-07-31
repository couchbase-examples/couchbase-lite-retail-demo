package com.example.groceryapplication.copilot

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
    ASK("Ask"),
    TASKS("Tasks")
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
    val taskService = remember {
        TaskService(context) { databaseManager.getDatabase() }
    }

    var mode by remember { mutableStateOf(CopilotMode.FIND) }
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
                scope = scope
            )
            CopilotMode.PLANOGRAM -> PlanogramSection()
            CopilotMode.ASK -> AskSection(searchService = searchService, scope = scope)
            CopilotMode.TASKS -> TasksSection(
                taskService = taskService,
                databaseManager = databaseManager,
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

    fun runSearch(text: String) {
        val query = text.trim()
        if (query.isEmpty()) return
        onSearchStart()
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
                    if (queryText.isNotEmpty()) {
                        IconButton(onClick = {
                            queryText = ""; hits = emptyList()
                            keywordHits = emptyList(); hasSearched = false
                        }) { Icon(Icons.Default.Clear, "Clear") }
                    }
                },
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(onSearch = { runSearch(queryText) }),
                modifier = Modifier.fillMaxWidth(),
                maxLines = 3
            )
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
            hits.forEachIndexed { index, hit -> SemanticResultCard(hit, index + 1) }
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
private fun SemanticResultCard(hit: SemanticHit, rank: Int) {
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
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
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
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Place, null, tint = Accent,
                            modifier = Modifier.size(13.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(
                            buildString {
                                append("Aisle ${loc.aisle}")
                                loc.shelf?.let { append(" shelf $it") }
                                if (loc.bin > 0) append(" bin ${loc.bin}")
                                loc.section?.let { append(" · $it") }
                            },
                            fontSize = 12.sp, fontWeight = FontWeight.Medium
                        )
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
                }
            }
        }
    }
}

// MARK: - Step 2 (UI only on Android)

@Composable
private fun PlanogramSection() {
    Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text("Visual planogram audit", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Text("The associate photographs a shelf, each expected position is cropped out and " +
                "embedded with CLIP, and the crops are matched against product image vectors " +
                "to name what is actually sitting there — for example “expected Chocolate " +
                "Recovery Shake, found Vanilla Whey Protein Shake”.",
                fontSize = 12.sp, color = Color.Gray)
            Surface(color = Color(0x1F2196F3), shape = RoundedCornerShape(10.dp)) {
                Row(Modifier.padding(12.dp)) {
                    Icon(Icons.Default.Info, null, tint = Color(0xFF1565C0),
                        modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Implemented and working on iOS. On Android this is the UI placeholder " +
                        "only — the image model and crop matching are not wired up yet, so no " +
                        "audit runs from this screen.",
                        fontSize = 12.sp)
                }
            }
            OutlinedButton(onClick = {}, enabled = false, modifier = Modifier.fillMaxWidth()) {
                Icon(Icons.Default.CameraAlt, null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Photograph this shelf")
            }
        }
    }
}

// MARK: - Request Help

/**
 * The resolution half of Request Help — what the *second* associate sees.
 *
 * The whole lifecycle runs against the local database, so it works with no network and
 * reconciles when sync returns. A change listener on the `tasks` collection keeps the list live,
 * so a task raised on another device (including the iOS app) arrives here on its own.
 */
@Composable
private fun TasksSection(
    taskService: TaskService,
    databaseManager: DatabaseManager,
    scope: kotlinx.coroutines.CoroutineScope
) {
    var tasks by remember { mutableStateOf<List<StoreTask>>(emptyList()) }
    var showFinished by remember { mutableStateOf(false) }
    var remoteChange by remember { mutableStateOf(false) }

    fun reload() {
        scope.launch {
            tasks = withContext(Dispatchers.IO) { taskService.loadTasks() }
        }
    }

    // Live updates: a task arriving over replication should appear without a manual refresh.
    DisposableEffect(Unit) {
        reload()
        val collection = runCatching {
            databaseManager.getDatabase()?.getCollection(
                AppConfig.TASKS_COLLECTION_NAME, AppConfig.scopeName
            )
        }.getOrNull()
        val token = collection?.addChangeListener { change ->
            val known = tasks.map { it.id }.toSet()
            if (change.documentIDs.any { it !in known }) remoteChange = true
            reload()
        }
        onDispose { token?.remove() }
    }

    val open = tasks.filter { it.status == "open" }
    val active = tasks.filter { it.status == "accepted" || it.status == "in_progress" }
    val finished = tasks.filter { it.isTerminal }

    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
            Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Store tasks", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Spacer(Modifier.weight(1f))
                    Text("you are ${taskService.deviceLabel}",
                        fontSize = 11.sp, fontFamily = FontFamily.Monospace, color = Color.Gray)
                }
                Text("Every device signed in to this store sees the same tasks — over App " +
                    "Services when online, peer-to-peer when not. Accepting one claims it under " +
                    "this device's label.",
                    fontSize = 12.sp, color = Color.Gray)
                if (remoteChange) {
                    Surface(color = Color(0x1F2196F3), shape = RoundedCornerShape(8.dp)) {
                        Row(Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Sync, null, tint = Color(0xFF1565C0),
                                modifier = Modifier.size(14.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("Updated from another device", fontSize = 11.sp,
                                fontWeight = FontWeight.Medium)
                        }
                    }
                }
            }
        }

        if (tasks.isEmpty()) {
            Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("No tasks yet", fontWeight = FontWeight.SemiBold, fontSize = 15.sp)
                    Text("Tasks are raised from a shelf-audit finding — that flow lives on iOS " +
                        "today. Anything raised there syncs into this list, and can be accepted, " +
                        "recounted and closed from here.",
                        fontSize = 12.sp, color = Color.Gray)
                }
            }
        } else {
            if (open.isNotEmpty()) {
                TaskGroupHeader("NEEDS AN ASSOCIATE", open.size, Accent)
                open.forEach { TaskCard(it, taskService) { reload() } }
            }
            if (active.isNotEmpty()) {
                TaskGroupHeader("BEING WORKED ON", active.size, Color(0xFF2196F3))
                active.forEach { TaskCard(it, taskService) { reload() } }
            }
            if (finished.isNotEmpty()) {
                Surface(onClick = { showFinished = !showFinished }, color = Color.Transparent) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            if (showFinished) Icons.Default.KeyboardArrowDown
                            else Icons.Default.KeyboardArrowRight,
                            null, tint = Color.Gray, modifier = Modifier.size(18.dp)
                        )
                        Text("${finished.size} finished", fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold, color = Color.Gray)
                    }
                }
                if (showFinished) finished.forEach { TaskCard(it, taskService) { reload() } }
            }
        }
    }
}

@Composable
private fun TaskGroupHeader(title: String, count: Int, tint: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
        Spacer(Modifier.width(6.dp))
        Surface(color = tint.copy(alpha = 0.18f), shape = RoundedCornerShape(4.dp)) {
            Text("$count", fontSize = 11.sp, fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 1.dp))
        }
    }
}

@Composable
private fun TaskCard(task: StoreTask, taskService: TaskService, onChanged: () -> Unit) {
    var showCountEditor by remember(task.id) { mutableStateOf(false) }
    var stock by remember(task.id) { mutableStateOf<TaskStockContext?>(null) }
    var draftCount by remember(task.id) { mutableStateOf<Int?>(null) }
    var applied by remember(task.id) { mutableStateOf(false) }
    var showMenu by remember(task.id) { mutableStateOf(false) }

    Card(colors = CardDefaults.cardColors(MaterialTheme.colorScheme.surface)) {
        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(task.title, fontWeight = FontWeight.SemiBold, fontSize = 15.sp)

            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                TaskBadge(task.taskType.replaceFirstChar { it.uppercase() }, Accent)
                if (task.priority != "normal") {
                    TaskBadge(
                        task.priority.replaceFirstChar { it.uppercase() },
                        if (task.priority == "high") Color.Red else Color.Gray
                    )
                }
                TaskBadge(statusLabel(task.status), statusTint(task.status))
            }

            if (task.detail.isNotEmpty()) {
                Text(task.detail, fontSize = 12.sp, color = Color.Gray)
            }

            task.locationText?.let {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Place, null, tint = Accent, modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(4.dp))
                    Text(it, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                }
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("raised by ${task.createdBy}", fontSize = 11.sp, color = Color.Gray)
                task.assignedTo?.let { assignee ->
                    val mine = assignee == taskService.deviceLabel
                    Text("  →  ", fontSize = 11.sp, color = Color.Gray)
                    Text(
                        if (mine) "you" else assignee,
                        fontSize = 11.sp,
                        fontWeight = if (mine) FontWeight.SemiBold else FontWeight.Normal,
                        fontFamily = if (mine) FontFamily.Default else FontFamily.Monospace,
                        color = if (mine) Accent else Color.Gray
                    )
                }
            }

            if (task.quantityDelta != 0) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Inventory2, null, tint = Color(0xFF2E7D32),
                        modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("${if (task.quantityDelta > 0) "+" else ""}${task.quantityDelta} " +
                        "recorded against stock",
                        fontSize = 11.sp, fontWeight = FontWeight.Medium)
                    Spacer(Modifier.width(4.dp))
                    Text("(pn-counter)", fontSize = 11.sp, fontFamily = FontFamily.Monospace,
                        color = Color.Gray)
                }
            }

            if (showCountEditor) {
                Surface(color = Cream, shape = RoundedCornerShape(8.dp)) {
                    Column(Modifier.padding(10.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        val context = stock
                        if (context == null) {
                            Text("This task is not linked to a product in this store's " +
                                "inventory, so there is no count to correct.",
                                fontSize = 12.sp, color = Color.Gray)
                        } else {
                            Text(context.name, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("On shelf now", fontSize = 12.sp, color = Color.Gray)
                                Spacer(Modifier.weight(1f))
                                Text("${context.currentStock}", fontSize = 12.sp,
                                    fontFamily = FontFamily.Monospace)
                            }
                            val current = draftCount ?: context.currentStock
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Corrected count", fontSize = 12.sp)
                                Spacer(Modifier.weight(1f))
                                IconButton(
                                    onClick = { draftCount = (current - 1).coerceAtLeast(0) },
                                    modifier = Modifier.size(32.dp)
                                ) { Icon(Icons.Default.Remove, "Decrease") }
                                Text("$current", fontSize = 14.sp, fontWeight = FontWeight.SemiBold,
                                    fontFamily = FontFamily.Monospace)
                                IconButton(
                                    onClick = { draftCount = current + 1 },
                                    modifier = Modifier.size(32.dp)
                                ) { Icon(Icons.Default.Add, "Increase") }
                            }
                            Button(
                                onClick = {
                                    if (taskService.applyStockCount(task, current)) {
                                        applied = true
                                        showCountEditor = false
                                        draftCount = null
                                        onChanged()
                                    }
                                },
                                enabled = current != context.currentStock,
                                colors = ButtonDefaults.buttonColors(containerColor = Accent),
                                modifier = Modifier.fillMaxWidth()
                            ) { Text("Save count", fontSize = 13.sp) }
                        }
                    }
                }
            }

            Row(verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                task.nextStatusLabel?.let { label ->
                    Button(
                        onClick = { taskService.advance(task); onChanged() },
                        colors = ButtonDefaults.buttonColors(containerColor = Accent),
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                    ) { Text(label, fontSize = 13.sp, fontWeight = FontWeight.SemiBold) }
                }

                if (!task.isTerminal && task.relatedProductId != null) {
                    OutlinedButton(
                        onClick = {
                            if (stock == null) stock = taskService.stockContext(task)
                            showCountEditor = !showCountEditor
                        },
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(if (applied) "Count saved" else "Update count", fontSize = 13.sp)
                    }
                }

                Spacer(Modifier.weight(1f))

                if (!task.isTerminal) {
                    Box {
                        IconButton(onClick = { showMenu = true }) {
                            Icon(Icons.Default.MoreVert, "More", tint = Color.Gray)
                        }
                        DropdownMenu(showMenu, onDismissRequest = { showMenu = false }) {
                            if (task.assignedTo != null) {
                                DropdownMenuItem(
                                    text = { Text("Put back in the pool") },
                                    onClick = {
                                        showMenu = false
                                        taskService.release(task); onChanged()
                                    }
                                )
                            }
                            DropdownMenuItem(
                                text = { Text("Cancel task") },
                                onClick = {
                                    showMenu = false
                                    taskService.cancel(task); onChanged()
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TaskBadge(text: String, tint: Color) {
    Surface(color = tint.copy(alpha = 0.16f), shape = RoundedCornerShape(4.dp)) {
        Text(text, fontSize = 11.sp, fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
    }
}

private fun statusLabel(status: String) =
    if (status == "in_progress") "In progress" else status.replaceFirstChar { it.uppercase() }

private fun statusTint(status: String) = when (status) {
    "open" -> Color(0xFFEF6C00)
    "accepted" -> Color(0xFF2196F3)
    "in_progress" -> Color(0xFF7B1FA2)
    "done" -> Color(0xFF2E7D32)
    else -> Color.Gray
}

// MARK: - Step 3

@Composable
private fun AskSection(
    searchService: CopilotSearchService,
    scope: kotlinx.coroutines.CoroutineScope
) {
    var question by remember { mutableStateOf("") }
    var chunks by remember { mutableStateOf<List<KnowledgeHit>>(emptyList()) }
    var isWorking by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var retrieveMillis by remember { mutableStateOf(0.0) }

    val prompts = listOf(
        "I'm training for my first 5k — what should I drink after a run?",
        "How much protein do I need for endurance recovery?",
        "What are my dairy-free protein options?"
    )

    fun ask(text: String) {
        val trimmed = text.trim()
        if (trimmed.isEmpty()) return
        isWorking = true
        errorMessage = null
        chunks = emptyList()
        scope.launch {
            try {
                val started = System.nanoTime()
                val retrieved = withContext(Dispatchers.Default) {
                    searchService.retrieveKnowledge(trimmed)
                }
                retrieveMillis = (System.nanoTime() - started) / 1_000_000.0
                chunks = retrieved
                if (retrieved.isEmpty()) {
                    errorMessage = "Nothing in this store's knowledge collection covers that."
                }
            } catch (e: Exception) {
                errorMessage = "Retrieval failed: ${e.message}"
            } finally {
                isWorking = false
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
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                keyboardActions = KeyboardActions(onSend = { ask(question) }),
                modifier = Modifier.fillMaxWidth(), maxLines = 3
            )
            Button(
                onClick = { ask(question) },
                enabled = question.isNotBlank() && !isWorking,
                colors = ButtonDefaults.buttonColors(containerColor = Accent),
                modifier = Modifier.fillMaxWidth()
            ) { Text("Ask", fontWeight = FontWeight.SemiBold) }
        }
    }

    // Retrieval is real vector search; generation is not wired up on Android yet. Saying so
    // is better than implying an answer was withheld.
    Surface(color = Color(0x1F2196F3), shape = RoundedCornerShape(10.dp)) {
        Row(Modifier.padding(12.dp)) {
            Icon(Icons.Default.Info, null, tint = Color(0xFF1565C0),
                modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text("Retrieval runs on-device by vector search over the store's " +
                "`product_knowledge` collection. Answer generation is not wired up on Android " +
                "yet, so the retrieved sources are shown as-is — the retrieval half of RAG.",
                fontSize = 12.sp)
        }
    }

    if (isWorking) {
        Row(Modifier.fillMaxWidth().padding(vertical = 18.dp),
            horizontalArrangement = Arrangement.Center) {
            CircularProgressIndicator(color = Accent, modifier = Modifier.size(20.dp))
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
