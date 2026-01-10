const partNameMap = {
    0: 'Foreword',
    1: 'Central and Superuniverse',
    2: 'Local Universe',
    3: 'History of Urantia',
    4: 'Life and Teachings of Jesus'
};

const part_keys = [
    "foreword_source",
    "central_superuniverses_source",
    "local_universe_source",
    "history_urantia_source",
    "jesus_life_teachings_source"
]


export class ContentHelper {
    static randomized_part() {
        return this.getSource(part_keys[Math.floor(Math.random() * part_keys.length)])
    }

    static getSource(target) {
        const sources = {
            "foreword_source": 'FN-foreword_structured.json',
            "central_superuniverses_source": "FN-central_superuniverses_structured.json",
            "local_universe_source": "FN-Local_Universe_structured.json",
            "history_urantia_source": "FN-History_of_Urantia_structured.json",
            "jesus_life_teachings_source": "FN-Life_and_Teachings_of_Jesus_structured.json"
        }
        return sources[target]
    }

    static prepTitle(section, fore = false, sep = ':') {
        if (fore === false) {
            return `${section.section_number} ${sep} ${section.title}`
        }
        let title = null
        if (section.section_number) {
            if (section.section_number > 1) {
                title = `${section.section_number.split(':')[1]}`
            } else {
                title = `${section.section_number} ${sep} ${section.title}`
            }
        }
        return title
    }
    static spanText(text) {
        const segments = text.split('.');

        const spannedText = segments.map(segment => {
            if (segment.trim() !== '') {
                return `<span class="p-0">${segment}</span>`;
            }
            return '';
        }).join('. ');

        return spannedText;
    }

    static checkComment(paragraph) {
        try {
            let comment = null;

            if (paragraph.text.split('[') && paragraph.text.split('[')[1].slice(-1) === "]") {
                comment = paragraph.text.split('[')[1].slice(0, -1) || null
            } else {
                paragraph.text.split('[')[1] || null;
            }
            return comment || null
        } catch (err) {
            //console.log(err)
        }
    }
    static cleanText(text, parNo) {
        const CT = text
            .replace(/\n+/g, '<br>')
            .replace(/\(\d+(\.\d+)?\)\s/g, "") // replace (6666.3) paper number
            .replace(/[“”]/g, '"')  // smart double quotes → straight double quote
            .replace(/[‘’]/g, "'")  // smart single quotes → straight single quote
        return wrapTextInParagraphs(spanText(CT), parNo);

    }
    static wrapTextInParagraphs(text, paragraph_number) {
        // Split the text by <br> tags
        const segments = text.split(/<br\s*\/?>\s*/g);

        // Wrap each segment in <p> tags and reassemble the text
        const wrappedText = segments.map(segment => {
            if (segment.trim() !== '') {
                return `<p class=""><span class="mr-3 underline decoration-indigo-400 text-amber-700 dark:text-amber-400">${paragraph_number}&nbsp<span class="text-emerald-700 dark:text-emerald-400">&DoubleRightArrow;</span></span><span class="p-0">${segment}</span></p><br>`;
            }
            return '';
        }).join('<br>');

        return wrappedText;
    }
    static getPartName(id) {
        return partNameMap[id] || null;
    }
    /**
     * Generates a structure object used for bookmarks/favourites and tracking.
     * @param {Object} section - Section data.
     * @param {Object} paper - Paper data.
     * @param {Object} part - Part data.
     * @returns {Object} Structured metadata.
     */
    static createStructure(section, paper, part) {
        return {
            part_id: part.id,
            part_name: this.getPartName(part.id),
            paper_id: paper.paper_id,
            section_number: section.section_number,
            section_title: section.title,
        };
    }
    static async isFavourited(struct) {
        // Read Favourites file
        const fav = await window.ubook.api.readFavourites();

        if (!fav || !Array.isArray(fav.fav)) return;

        const matchFound = fav.fav.some(value => {
            return value.part_id === struct.part_id &&
                value.paper_id === struct.paper_id &&
                value.section_number === struct.section_number;
        });

        return matchFound
    }
    static async isBookmarked(struct) {
        const bookmarks = await window.ubook.api.readBookmarks();

        if (!bookmarks || !Array.isArray(bookmarks.bookmark)) return;

        const matchFound = bookmarks.bookmark.some(value => {
            return value.part_id === struct.part_id &&
                value.paper_id === struct.paper_id &&
                value.section_number === struct.section_number;
        });

        return matchFound
    }
    static scrollToTop(element) {
        // Use setTimeout to ensure the scroll happens after the DOM has updated
        setTimeout(() => {
            element.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }

    static scrollToBottom(element) {
        // Use setTimeout to ensure the scroll happens after the DOM has updated
        setTimeout(() => {
            element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
        }, 100);
    }
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
