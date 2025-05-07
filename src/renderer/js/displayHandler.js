const itemSelector = document.getElementById('itemsSelectorModal');
const itemSelectorBox = document.getElementById('itemsSelectorModalBox');

function displaySelectorModal() {
    itemSelector.classList.remove('hidden', 'animate-exit')
    itemSelector.classList.add('animate-enter')
    setTimeout(() => {
        itemSelectorBox.classList.remove('hidden', 'animate-exit')
        itemSelectorBox.classList.add('animate-enter')
    }, 400)
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

    }, 700)

}
