import React, { useCallback, useEffect, useRef } from 'react';
import ubookesktop from '@assets/ubookdesktop.png';
import { useTheme } from '../Themes/useThemeHeadless';
import { waitForElement } from '../../../renderer/js/syscore/dom_utils';
import { BookReader } from '../Reader/Book/core';
import { ContentHelper } from '../Reader/Book/utils';

export class ContentLoader {
    constructor() {
        this.selector_title
        this.paper_container
        this.reader_section
        //this.reader_wrapper

        this.init()
    }

    init() {
        waitForElement('#selector-part-title', (el) => {
            this.selector_title = el
        })
        waitForElement('#paper-container', (el) => {
            this.paper_container = el
        })

        waitForElement('#reader-content', (el) => {
            this.reader_section = el
            window.StateManager.set('reader_section', el)
        })
    }

    setForeword() {
        this.selector_title.textContent = 'Foreword'
        this.paper_container.innerHTML = ""
        document.dispatchEvent(new CustomEvent('show-item-selector'))
        const reader = new BookReader(this.paper_container, this.reader_section)
        reader.load(ContentHelper.getSource('foreword_source'));
    }
    setLocalUniverse() {
        this.selector_title.textContent = 'Local Universe'
        this.paper_container.innerHTML = ""
        document.dispatchEvent(new CustomEvent('show-item-selector'))
        const reader = new BookReader(this.paper_container, this.reader_section)
        reader.load(ContentHelper.getSource('local_universe_source'));
    }
    setSuperUniverse() {
        this.selector_title.textContent = 'Central and Superuniverse'
        this.paper_container.innerHTML = ""
        document.dispatchEvent(new CustomEvent('show-item-selector'))
        const reader = new BookReader(this.paper_container, this.reader_section)
        reader.load(ContentHelper.getSource('central_superuniverses_source'));
    }
    setHistoryOfUrantia() {
        this.selector_title.textContent = 'History of Urantia'
        this.paper_container.innerHTML = ""
        document.dispatchEvent(new CustomEvent('show-item-selector'))
        const reader = new BookReader(this.paper_container, this.reader_section)
        reader.load(ContentHelper.getSource('history_urantia_source'));
    }
    setJesusTeachings() {
        this.selector_title.textContent = 'Life and Teachings of Jesus'
        this.paper_container.innerHTML = ""
        document.dispatchEvent(new CustomEvent('show-item-selector'))
        const reader = new BookReader(this.paper_container, this.reader_section)
        reader.load(ContentHelper.getSource('jesus_life_teachings_source'));
    }
    static loadFavourites() {
        //
    }
    static loadBookmarks() {
        //
    }
    static renderNotes() {
        //
    }

}

const ContentLoader_ins = new ContentLoader()

export const BookContentPanel = ({ }) => {
    const panelMask = useRef(null)
    const panel = useRef(null)
    const { isDark, toggleTheme, setTheme } = useTheme();

    const ToggleBookContentPanel = useCallback(() => {
        const focused = window.StateManager.get('focusMode')
        focused ? showPanel() : hidePanel()

    })

    const showPanel = useCallback(() => {
        panelMask.current.classList.remove('-translate-x-full');
        panelMask.current.classList.add('-translate-x-0');
        panel.current.classList.remove('-translate-x-full');
        panel.current.classList.add('-translate-x-0');
    })
    const hidePanel = useCallback(() => {
        panelMask.current.classList.add('-translate-x-full');
        panelMask.current.classList.remove('-translate-x-0');
        panel.current.classList.add('-translate-x-full');
        panel.current.classList.remove('-translate-x-0');
    })

    const panel_toggle_eaval = useCallback(() => {
        const isOpen = panelMask.current.classList.contains('-translate-x-0')
        isOpen ? hidePanel() : showPanel()
    })

    useEffect(() => {
        document.addEventListener('focusMode', ToggleBookContentPanel)
        document.addEventListener('toggle-left-panel', panel_toggle_eaval)
        document.addEventListener('hide-book-content-panel', hidePanel)

        return () => {
            document.removeEventListener('focusMode', ToggleBookContentPanel)
            document.removeEventListener('toggle-left-panel', panel_toggle_eaval)
            document.removeEventListener('hide-book-content-panel', hidePanel)
        }
    })

    return (
        <section
            ref={panelMask}
            id="sidepaneMask"
            className="bg-indigo-950/25 dark:bg-[#001f2b]/0 -translate-x-full mt-[8vh] w-fit fixed inset-0 transform transition-transform transition-colors duration-700 ease-in-out z-[40]">
            <div
                ref={panel}
                id="sidepane"
                className="relative bg-gradient-to-br from-indigo-900 to-indigo-950 dark:from-[#001f2b] dark:to-[#001f2b] w-72 h-[calc(100vh-7vh)] shadow-2xl transform transition-transform -translate-x-full transition-colors duration-700 ease-in-out">
                <div className="flex items-center p-4 border-b border-indigo-700 dark:border-[#00455e]">
                    <img className="h-12 w-16 rounded-full" src={ubookesktop}></img>
                    <h1 className="text-white dark:text-gray-300 text-2xl ml-2">Urantia Book Desktop</h1>
                </div>
                <section className="h-fit max-h-[72%] overflow-y-auto select-none bg-indigo-950/25 dark:bg-[#002b36] rounded-lg">
                    <ul className="mt-3">
                        <li id="foreword" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setForeword()}>📖 Foreword</li>
                        <li id="central-and-superuniverse" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setSuperUniverse()}><span className="bg-pink-600 rounded-full px-0.5">🌀</span>&nbsp; The Central and Superuniverses</li>
                        <li id="local-universe" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setLocalUniverse()}>🌍 The Local Universe</li>
                        <li id="history-of-urantia" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setHistoryOfUrantia()}>📜 The History of Urantia</li>
                        <li id="life-and-teachings-of-jesus" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setJesusTeachings()}>✝️ The Life and Teachings of Jesus</li>
                        <li id="favourite" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={ContentLoader.loadFavourites()}>⭐ Favourite</li>
                        <li id="bookmark" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={ContentLoader.loadBookmarks}>🔖 Bookmarks</li>
                        <li id="notes" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={ContentLoader.renderNotes()}>📔 Notes</li>
                        <li id="more-apps" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer">🧰 More Applications</li>
                        <li id="exit-app" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer">🚪 Exit</li>
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
        </section>
    );
};
