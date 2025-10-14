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
    searchInitializer(e)
});

// Search input Enter key handler
searchInput?.addEventListener("keydown", (e) => {
    searchInitializer(e)
});

function searchInitializer(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        const query = searchInput.value.trim();
        if (!query) return;
        console.log("Searching for:", query);
        PerformSearch(query);
        searchInput.value = ""; // Clear after search
    }
}
/**
 * Initialize search with the selected parts and mode
 * @param {string} query
 */
async function PerformSearch(query) {
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

    //Show loading modal
    _modalHandler.show("load", "Searching...");

    // Decide between full-text search or selective search
    const result = (searchMode.value === "text"
        ? await handleFullTextSearch(targets, query)
        : await Do_S_Search(targets, query))

    // Hide loading modal when search completes
    _modalHandler.hide("load");

    return result
}

/**
 * Perform selective search using external SelectiveSearch class
 * @param {Array<string|number>} ids
 * @param {string} query
 */
async function Do_S_Search(ids, query) {
    const exec = new SelectiveSearch();
    const result = await exec.run(ids, query);
    return result;
}

/**
 * Perform Lunr-based full-text search
 * @param {Array<string|number>} ids
 * @param {string} query
 */
async function handleFullTextSearch(ids, query) {
    try {
        let results = await window.lunrsearch(ids, query);

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
    //console.log('__call__')
    searchQuery.textContent = `${query}`;
    resultTotal.textContent = results.length;

    const keywords = query.split(/\s+/).filter(Boolean);
    let count = 0;

    results.forEach(result => {
        count++;

        // Highlight keywords
        let highlightedContent = result.content.replace(/[\'\"]/g, "")

        const Qpattern = new RegExp(`(${escapeRegExp(query)})`, "gi");

        if (highlightedContent.toLowerCase().includes(query.toLowerCase())) {
            highlightedContent = highlightedContent.replace(Qpattern, `<span class='font-mono p-0.5 bg-yellow-500 rounded-sm dark:bg-slate-950 text-black dark:text-yellow-400'>$1</span>`);
        } else {
            let proceedQueue = []
            keywords.forEach(word => {
                if (!proceedQueue.includes(proceedQueue)) {
                    const pattern = new RegExp(`(${escapeRegExp(word)})`, "gi");
                    //console.log(keywords)
                    //const hlspan = document.createElement('span')
                    //hlspan.className = "font-mono p-0.5 bg-yellow-500 rounded-sm dark:bg-slate-950 text-black dark:text-yellow-400"
                    //let hlhtml =
                    highlightedContent = highlightedContent.replace(pattern, `<span class='font-mono p-0.5 bg-yellow-500 rounded-sm dark:bg-slate-950 text-black dark:text-yellow-400 space-x-1'>$1</span>`);
                    proceedQueue.push(word)
                }
            });
        }

        const link_data = JSON.stringify({
            part_id: result.part_id,
            paper_id: result.paper_id,
            section_number: result.section_number,
            paragraph_number: result.paragraph_number,
        })

        const resDiv = document.createElement("div");
        resDiv.innerHTML = `
        <div class="relative mt-1 mb-1">
        <button class="flex absolute -left-5 -top-6 px-2 py-0.5 w-fit h-fit rounded-full items-center justify-center bg-green-500 dark:bg-green-600 text-white">${count}</button>
        </div>
        <dl class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-2 gap-y-3">
        <dt class="font-semibold">Part:</dt><dd class="font-normal">${result.part_id}: ${result.part_title}</dd>
        <dt class="font-semibold">Paper:</dt><dd>${result.paper_id}: ${result.paper_title}</dd>
        <dt class="font-semibold">Section:</dt><dd>${result.section_number}: ${result.section_title}</dd>
        <dt class="font-semibold">Paragraph Number:</dt><dd>${result.paragraph_number}</dd>
        <dt class="font-semibold">Score:</dt><dd>${result.score.toFixed(3)}</dd>
        <dt class="font-semibold"><button class="text-slate-200 dark:text-white hover:scale-[1.05] hover:translate-y-[6px] transform transition-transform transition-translate duration-300 rounded-lg shadow-lg shadow-[#341055] bg-[#3f3fbf] dark:bg-[#1e1e5d] p-2" onclick='openSearchContent(${link_data})'>Open</button></dt>
        </dl>
        <hr class="my-4 border-gray-300 dark:border-gray-600" />
        <p id='search-${result.part_id}-${result.paper_id}-${result.section_number}' class='whitespace-pre-line leading-relaxed'>${highlightedContent}</p>
        <p class="mb-2 p-0.5 bg-[#0071a6]"></p>
        `;

        contentDiv.appendChild(resDiv);
        //contentDiv.getElementById(`search-${result.part_id}-${result.paper_id}-${result.section_number}`).textContent = highlightedContent;
    });

    showSearchModal();
    setTimeout(() => scrollToTop(contentDiv), 100);

    // Trigger garbageCollect
    window.results = null
    results = null;
}

/**
 * Escape special characters for regex use
 * @param {string} str
 * @returns {string}
 */
function escapeRegExp(str) {
    return str.replace(/[.\*+?^${}()|[\]\\]/g, "\\$&");
}


const part_id_map = {
    0: 'foreword',
    1: 'central-and-superuniverse',
    2: 'local-universe',
    3: 'history-of-urantia',
    4: 'life-and-teachings-of-jesus'
}

function openSearchContent(data) {
    console.log(`Find: ${data.part_id}-${data.paper_id}-${data.section_number}`)
    //STEP1: Prepare part content
    document.getElementById(part_id_map[data.part_id])?.click()


    //STEP2: Close search modal
    document.getElementById('closeModalBtn2').click()

    _modalHandler.show("load", "Loading section...");

    // Give dom time to Update
    setTimeout(() => {
        //STEP3: find and click right section
        sec = document.querySelector(`[data-tag="${data.part_id}-${data.paper_id}-${data.section_number}"]`)
        sec?.click()
        _modalHandler.hide("load");

    }, 3500)

}
