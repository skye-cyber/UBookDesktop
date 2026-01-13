import React, { useCallback, useEffect, useRef } from 'react';
import ubookesktop from '@assets/ubookdesktop.png';
import { useTheme } from '../Themes/useThemeHeadless';
import { waitForElement } from '../../../renderer/js/syscore/dom_utils';
import { BookReader } from '../Reader/Book/Reader';
import { ContentHelper } from '../Reader/Book/utils';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';
import { modalmanager } from '../../../renderer/js/Status/Manager';

export class ContentLoader {
    constructor() {
        this.selector_title
        this.paper_container
        this.reader_section
        this.notecontent

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
            StateManager.set('reader_section', el)
        })

        waitForElement('#notecontent', (el) => {
            this.notecontent = el
        })
    }

    setForeword(silent = false) {
        this.selector_title.textContent = 'Foreword'
        this.paper_container.innerHTML = ""
        if (!silent) document.dispatchEvent(new CustomEvent('show-item-selector'))
        const reader = new BookReader(this.paper_container, this.reader_section)
        reader.load(ContentHelper.getSource('foreword_source'));
    }
    setLocalUniverse(silent = false) {
        this.selector_title.textContent = 'Local Universe'
        this.paper_container.innerHTML = ""
        if (!silent) document.dispatchEvent(new CustomEvent('show-item-selector'))
        const reader = new BookReader(this.paper_container, this.reader_section)
        reader.load(ContentHelper.getSource('local_universe_source'));
    }
    setSuperUniverse(silent = false) {
        this.selector_title.textContent = 'Central and Superuniverse'
        this.paper_container.innerHTML = ""
        if (!silent) document.dispatchEvent(new CustomEvent('show-item-selector'))
        const reader = new BookReader(this.paper_container, this.reader_section)
        reader.load(ContentHelper.getSource('central_superuniverses_source'));
    }
    setHistoryOfUrantia(silent = false) {
        this.selector_title.textContent = 'History of Urantia'
        this.paper_container.innerHTML = ""
        if (!silent) document.dispatchEvent(new CustomEvent('show-item-selector'))
        const reader = new BookReader(this.paper_container, this.reader_section)
        reader.load(ContentHelper.getSource('history_urantia_source'));
    }
    setJesusTeachings(silent = false) {
        this.selector_title.textContent = 'Life and Teachings of Jesus'
        this.paper_container.innerHTML = ""
        if (!silent) document.dispatchEvent(new CustomEvent('show-item-selector'))
        const reader = new BookReader(this.paper_container, this.reader_section)
        reader.load(ContentHelper.getSource('jesus_life_teachings_source'));
    }
    async loader(type = 'favourites', silent = false) {
        const data = await window.ubook.api[`read${ContentHelper.capitalize(type)}`]();
        const items = data?.[type === 'favourites' ? 'fav' : 'bookmark'];

        if (!Array.isArray(items) || items.length === 0) {
            /*
            window.reactPortalBridge.showComponentInTarget('ContentEmpty', 'paper-container', {info: `No ${capitalize(type)} ❌🤷‍🤷`})
            if (!silent) document.dispatchEvent(new CustomEvent('show-item-selector'))
            */

            return modalmanager.showMessage(`${ContentHelper.capitalize(type)} content is empty`, 'warning');
        }

        this.selector_title.textContent = ContentHelper.capitalize(type);
        this.paper_container.innerHTML = ""

        const contentFile = 'FN-Combined_Structured_UB.json';

        const fullData = await window.ubook.api.readContent(contentFile);
        const PartsDataById = Object.fromEntries(fullData.parts.map(part => [part.id, part]));

        // const reader = new BookReader(this.paper_container, this.reader_section)
        // reader.load(null, PartsDataById)

        for (const item of items) {
            const part = PartsDataById[item.part_id];
            if (!part) continue;

            const paper = part.papers.find(p => p.paper_id === item.paper_id);
            if (!paper) continue;

            const section = paper.sections.find(s => s.section_number === item.section_number);
            if (!section) continue;

            const title = ContentHelper.prepTitle(section);

            const datatag = `${part.id}-${paper.paper_id}-${section.section_number}`

            const struct = {
                part_id: part.id,
                paper_id: paper.paper_id,
                section_number: section.section_number,
            };

            window.reactPortalBridge.showComponentInTarget(
                'BookItem',
                'paper-container',
                {
                    part: part, paper: paper, section: section, title: title, tag: datatag, struct: struct
                },
                'book_section'
            )


        }
        if (!silent) document.dispatchEvent(new CustomEvent('show-item-selector'))
    }

    async loadFavourites() {
        await this.loader('favourites')
    }
    async loadBookmarks() {
        await this.loader('bookmarks')
    }
    async renderNotes(silent = false) {
        const notesData = await window.ubook.api.readNotes();
        const items = notesData?.notes;

        if (!Array.isArray(items) || items.length === 0) {
            /*
             w indow.reactPortalBridge.showComponentInTarget('ContentEmpty', 'paper-container', {info: 'You have not saved any notes'}, 'notes')
             if (!silent) document.dispatchEvent(new CustomEvent('show-notes'))
             */
            return modalmanager.showMessage('Empty! Nothing to show.', 'warning');
        }

        //this.notecontent ? this.notecontent.innerHTML = '' :
        window.reactPortalBridge.closeComponent('notes', true)

        for (const note of items) {
            window.reactPortalBridge.showComponentInTarget(
                'NoteCard',
                'notebody',
                {
                    note: note
                },
                'notes'
            )
        }
        if (!silent) document.dispatchEvent(new CustomEvent('show-notes'))
    }

}

export const ContentLoader_ins = new ContentLoader()

export const BookContentPanel = ({ }) => {
    const panelMask = useRef(null)
    const panel = useRef(null)
    const forewordRef = useRef(null)
    const { isDark, toggleTheme, setTheme } = useTheme();

    const ToggleBookContentPanel = useCallback(() => {
        const focused = StateManager.get('focusMode')
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
        setTimeout(() => {
            //forewordRef.current.click()
            ContentLoader_ins.setForeword(true)
            waitForElement('#paper-container > :first-child', (el) => {
                el.click();
            });
        }, 100)

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
                        <li ref={forewordRef} id="foreword" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setForeword()}>📖 Foreword</li>
                        <li id="central-and-superuniverse" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setSuperUniverse()}><span className="bg-pink-600 rounded-full px-0.5">🌀</span>&nbsp; The Central and Superuniverses</li>
                        <li id="local-universe" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setLocalUniverse()}>🌍 The Local Universe</li>
                        <li id="history-of-urantia" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setHistoryOfUrantia()}>📜 The History of Urantia</li>
                        <li id="life-and-teachings-of-jesus" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.setJesusTeachings()}>✝️ The Life and Teachings of Jesus</li>
                        <li id="favourite" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.loadFavourites()}>⭐ Favourite</li>
                        <li id="bookmark" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.loadBookmarks()}>🔖 Bookmarks</li>
                        <li id="notes" className="flex items-center p-2 text-white dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-[#00445f]/70 cursor-pointer" onClick={() => ContentLoader_ins.renderNotes()}>📔 Notes</li>
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

export const ContentEmpty = ({ info }) => {
    return (
        <h2 class='text-center font-semibold text-gray-900 dark:text-white underline'>{info}</h2>
    )
}
