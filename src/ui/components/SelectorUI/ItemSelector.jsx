import React, { useCallback, useEffect, useRef } from 'react';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';

export const BookItemSelectorUI = ({ }) => {
    const itemSelector = useRef(null)
    const itemSelectorBox = useRef(null)
    const paperContainer = useRef(null)
    const selectorTitle = useRef(null)

    const displaySelectorModal = useCallback(() => {
        itemSelector.current.classList.remove('hidden', 'animate-exit')
        itemSelector.current.classList.add('animate-enter')
        setTimeout(() => {
            itemSelectorBox.current.classList.remove('hidden', 'animate-exit')
            itemSelectorBox.current.classList.add('animate-enter')
        }, 300)
    })

    const hideSelectorModal = useCallback(() => {
        itemSelectorBox.current.classList.remove('animate-enter')
        itemSelectorBox.current.classList.add('animate-exit')
        setTimeout(() => {
            // Set timeout for animation exit
            itemSelectorBox.current.classList.add('hidden')
            itemSelector.current.classList.remove('animate-enter')
            itemSelector.current.classList.add('animate-exit')
        }, 300)

        // hide after animation exit
        setTimeout(() => {
            itemSelector.current.classList.add('hidden')
        }, 500)

    })

    useEffect(() => {
        StateManager.set('paperContainer', paperContainer.current)
        StateManager.set('selectorTitle', selectorTitle.current)

        document.addEventListener('show-item-selector', displaySelectorModal)
        document.addEventListener('hide-item-selector', hideSelectorModal)
        document.addEventListener('escape-key-down', (e) => {
            if (itemSelector.current.classList.contains('hidden')) return
            e.preventDefault()
            hideSelectorModal()
        })

        return () => {
            document.removeEventListener('show-item-selector', displaySelectorModal)
            document.removeEventListener('hide-item-selector', hideSelectorModal)
            document.addEventListener('escape-key-down', hideSelectorModal)
        }
    })

    return (
        <div ref={itemSelector} id="itemsSelector" className="fixed flex inset-0 z-[50] items-center justify-center backdrop-brightness-50 animate-exit hidden transform transition-all duration-500">
            <div ref={itemSelectorBox} id="itemsSelectorBox" className="relative w-full max-w-xl mt-[7vh] max-h-[90vh] overflow-y-hidden rounded-2xl bg-white dark:bg-zinc-950 shadow-none transform transition-all duration-500 ease-in-out animate-exit hidden z-[60] select-none">
                <div className="relative sticky top-0 w-full p-2 flex items-center justify-center border-b border-gray-200 dark:border-zinc-700 bg-[#004b6b] dark:bg-zinc-900 shadow-inner shadow-lg transition-colors duration-700">
                    <h2 ref={selectorTitle} id="selector-part-title" className="text-2xl font-bold text-gray-200 dark:text-gray-100 overflow-x-hidden mr-12">Select Items</h2>
                    <button onClick={hideSelectorModal} className="absolute top-2 right-2 text-gray-200 dark:text-gray-300 hover:text-red-400 dark:hover:text-red-500 transition-colors text-2xl leading-none colors duration-700" aria-label="Close modal" title="Close modal">&times;</button>
                </div>
                <ul
                    ref={paperContainer}
                    data-portal-container='paper-container'
                    id="paper-container"
                    className="divide-y divide-gray-300 dark:divide-zinc-800 px-6 py-1 transition-all duration-700 overflow-y-auto max-h-[90vh] pb-[10vh] scrollbar-custom">
                    <h2>Emtpy</h2>
                </ul>
            </div>
        </div>
    )
}
