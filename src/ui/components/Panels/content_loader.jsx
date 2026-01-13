import { modalmanager } from '../../../renderer/js/Status/Manager';
import { ContentHelper } from '../Reader/Book/utils';
import { BookReader } from '../Reader/Book/Reader';
import { waitForElement } from '../../../renderer/js/syscore/dom_utils';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';

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
