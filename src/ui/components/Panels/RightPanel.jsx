import React, { useCallback, useEffect, useRef } from 'react';
import { OnselectTooltip } from '../Tooltips/onSelect';

export const RightPanel = ({ }) => {
    const panelMask = useRef(null)
    const panel = useRef(null)

    const TogglePanel = useCallback(() => {
        const focused = window.StateManager.get('focusMode')
        focused ? showPanel() : hidePanel()

    })

    const showPanel = useCallback(() => {
        panelMask.current.classList.remove('xl:translate-x-full');
        panelMask.current.classList.add('translate-x-0');
        panel.current.classList.remove('xl:translate-x-full');
        panel.current.classList.add('translate-x-0');
    })

    const hidePanel = useCallback(() => {
        panelMask.current.classList.add('translate-x-full');
        panelMask.current.classList.remove('translate-x-0');
        panel.current.classList.add('xl:translate-x-full');
        panel.current.classList.remove('translate-x-0');
    })

    const panel_toggle_eaval = useCallback(() => {
        const isOpen = panelMask.current.classList.contains('translate-x-0')
        isOpen ? hidePanel() : showPanel()
    })

    useEffect(() => {
        document.addEventListener('focusMode', TogglePanel)
        document.addEventListener('toggle-right-panel', panel_toggle_eaval)

        return () => {
            document.removeEventListener('focusMode', TogglePanel)
            document.removeEventListener('toggle-right-panel', panel_toggle_eaval)
        }
    })

    return (
        <section ref={panelMask} id="RightpanelMask" className="bg-slate-700/20 backdrop-blur-sm translate-x-full xl:translate-x-0 w-fit fixed right-0 transform transition-all duration-700 ease-in-out z-[40] hover:bg-slate-700/30">
            <div ref={panel} id="Rightpanel" className="relative w-[21.9vw] h-[calc(100vh-7vh)] shadow-md transform translate-x-full xl:translate-x-0 transition-all duration-700 ease-in-out bg-gradient-to-b from-white/95 to-gray-100/95 dark:from-gray-900/95 dark:to-gray-800/95 rounded-none border-none">
                <span onClick={hidePanel} className="absolute top-2 right-2 text-gray-200 dark:text-sky-500 text-2xl cursor-pointer hover:rotate-45 transition-transform duration-500">&times;</span>
                <div id="quick-acsess-head" className="flex w-full p-4 text-white dark:text-gray-200 bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-amber-900 dark:to-orange-900 select-none rounded-none shadow-inner">
                    <h3 className="text-lg font-semibold tracking-wide">Quick Access</h3>
                </div>

                <section id="quick-acsess-container" className="h-fit pb-[16vh] max-h-[84vh] overflow-y-auto select-text bg-gradient-to-b from-blue-50/80 to-blue-100/80 dark:invert rounded-[8px] m-2 transform transition-all duration-700 font-reader scrollbar-custom border border-white/50 shadow-inner">
                </section>

                <OnselectTooltip />
            </div>
        </section>
    );
};
