const modalSearch = document.getElementById('search-modal');
const backdrop = document.getElementById('modalBackdrop');
const openBtn = document.getElementById('openModalBtn');
const submitSearch = document.getElementById("submit-search");
const searchQuery = document.getElementById('search-query');
const resultTotal = document.getElementById('result-total');

const closeBtns = [
    document.getElementById('closeModalBtn'),
    document.getElementById('closeModalBtn2')
].filter(Boolean); // filter out nulls

const contentDiv = document.getElementById('SearchModalContent');
const searchInput = document.getElementById('searchInput');

// Search input key handler
submitSearch?.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;
    console.log("Searching for:", query);
    handleSearch(query);
    searchInput.value = ""; // Clear input after search
});

// Search input key handler
searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        const query = searchInput.value.trim();
        if (!query) return;
        console.log("Searching for:", query);
        handleSearch(query);
        searchInput.value = ""; // Clear input after search
    }
});

async function handleSearch(query) {
    try {
        _modalHandler.show("load", "Searching...");
        const results = await window.lunrsearch(query);
        _modalHandler.hide("load");
        showResults(results, query);
    } catch (error) {
        _modalHandler.hide("load");
        console.error("Search failed:", error);
    }
}

function showResults(results, query) {
    contentDiv.innerHTML = ""; // Clear previous results

    searchQuery.textContent = `#${query || ""}`
    resultTotal.textContent = query.length;

    let count = 0

    results.forEach(result => {
        count += 1
        const resDiv = document.createElement("div");
        resDiv.innerHTML = `
        <div class="relative mt-1 mb-1">
          <button class="flex absolute -left-5 -top-6 px-2 py-0.5 w-fit h-fit rounded-full items-center justify-center bg-green-500 dark:bg-green-600 text-black dark:text-white">${count}</button>
        </div>
        <dl class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-2 gap-y-3">
        <dt class="font-semibold">Part Title:<dd class="font-normal">${result.partTitle}</dd></dt>
        <dt class="font-semibold">Paper Title:<dd>${result.paperTitle}</dd></dt>
        <dt class="font-semibold">Section Number:<dd>${result.sectionNumber}</dd></dt>
        <dt class="font-semibold">Section Title:<dd>${result.sectionTitle}</dd></dt>
        <dt class="font-semibold">Paragraph Number:<dd>${result.paragraphNumber}</dd></dt>
        <dt class="font-semibold">Score:</dt><dd>${result.score.toFixed(3)}</dd></dt>
        </dl>
        <hr class="my-4 border-gray-300 dark:border-gray-600" />
        <p class="whitespace-pre-line leading-relaxed ">${result.content}</p>
        <p class="mb-2 p-0.5 bg-[#0071a6]"></p>
        `;
        contentDiv.appendChild(resDiv);
    });

    showSearchModal();
    setTimeout(() => scrollToTop(contentDiv), 100);
}

function showSearchModal() {
    modalSearch?.classList.remove("translate-y-[100vh]");
    modalSearch?.classList.add("translate-y-0");
}

function closeSearchModal() {
    modalSearch?.classList.add('translate-y-[100vh]');
    //document.body.style.overflow = '';
}


// Close buttons
closeBtns.forEach(btn => btn?.addEventListener('click', closeSearchModal));

// Backdrop click to close
backdrop?.addEventListener('click', closeSearchModal);

// ESC key to close
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalSearch?.classList.contains('translate-y-[100vh]')) {
        closeSearchModal();
    }
});
