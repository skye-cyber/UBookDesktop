import { useCallback, useEffect, useRef } from 'react';
import { selectionhelper } from '../Tooltips/Helpers/selection';
import { hightlightsearch } from './Search/hightlightSearch';
import { StateManager } from '../../../common/syscore/StatesManager';

export const ReaderContent = ({ }) => {
    const readerSection = useRef(null)
    const handle_selectionchange = () => {
        setTimeout(() => {
            const is_valid_selection = selectionhelper.updateAppstate()

            if (!is_valid_selection) return

            document.dispatchEvent(new CustomEvent('show-onselect-tooltip-menu'))
        }, 500)
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
        if (window.innerWidth > 400) {
            readerSection.current.addEventListener('contextmenu', contextmenu)
        }
        document.addEventListener('escape-key-down', () => hightlightsearch.removeHighlightedSpans())
        document.addEventListener('selectionchange', handle_selectionchange)

        //readerSection.current.addEventListener('mouseup', () => hightlightsearch.searchPage())

        // Let zoom increase font on small devices
        document.addEventListener('clear-reader-section', clearSection)
        // readerSection.current.addEventListener('k', (e) => {
        //     e.preventDefault()
        //     alert("Zoom", e)
        // })
        return () => {
            if (window.innerWidth > 400) {
                readerSection.current?.removeEventListener('contextmenu', contextmenu)
            }
            document.removeEventListener('clear-reader-section', clearSection)
            document.removeEventListener('selectionchange', handle_selectionchange)
            document.addEventListener('escape-key-down', () => hightlightsearch.removeHighlightedSpans())
            readerSection.current.removeEventListener('click')
        }
    })


    return (
        <article
            ref={readerSection}
            data-portal-container='reader-content'
            id="reader-content"
            className="react-portal-root select-text bg-white dark:bg-gray-950 dark:border-gray-700 rounded-lg px-2 sm:px-3 mb-24 md:mb-18 xl:mb-16 selection:bg-[#ff007f]/20 leading-loose">
        </article>
    )
}
