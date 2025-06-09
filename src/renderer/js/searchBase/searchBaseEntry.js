// Get DOM elements
const submitSearch = document.getElementById("submit-search");
const searchQuery = document.getElementById("search-query");
const resultTotal = document.getElementById("result-total");
const contentDiv = document.getElementById("SearchModalContent");
const searchInput = document.getElementById("searchInput");
const searchMode = document.getElementById("search-mode");

/**
 * Programmatically trigger a search submission and close preferences modal
 */
function submitSearchWPrefs() {
    submitSearch.click();
    closeSearchPref();
}

// Search button click handler
submitSearch?.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;
    console.log("Searching for:", query);
    initSearch(query);
    searchInput.value = ""; // Clear after search
});

// Search input Enter key handler
searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        const query = searchInput.value.trim();
        if (!query) return;
        console.log("Searching for:", query);
        initSearch(query);
        searchInput.value = ""; // Clear after search
    }
});

/**
 * Initialize search with the selected parts and mode
 * @param {string} query
 */
async function initSearch(query) {
    let targets = [];

    // Collect target document parts
    if (document.getElementById("toggle-all").checked) {
        targets = ["_all_"];
    } else {
        for (let p = 1; p <= 5; p++) {
            const checkbox = document.getElementById(`part${p}`);
            if (checkbox?.checked) {
                targets.push(p);
            }
        }
    }

    if (!targets.length) return;

    // Decide between full-text search or selective search
    return searchMode.value === "text"
    ? await handleSearch(targets, query)
    : await Do_S_Search(targets, query);
}

/**
 * Perform selective search using external SelectiveSearch class
 * @param {Array<string|number>} ids
 * @param {string} query
 */
async function Do_S_Search(ids, query) {
    _modalHandler.show("load", "Searching...");
    const exec = new SelectiveSearch();
    const result = await exec.run(ids, query);
    _modalHandler.hide("load");
    return result;
}

/**
 * Perform Lunr-based full-text search
 * @param {Array<string|number>} ids
 * @param {string} query
 */
async function handleSearch(ids, query) {
    try {
        _modalHandler.show("load", "Searching...");
        let results = await window.lunrsearch(ids, query);
        _modalHandler.hide("load");

        showResults(results, query);

        // Clean up
        results = null;
    } catch (error) {
        _modalHandler.hide("load");
        console.error("Search failed:", error);
    }
}

/**
 * Display search results in modal
 * @param {Array<Object>} results
 * @param {string} query
 */
function showResults(results, query) {
    contentDiv.innerHTML = ""; // Clear previous
    console.log('__call__')
    searchQuery.textContent = `#${query}`;
    resultTotal.textContent = results.length;

    const keywords = query.split(/\s+/).filter(Boolean);
    let count = 0;

    results.forEach(result => {
        count++;

        // Highlight keywords
        let highlightedContent = result.content;
        keywords.forEach(word => {
            const pattern = new RegExp(`(${escapeRegExp(word)})`, "gi");
            highlightedContent = highlightedContent.replace(pattern, `<span class="font-mono text-yellow-400">$1</span>`);
        });

        const resDiv = document.createElement("div");
        resDiv.innerHTML = `
        <div class="relative mt-1 mb-1">
        <button class="flex absolute -left-5 -top-6 px-2 py-0.5 w-fit h-fit rounded-full items-center justify-center bg-green-500 dark:bg-green-600 text-black dark:text-white">${count}</button>
        </div>
        <dl class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-2 gap-y-3">
        <dt class="font-semibold">Part Title:</dt><dd class="font-normal">${result.partTitle}</dd>
        <dt class="font-semibold">Paper Title:</dt><dd>${result.paperTitle}</dd>
        <dt class="font-semibold">Section Number:</dt><dd>${result.sectionNumber}</dd>
        <dt class="font-semibold">Section Title:</dt><dd>${result.sectionTitle}</dd>
        <dt class="font-semibold">Paragraph Number:</dt><dd>${result.paragraphNumber}</dd>
        <dt class="font-semibold">Score:</dt><dd>${result.score.toFixed(3)}</dd>
        </dl>
        <hr class="my-4 border-gray-300 dark:border-gray-600" />
        <p class="whitespace-pre-line leading-relaxed">${highlightedContent}</p>
        <p class="mb-2 p-0.5 bg-[#0071a6]"></p>
        `;

        contentDiv.appendChild(resDiv);
    });

    showSearchModal();
    setTimeout(() => scrollToTop(contentDiv), 100);
}

/**
 * Escape special characters for regex use
 * @param {string} str
 * @returns {string}
 */
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
