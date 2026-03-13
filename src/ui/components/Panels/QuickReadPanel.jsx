import { useCallback, useEffect, useRef } from 'react';
import { QuickRead } from '../Reader/Book/QuickRead';
import { StateManager } from '../../../common/syscore/StatesManager';

export const QuickReadPanel = ({ }) => {
    const panel = useRef(null)

    const TogglePanel = useCallback(() => {
        const focused = StateManager.get('focusMode')
        focused ? showPanel() : hidePanel()

    })

    const showPanel = useCallback(() => {
        panel.current.classList.remove('xl:translate-x-full');
        panel.current.classList.add('translate-x-0');
    })

    const hidePanel = useCallback(() => {
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
        <div ref={panel} id="Rightpanel" className="fixed z-[41] right-0 w-[300px] h-[calc(100vh-7vh)] shadow-md transform translate-x-full xl:translate-x-0 transition-all duration-700 ease-in-out bg-gradient-to-b from-white/95 to-gray-100/95 dark:from-primary-900/0 dark:to-primary-800/0 rounded-none border-none">
            <div id="quick-acsess-head" className="flex justify-between w-full p-2 text-white dark:text-gray-200 bg-[#322e7f] dark:bg-[#001f2b] select-none rounded-none border-b border-[#615cff] dark:border-[#005c7d]">
                <h3 className="text-lg font-semibold tracking-wide">Quick Access</h3>
                <span onClick={hidePanel} className="text-gray-200 dark:text-sky-500 text-2xl cursor-pointer hover:rotate-45 transition-transform duration-500">&times;</span>
            </div>
            <QuickRead />
        </div>
    );
};
