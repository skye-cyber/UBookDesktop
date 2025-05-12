const itemSelector = document.getElementById('itemsSelectorModal');
const itemSelectorBox = document.getElementById('itemsSelectorModalBox');
const noteModal = document.getElementById('note-modal');
const noteBox = document.getElementById('note-box');

function displaySelectorModal() {
    itemSelector.classList.remove('hidden', 'animate-exit')
    itemSelector.classList.add('animate-enter')
    setTimeout(() => {
        itemSelectorBox.classList.remove('hidden', 'animate-exit')
        itemSelectorBox.classList.add('animate-enter')
    }, 300)
}

function hideSelectorModal() {
    itemSelectorBox.classList.remove('animate-enter')
    itemSelectorBox.classList.add('animate-exit')
    setTimeout(() => {
        // Set timeout for animation exit
        itemSelectorBox.classList.add('hidden')
        itemSelector.classList.remove('animate-enter')
        itemSelector.classList.add('animate-exit')
    }, 300)

    // hide after animation exit
    setTimeout(() => {
        itemSelector.classList.add('hidden')

    }, 500)

}

function showNoteModal() {
    noteModal.classList.remove("-translate-x-full");
    noteModal.classList.add('-translae-x-0');
    noteBox.classList.remove('-translate-x-full');
    noteBox.classList.add('-translate-x-0');

    setTimeout(()=>{
        //noteModal.classList.add('hidden');
    }, 200)
    //document.getElementById('note-comment').value = selectedText;
}


function closeNoteModal() {
    noteModal.classList.add("-translate-x-full");
    noteBox.classList.add('-translate-x-full');
    noteModal.classList.remove('-translate-x-0')

    setTimeout(()=>{
        noteBox.classList.remove('-translate-x-0')
    }, 700)
    document.getElementById('note-comment').value = '';
}


const notesModal = document.getElementById('notesModal');
const modalContentBox = document.getElementById('modalContentBox');
const NotesmodalContent = document.getElementById('modalContent');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModal = document.getElementById('closeModal');

function showNotesModal(noteContent = '') {
    noteContent ? NotesmodalContent.querySelector('p').innerHTML = noteContent : '';

    notesModal.classList.remove('pointer-events-none');

    requestAnimationFrame(() => {
        modalBackdrop.classList.remove('opacity-0', 'scale-95');
        modalBackdrop.classList.add('opacity-100', 'scale-100');

        modalContentBox.classList.remove('opacity-0', 'scale-90', 'translate-y-8');
        modalContentBox.classList.add('opacity-100', 'scale-100', 'translate-y-0');
    });
}

function hideNotesModal() {
    modalBackdrop.classList.add('opacity-0', 'scale-95');
    modalBackdrop.classList.remove('opacity-100', 'scale-100');

    modalContentBox.classList.add('opacity-0', 'scale-90', 'translate-y-8');
    modalContentBox.classList.remove('opacity-100', 'scale-100', 'translate-y-0');

    // Wait for animation to finish before disabling interaction
    setTimeout(() => {
        notesModal.classList.add('pointer-events-none');
    }, 400);
}

closeModal.addEventListener('click', hideNotesModal);
modalBackdrop.addEventListener('click', hideNotesModal);
