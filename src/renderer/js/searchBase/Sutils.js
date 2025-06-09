const toggleAll = document.getElementById('toggle-all');
const partToggles = document.querySelectorAll('.part-toggle');
const modalSearch = document.getElementById('search-modal');
const backdrop = document.getElementById('modalBackdrop');
const openBtn = document.getElementById('openModalBtn');
const searchPref = document.getElementById('search-pref');
const closeBtns = [
    document.getElementById('closeModalBtn'),
    document.getElementById('closeModalBtn2')
].filter(Boolean); // filter out nulls

document.getElementById('toggle-all').checked = true
toggleAll.addEventListener('change', (e) => {
    partToggles.forEach(cb => {
        cb.checked = e.target.checked;
        cb.disabled = e.target.checked; // lock them if all is on
    });
});


function showSearchModal() {
    modalSearch?.classList.remove("translate-y-[100vh]");
    modalSearch?.classList.add("translate-y-0");
}

function closeSearchModal() {
    modalSearch?.classList.add('translate-y-[100vh]');
    //document.body.style.overflow = '';
}


function openSearchPref() {
    searchPref.classList.remove("-translate-y-[110vh]");
    document.getElementById("modal-backdrop").classList.remove("hidden");
}

function closeSearchPref() {
    searchPref.classList.add("-translate-y-[110vh]");
    document.getElementById("modal-backdrop").classList.add("hidden");
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


function ShowPrevSearchModal(){
    PartTitle.textContent.startsWith('Search Result:') ? displaySelectorModal() : showSearchModal()
}
