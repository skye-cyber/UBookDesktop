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
