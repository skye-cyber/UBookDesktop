import { ContentHelper } from "./utils";

/**
 * Reader is responsible for rendering paper sections into a container,
 * setting up user interactions (bookmark/favourite), and displaying content in the reader pane.
 */
export class BookReader {
    /**
     * @constructor
     * @param {HTMLElement} container - The DOM element where section entries will be appended.
     * @param {HTMLElement} readerSection - The DOM element where full section content will be displayed.
     * @param {Object} api - API interface for performing data operations (e.g., fetching, bookmarking).
     */
    constructor(container, readerSection, api = window.ubook.api) {
        this.paperContainer = container;
        this.readerSection = readerSection;
        this.api = api;
    }

    /**
     * Loads and displays paper sections from a part.
     * @async
     * @param {Object} part - The part metadata (may include ID or full object).
     * @param {Object|null} [part_data=null] - Optional: if provided, skips API call and uses directly.
     * @param {boolean} [incr=false] - (Unused) Optional flag to control numbering or UI logic.
     */
    async load(part = null, part_data = null) {
        const data = part_data || await this.api.readContent(part);
        const partData = part_data ? data : data.parts?.[0];

        if (!partData || !partData.papers) return;

        for (const paper of partData.papers) {
            for (const section of paper.sections) {
                const title = ContentHelper.prepTitle(section);

                const datatag = `${partData.id}-${paper.paper_id}-${section.section_number}`

                const struct = {
                    part_id: partData.id,
                    paper_id: paper.paper_id,
                    section_number: section.section_number,
                };

                window.reactPortalBridge.showComponentInTarget(
                    'BookItem',
                    'paper-container',
                    {
                        part: partData, paper: paper, section: section, title: title, tag: datatag, struct: struct
                    },
                    'book_section'
                )
            }
        }
    }

    /**
     * Attaches click event listeners to a section entry to handle:
     * - Bookmark toggling
     * - Favourite toggling
     * - Displaying the section
     * @param {HTMLElement} entry - Section entry element.
     * @param {Object} section - Section object containing paragraphs and title.
     * @param {Object} paper - Paper metadata.
     * @param {Object} part - Part metadata.
     */
    setupClickEvent(entry, section, paper, part) {
        entry.addEventListener('click', async (event) => {
            let target = event.target;

            while (target !== entry) {
                const lastChild = entry.lastChild;
                const firstChild = entry.children[0];

                if (target === lastChild || lastChild.contains(target)) {
                    event.preventDefault();
                    this.handleFavouriteClick(lastChild, section, paper, part);
                    return;
                } else if (target === firstChild || firstChild.contains(target)) {
                    event.preventDefault();
                    this.handleBookmarkClick(firstChild, section, paper, part);
                    return;
                }

                target = target.parentNode;
            }

            this.displaySection(section);
            activeSection = entry;
        });
    }

    /**
     * Handles toggling of favourite state and displays appropriate toast.
     * @async
     * @param {HTMLElement} node - Node containing the favourite SVG icon.
     * @param {Object} section - Section data.
     * @param {Object} paper - Paper data.
     * @param {Object} part - Part data.
     */
    async handleFavouriteClick(node, section, paper, part) {
        highLightFav(node.getElementsByTagName('svg')[0]);
        const structure = this.createStructure(section, paper, part);
        const status = { success: true } //await this.api.addFavourite(structure);
        if (status.success) {
            status.task === 'add'
                ? showActionToast('favourite')
                : showActionToast(null, 'Favourite Removed!', '💔');
        }
    }

    /**
     * Handles toggling of bookmark state and displays appropriate toast.
     * @async
     * @param {HTMLElement} node - Node containing the bookmark SVG icon.
     * @param {Object} section - Section data.
     * @param {Object} paper - Paper data.
     * @param {Object} part - Part data.
     */
    async handleBookmarkClick(node, section, paper, part) {
        highLightBookmark(node.getElementsByTagName('svg')[0]);
        const structure = this.createStructure(section, paper, part);
        const status = { success: true } //await this.api.addBookmark(structure);
        if (status.success) {
            status.task === 'add'
                ? showActionToast('bookmark')
                : showActionToast(null, 'Bookmark Removed!', '🔖');
        }
    }

    /**
     * Generates a structure object used for bookmarks/favourites and tracking.
     * @param {Object} section - Section data.
     * @param {Object} paper - Paper data.
     * @param {Object} part - Part data.
     * @returns {Object} Structured metadata.
     */
    createStructure(section, paper, part) {
        return {
            part_id: part.id,
            part_name: getPartName(part.id),
            paper_id: paper.paper_id,
            section_number: section.section_number,
            section_title: section.title,
        };
    }

    /**
     * Renders a section's title and paragraphs in the reading pane.
     * @param {Object} section - Section object with title and paragraphs.
     */
    displaySection(section) {
        this.readerSection.innerHTML = "";

        const head = document.createElement('h1');
        head.className = "text-3xl font-bold mb-4 text-center underline decoration-lime-400";
        head.textContent = section.title;
        this.readerSection.appendChild(head);

        section.paragraphs.forEach(paragraph => {
            const comment = checkComment(paragraph);
            const span = `<span class="text-md text-sky-500"><i>${comment}</i></span>`;
            const div = document.createElement('div');
            const text = cleanText(paragraph.text, paragraph.paragraph_number).replace(comment, span);
            div.innerHTML = `${text}`;
            this.readerSection.appendChild(div);
        });

        hideSelectorModal();
        setTimeout(() => scrollToTop(readerWrapper), 100);
    }
}
