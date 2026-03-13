import { useCallback, useEffect, useRef, useState } from 'react';
import { appState } from '../Reader/appState';
import { contextmenu } from './Helpers/ContextMenu';
import { StateManager } from '../../../common/syscore/StatesManager';
import {
    SelectionOption,
    ThemeOption,
    FontOption,
    PrintOption,
    BoorkmarkDisplayOption,
    ReadAllOption
} from './options';

export const ContextMenu = ({ }) => {
    const tooltip = useRef(null);
    const selectoption = useRef(null);
    const selection = useRef(null);
    const [selectedText, SetselectedText] = useState(null);
    const [selectedHtml, SetselectedHtml] = useState(null);
    const [readerSection, setreaderSection] = useState(null);
    const [sub_menu, set_sub_menu] = useState(null)

    useEffect(() => {
        if (!readerSection) setreaderSection(StateManager.get('readerSection'))
        if (!sub_menu) set_sub_menu(tooltip.current.querySelectorAll(".sub-context-menu"))
        StateManager.set('contextSubMenu', sub_menu)
    })

    const showTooltip = useCallback((e) => {
        // Check if text is selected
        selection.current = appState.currentSelection || window.getSelection()

        const hasSelection = selection.current && selection.current.toString().trim().length > 0;

        // Store selection info
        if (hasSelection && selection.current.rangeCount > 0) {
            selectoption.current.classList.remove('hidden');
        } else {
            selectoption.current.classList.add('hidden');
        }

        tooltip.current.classList.add('active')
        tooltip.current.classList.remove('opacity-0', 'pointer-events-none');
        tooltip.current.classList.add('opacity-100', 'pointer-events-all');

        // Position the context menu
        contextmenu.positionContextMenu(e.pageX || e.detail.pageX, e.pageY || e.detail.pageY, tooltip.current);

        // Hide selection tooltip
        document.dispatchEvent(new CustomEvent('hide-onselect-tooltip-menu'))
    })

    const hideTooltip = useCallback(() => {
        tooltip.current.classList.remove('active')
        tooltip.current.classList.add('opacity-0', 'pointer-events-none');
        tooltip.current.classList.remove('opacity-100', 'pointer-events-all');
        autohidesubmenu()
    })

    /**
     * Hide all context menu except one containing click target.
     * @param e Event
     */
    const autohidesubmenu = useCallback(() => {
        if (!sub_menu) return
        sub_menu.forEach(menu => {
            menu.classList.add('hidden');
        })
    })


    useEffect(() => {
        if (!readerSection) return

        document.addEventListener('click', (e) => {
            if (!tooltip.current.contains(e.target)) hideTooltip()
        })
        document.addEventListener('escape-key-down', hideTooltip)
        readerSection.addEventListener('show-contextmenu-tooltip-menu', showTooltip)
        readerSection.addEventListener('hide-contextmenu-tooltip-menu', hideTooltip)
        return () => {
            readerSection.removeEventListener('show-contextmenu-tooltip-menu', showTooltip)
            readerSection.removeEventListener('hide-contextmenu-tooltip-menu', hideTooltip)
            document.removeEventListener('click', hideTooltip)
            document.removeEventListener('escape-key-down', hideTooltip)
        }
    }, [readerSection])

    return (
        <div
            ref={tooltip}
            //onClick={autohidesubmenu}
            id="contextMenu"
            className="context-menu fixed top-auto right-auto left-1/2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-centered-md shadow-zinc-400 py-2 min-w-[220px] h-fit max-w-fit z-50 border border-[#f8f4e9] dark:border-gray-700 transition-all duration-500 -translate-y-[5px] scale-[0.95] pointer-event-none opacity-0 active:scale-100 active:translate-y-0 scrollbar-custom select-none">
            <div className="context-menu-options">
                {/* Text Selection Options*/}
                <SelectionOption autohide={autohidesubmenu} selectoption={selectoption} />

                <ReadAllOption autohide={autohidesubmenu} />

                {/* General Options */}
                <div id="generalOptions" className="relative font-mono tracking-tighter shadow-balance-xl shadow-pink-400">
                    <FontOption autohide={autohidesubmenu} />
                    <ThemeOption autohide={autohidesubmenu} />

                    <div className="border-t border-gray-300 dark:border-gray-700 my-1"></div>
                    <PrintOption autohide={autohidesubmenu} />
                    <BoorkmarkDisplayOption autohide={autohidesubmenu} />
                </div>
            </div>
        </div>
    )
}
