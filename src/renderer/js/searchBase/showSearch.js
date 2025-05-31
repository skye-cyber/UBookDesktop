const exampleResult = {
    id: "4-12-32-4:1",
    score: 1.23,
    partTitle: "The Life and Teachings of Jesus",
    paperTitle: "Paper 12: The Teachings",
    section_number: "32",
    sectionTitle: "The Sermon on the Mount",
    paragraphNumber: "4:1",
    content: `Blessed are the poor in spirit, for theirs is the kingdom of heaven.
    Here we see the beginning of Jesus' key teachings, emphasizing humility and spiritual awareness.`
};

const modalSearch = document.getElementById('search-modal');
const backdrop = document.getElementById('modalBackdrop');
const openBtn = document.getElementById('openModalBtn');
const closeBtns = [
    document.getElementById('closeModalBtn'),
    document.getElementById('closeModalBtn2')
].filter(Boolean); // filter out nulls
const contentDiv = document.getElementById('SearchModalContent');
const searchInput = document.getElementById('searchInput');

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
        showResults(results);
    } catch (error) {
        _modalHandler.hide("load");
        console.error("Search failed:", error);
    }
}

function showResults(results) {
    contentDiv.innerHTML = ""; // Clear previous results

    results.forEach(result => {
        const resDiv = document.createElement("div");
        resDiv.innerHTML = `
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        <dt class="font-semibold">Part Title:</dt><dd>${result.partTitle}</dd>
        <dt class="font-semibold">Paper Title:</dt><dd>${result.paperTitle}</dd>
        <dt class="font-semibold">Section Number:</dt><dd>${result.section_number}</dd>
        <dt class="font-semibold">Section Title:</dt><dd>${result.sectionTitle}</dd>
        <dt class="font-semibold">Paragraph Number:</dt><dd>${result.paragraphNumber}</dd>
        <dt class="font-semibold">Score:</dt><dd>${result.score.toFixed(3)}</dd>
        </dl>
        <hr class="my-4 border-gray-300 dark:border-gray-600" />
        <p class="whitespace-pre-line leading-relaxed">${result.content}</p>
        `;
        contentDiv.appendChild(resDiv);
    });

    showSearchModal();
}

function showSearchModal() {
    modalSearch?.classList.remove("translate-y-[100vw]");
    modalSearch?.classList.add("translate-y-0");
}

function closeSearchModal() {
    modalSearch?.classList.add('translate-y-[100vw]');
    document.body.style.overflow = '';
}

// Close buttons
closeBtns.forEach(btn => btn?.addEventListener('click', closeSearchModal));

// Backdrop click to close
backdrop?.addEventListener('click', closeSearchModal);

// ESC key to close
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalSearch?.classList.contains('translate-y-[100vw]')) {
        closeSearchModal();
    }
});
