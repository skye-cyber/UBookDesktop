import React, { useCallback, useEffect, useRef } from 'react';
import { selectionhelper } from '../Tooltips/Helpers/selection';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';
import { hightlightsearch } from './Search/hightlightSearch';

export const ReaderContent = ({ }) => {
    const readerSection = useRef(null)
    const handle_selectionchange = () => {
        const is_valid_selection = selectionhelper.updateAppstate()

        if (!is_valid_selection) return

        document.dispatchEvent(new CustomEvent('show-onselect-tooltip-menu'))
    }

    const clearSection = () => {
        readerSection.current.innerHTML = ""
    }

    const contextmenu = useCallback((e) => {
        e.preventDefault();
        readerSection.current.dispatchEvent(new CustomEvent('show-contextmenu-tooltip-menu', {
            detail: {
                width: e.width,
                height: e.height,
                target: e.target,
                screenX: e.screenX,
                screenY: e.screenY,
                pageX: e.pageX,
                pageY: e.pageY,
                x: e.x,
                y: e.y,
                offsetX: e.offsetX,
                offsetY: e.offsetY
            }
        }))
    })
    useEffect(() => {

        StateManager.set('readerSection', readerSection.current)

        // Show context menu on right click
        readerSection.current.addEventListener('contextmenu', contextmenu)
        document.addEventListener('escape-key-down', () => hightlightsearch.removeHighlightedSpans())
        document.addEventListener('selectionchange', handle_selectionchange)

        //readerSection.current.addEventListener('mouseup', () => hightlightsearch.searchPage())

        document.addEventListener('clear-reader-section', clearSection)
        return () => {
            readerSection.current.removeEventListener('contextmenu', contextmenu)
            document.removeEventListener('clear-reader-section', clearSection)
            document.removeEventListener('selectionchange', handle_selectionchange)
            document.addEventListener('escape-key-down', () => hightlightsearch.removeHighlightedSpans())
        }
    })

    return (
        <article
            ref={readerSection}
            data-portal-container='reader-content'
            id="reader-content"
            className="react-portal-root select-text bg-gradient-to-b from-[#f8f4e9] to-[#f2ebd8]  dark:from-gray-950 dark:to-gray-950 focus:outline-none mb-4 font-reader overflow-y-hidden mt-1 p-6 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-300 rounded-lg selection:bg-[#ff007f]/20">
        </article>
    )
}
