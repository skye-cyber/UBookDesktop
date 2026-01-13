import React, { useEffect, useRef } from 'react';
import { selectionhelper } from '../Tooltips/Helpers/selection';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';

export const ReaderContent = ({ }) => {
    const readerSection = useRef(null)

    useEffect(() => {
        const clearSection = () => {
            readerSection.current.innerHTML = ""
        }
        StateManager.set('readerSection', readerSection.current)
        // Show context menu on right click
        readerSection.current.addEventListener('contextmenu', function(e) {
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

        document.addEventListener('selectionchange', () => {
            const is_valid_selection = selectionhelper.updateAppstate()

            if (!is_valid_selection) return

            document.dispatchEvent(new CustomEvent('show-onselect-tooltip-menu'))
        })

        document.addEventListener('clear-reader-section', clearSection)
        return () => {
            //StateManager.set('readerSection', null)
            document.removeEventListener('clear-reader-section', clearSection)
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
