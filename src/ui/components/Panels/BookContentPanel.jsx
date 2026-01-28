import React, { useCallback, useEffect, useRef } from 'react';
import ubookdesktopDark from '@assets/ubookdesktop.png';
import ubookdesktopLight from '@assets/ubookdesktop-light.png';
import { useTheme } from '../Themes/useThemeHeadless';
import { waitForElement } from '../../../renderer/js/syscore/dom_utils';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';
import { ContentLoader_ins } from './content_loader';

export const BookContentPanel = ({ }) => {
    const panel = useRef(null)
    const forewordRef = useRef(null)

    const { isDark, toggleTheme, setTheme } = useTheme();

    const icon = useRef(isDark ? ubookdesktopLight : ubookdesktopDark)

    useEffect(() => {
        icon.current = isDark ? ubookdesktopLight : ubookdesktopDark
    }, [isDark])

    const ToggleBookContentPanel = useCallback(() => {
        const focused = StateManager.get('focusMode')
        focused ? showPanel() : hidePanel()

    })

    const showPanel = useCallback(() => {
        panel.current.classList.remove('-translate-x-full', 'xl:-translate-x-full');
        panel.current.classList.add('-translate-x-0', 'xl:translate-x-0');
    })
    const hidePanel = useCallback(() => {
        panel.current.classList.add('-translate-x-full', 'xl:-translate-x-full');
        panel.current.classList.remove('-translate-x-0', 'xl:translate-x-0');
    })

    const panelToggleHandler = useCallback(() => {
        const isPanelOpen = window.innerWidth < 1280 ? panel.current.classList.contains('-translate-x-0') : panel.current.classList.contains('xl:translate-x-0')
        isPanelOpen ? hidePanel() : showPanel()
    })

    StateManager.set('BookPanelToggle', panelToggleHandler)

    useEffect(() => {
        setTimeout(() => {
            //forewordRef.current.click()
            ContentLoader_ins.setForeword(true)
            waitForElement('#paper-container > :first-child', (el) => {
                el.click();
            });
        }, 100)

        document.addEventListener('focusMode', ToggleBookContentPanel)
        document.addEventListener('toggle-left-panel', panelToggleHandler)
        document.addEventListener('hide-book-content-panel', hidePanel)

        return () => {
            document.removeEventListener('focusMode', ToggleBookContentPanel)
            document.removeEventListener('toggle-left-panel', panelToggleHandler)
            document.removeEventListener('hide-book-content-panel', hidePanel)
        }
    })

    return (
        <div
            ref={panel}
            id="sidepane"
            className="fixed z-40 left-0 w-[300px] bg-gradient-to-br from-indigo-900 to-indigo-950 dark:from-[#001f2b] dark:to-[#001f2b] h-[calc(100vh-7vh)] shadow-2xl transform transition-transform -translate-x-full xl:translate-x-0 transition-colors duration-700 ease-in-out select-none">
            <div className="flex items-center p-4 border-b border-indigo-700 dark:border-[#00455e]">
                <img className="h-12 w-14 rounded-full" src={icon.current}></img>
                <h1 className="text-white dark:text-gray-300 text-2xl ml-2">Urantia Book Desktop</h1>
            </div>
            <section className="h-fit max-h-[72%] overflow-y-auto scrollbar-custom select-none bg-indigo-950/25 dark:bg-[#002b36] rounded-lg">
                <ul className="mt-3">
                    <li ref={forewordRef} id="foreword" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-indigo-800/80 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setForeword()}>📖 Foreword</li>
                    <li id="central-and-superuniverse" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-indigo-800/80 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setSuperUniverse()}><span className="bg-pink-600 rounded-full px-0.5">🌀</span>&nbsp; The Central and Superuniverses</li>
                    <li id="local-universe" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-indigo-800/80 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setLocalUniverse()}>🌍 The Local Universe</li>
                    <li id="history-of-urantia" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-indigo-800/80 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setHistoryOfUrantia()}>📜 The History of Urantia</li>
                    <li id="life-and-teachings-of-jesus" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-indigo-800/80 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setJesusTeachings()}>✝️ The Life and Teachings of Jesus</li>
                    <li id="favourite" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-indigo-800/80 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.loadFavourites()}>⭐ Favourite</li>
                    <li id="bookmark" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-indigo-800/80 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.loadBookmarks()}>🔖 Bookmarks</li>
                    <li id="notes" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-indigo-800/80 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.renderNotes()}>📔 Notes</li>
                    <li id="more-apps" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-indigo-800/80 dark:hover:bg-[#00445f]/70 cursor-pointer">🧰 More Applications</li>
                    <li id="exit-app" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-indigo-800/80 dark:hover:bg-[#00445f]/70 cursor-pointer">🚪 Exit</li>
                </ul>
            </section>
            <div className="absolute left-0 bottom-4 flex items-center justify-center w-full px-6">
                <div className="flex items-center select-none bg-indigo-600 dark:bg-[#002a39] rounded-full p-2 w-full">
                    <span className="text-xs text-indigo-200 font-medium mr-2 hidden md:block">Theme</span>
                    <label className="relative inline-block w-12 h-6 cursor-pointer select-none">
                        <input onChange={() => setTheme(isDark ? 'light' : 'dark')} checked={isDark} type="checkbox" id="theme-toggle" className="peer hidden"></input>
                        <span className="absolute inset-0 bg-indigo-500 peer-checked:bg-teal-500 transition rounded-full"></span>
                        <span className="absolute left-1 bottom-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
                    </label>
                    <span className="text-xs text-indigo-200 font-medium ml-2">Light/Dark</span>
                </div>
            </div>
        </div>
    );
};

export const ContentEmpty = ({ info }) => {
    return (
        <h2 class='text-center font-semibold text-gray-900 dark:text-white underline'>{info}</h2>
    )
}
