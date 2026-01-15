import React, { useCallback, useEffect, useRef } from 'react';
import { ColorPicker } from './colorpicker';
import { menuaction } from './Helpers/action';
import { appState } from '../Reader/appState';
import { Highlighter } from '../Reader/hightlight';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';

export const OnselectTooltip = ({ }) => {
    const tooltip = useRef(null);
    const activeColorRef = useRef(null);

    const toolTipPositioner = useCallback(() => {

        if (appState.selectedText?.length > 0) {
            const range = appState.currentSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const wrapper = StateManager.get('readerSection')
            const wrapperRect = wrapper.getBoundingClientRect();

            tooltip.current.style.display = 'block';
            tooltip.current.style.visibility = 'hidden'; // so that we can measure it

            requestAnimationFrame(() => {
                const tooltipWidth = tooltip.current.offsetWidth;
                const tooltipHeight = tooltip.current.offsetHeight;

                // Position relative to wrapper
                let top = rect.top - wrapperRect.top - tooltipHeight;

                //prevent from going beyond container bounds y-wise
                if (top < 0) {
                    top = tooltipHeight
                }

                let left = rect.left - wrapperRect.left + rect.width / 2 - tooltipWidth / 2;

                // Constrain within wrapper bounds
                left = Math.max(8, Math.min(left, wrapper.offsetWidth - tooltipWidth - 8));

                tooltip.current.style.top = `${top}px`;
                tooltip.current.style.left = `${left}px`;
                tooltip.current.style.visibility = 'visible';
                tooltip.current.classList.remove('hidden', '-translate-x-[200%]');
                tooltip.current.classList.add('opacity-100');
            });
        } else {
            tooltip.current.classList.add('hidden');
            tooltip.current.classList.remove('opacity-100');
        }
    })

    const ComposeNote = useCallback(() => {
        // show comment modal
        document.dispatchEvent(new CustomEvent('OpenNotesComposer'))
    })

    const showTooltip = useCallback((e) => {
        tooltip.current.classList.remove('hidden', '-translate-x-[200%]', 'opacity-0');
        tooltip.current.classList.add('opacity-100');
        toolTipPositioner()
    })

    const hideTooltip = useCallback(() => {
        tooltip.current.classList.add('hidden', '-translate-x-[200%]', 'opacity-0');
        tooltip.current.classList.remove('opacity-100');
    })

    const showColorPicker = useCallback(() => {
        document.dispatchEvent(new CustomEvent('showColorPicker'))
    })


    const color_update = ((e) => {
        const color = e.detail?.color_className
        if (!color) return
        activeColorRef.className = color
    })

    useEffect(() => {
        document.addEventListener('update-active-color', color_update)
        document.addEventListener('show-onselect-tooltip-menu', showTooltip)
        document.addEventListener('hide-onselect-tooltip-menu', hideTooltip)
        document.addEventListener('escape-key-down', hideTooltip)
        return () => {
            document.removeEventListener('update-active-color', color_update)
            document.removeEventListener('show-onselect-tooltip-menu', showTooltip)
            document.removeEventListener('hide-onselect-tooltip-menu', hideTooltip)
            document.removeEventListener('escape-key-down', hideTooltip)
        }
    })

    return (
        <section ref={tooltip} id="onselect-tooltip-menu"
            className="absolute hidden -translate-x-[200%] bg-gray-900 text-white dark:bg-white dark:text-gray-900 border border-gray-700 dark:border-gray-200 text-sm rounded-lg shadow-xl px-3 py-2 z-50 transition-opacity duration-200 opacity-0 select-none">

            <div id="tooltip-row" className="flex-row justify-start gap-2">
                <div className="flex flex-wrap gap-2 w-fit space-x-3 mb-1">

                    <button onClick={() => menuaction.copy()} className="hover:text-blue-300 dark:hover:text-blue-600"><p className="flex space-x-1"><svg xmlns="http://www.w3.org/2000/svg" className="size-6 fill-none stroke-green-500 hover:stroke-green-400 mr-1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>Copy</p></button>

                    <button onClick={() => menuaction.search()} className="flex hover:text-green-300 dark:hover:text-green-600">
                        <svg className="h-5 w-5 fill-indigo-400 dark:fill-blue-600 text-white dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg>Search
                    </button>

                    <button onClick={ComposeNote} className="hover:text-yellow-300 dark:hover:text-yellow-600">Save Note</button>
                </div>

                <div className="flex flex-wrap gap-2 w-fit space-x-3 pt-2 w-fit border-t border-gray-600 dark:border-gray-300">
                    <button onClick={showColorPicker} className="hidden items-center hover:text-purple-400 dark:hover:text-purple-600">
                        <span ref={activeColorRef} id="current-color-circle" className="size-6 rounded-full bg-yellow-300 dark:bg-yellow-500 mr-1"></span>
                        <span>Color</span>
                    </button>
                    <button onClick={() => Highlighter.hightlight()} className="hover:text-yellow-400 dark:hover:text-yellow-600">🖊️Highlight</button>
                    <button onClick={() => StateManager.get('ReadInnitializer')()} className="hover:text-pink-400 dark:hover:text-pink-600">
                        🔊 Read
                    </button>
                    <button onClick={() => menuaction.handleExport()} className="hover:text-indigo-400 dark:hover:text-indigo-600">
                        💾 Export
                    </button>
                </div>
            </div>
            {/*<ColorPicker />*/}
        </section>
    )
}
