import React, { useCallback, useEffect, useRef } from 'react';

export const ItemsUI = ({ }) => {
    const itemSelector = useRef(null)
    const itemSelectorBox = useRef(null)

    const displaySelectorModal = useCallback(() => {
        itemSelector.classList.remove('hidden', 'animate-exit')
        itemSelector.classList.add('animate-enter')
        setTimeout(() => {
            itemSelectorBox.classList.remove('hidden', 'animate-exit')
            itemSelectorBox.classList.add('animate-enter')
        }, 300)
    })

    const hideSelectorModal = useCallback(() => {
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

    })

    useEffect(() => {
        document.addEventListener('show-selector', displaySelectorModal)
        document.addEventListener('hide-selector', hideSelectorModal)

        return () => {
            document.removeEventListener('show-selector', displaySelectorModal)
            document.removeEventListener('hide-selector', hideSelectorModal)
        }
    })

    return (
        <div ref={itemSelector} id="itemsSelector" className="fixed flex inset-0 z-[30] items-center justify-center bg-black/50 dark:bg-white/50 backdrop-blur-sm animate-exit hidden transform transition-all duration-500">
            <div ref={itemSelectorBox} id="itemsSelectorBox" className="relative w-full max-w-xl mt-[7vh] max-h-[90vh] overflow-y-hidden rounded-2xl bg-white dark:bg-zinc-950 shadow-2xl transform transition-all duration-500 ease-in-out animate-exit hidden z-[60]">
                <div className="relative sticky top-0 w-full p-2 flex items-center justify-center border-b border-gray-200 dark:border-zinc-700 bg-[#004b6b] dark:bg-zinc-900 shadow-inner shadow-lg transition-colors duration-700">
                    <h2 id="Part-title" className="text-2xl font-bold text-gray-200 dark:text-gray-100 overflow-x-hidden mr-12">Select Items</h2>
                    <button onClick={hideSelectorModal} className="absolute top-2 right-2 text-gray-200 dark:text-gray-300 hover:text-red-400 dark:hover:text-red-500 transition-colors text-2xl leading-none colors duration-700" aria-label="Close modal" title="Close modal">&times;</button>
                </div>
                <ul id="paper-container" className="divide-y divide-gray-300 dark:divide-zinc-800 px-6 py-1 transition-all duration-700 overflow-y-auto max-h-[90vh] pb-[10vh]">
                </ul>
            </div>
        </div>
    )
}
