class SearchEngine {
    constructor(wrapper) {
        this.scope = wrapper || document.getElementById('reader-content');
    }

    screenXY(range) {
        // Save the current selection coordinates
        this.rect = range.getBoundingClientRect();
        this.startX = this.rect.left;
        this.startY = this.rect.top;
        this.endX = this.rect.right;
        this.endY = this.rect.bottom;
    }

    getCaretPositionFromPoint(x, y) {
        let pos = null;
        if (document.caretPositionFromPoint) {
            const caret = document.caretPositionFromPoint(x, y);
            pos = { node: caret.offsetNode, offset: caret.offset };
        } else if (document.caretRangeFromPoint) {
            const range = document.caretRangeFromPoint(x, y);
            pos = { node: range.startContainer, offset: range.startOffset };
        }
        return pos;
    }


    searchPage() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        // store screen coordinates
        this.screenXY(range);

        if (!selectedText || selectedText === " ") return;

        // Create a regex to match the search text but not the selected text
        const regex = new RegExp(selectedText, 'g');
        const replaceWith = `<span class="border-2 border-dotted border-pink-500 bg-cyan-200 rounded-sm dark:bg-black dark:border-green-500 p-0">${selectedText}</span>`;

        // Find all occurrences of the search text and their parent elements
        const matches = this.findMatchesInScope(regex)
        matches.forEach(match => {
            const parentElement = match.node.parentNode;
            if (parentElement) {
                const parentTextContent = parentElement.innerHTML;
                const parentRegex = new RegExp(`(${match.match})`, 'g');
                parentElement.innerHTML = parentTextContent.replace(parentRegex, replaceWith);
            }
        });

        // Restore the selection using the saved coordinates
        selection.removeAllRanges();

        const startPos = this.getCaretPositionFromPoint(this.startX, this.startY);
        const endPos = this.getCaretPositionFromPoint(this.endX, this.endY);

        if (startPos && endPos) {
            range.setStart(startPos.node, startPos.offset);
            range.setEnd(endPos.node, endPos.offset);
            selection.addRange(range);
        }
    }

    removeHighlightedSpans() {
        const spans = this.scope.querySelectorAll('span.border-2.border-dotted.border-pink-500.bg-cyan-200.rounded-sm.dark\\:bg-black.dark\\:border-green-500.p-0');


        spans.forEach(span => {
            const parent = span.parentNode;
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        });
    }


    getOffset(originalText, newText, offset) {
        let originalIndex = 0;
        let newIndex = 0;

        while (originalIndex < offset && newIndex < newText.length) {
            if (originalText[originalIndex] === newText[newIndex]) {
                originalIndex++;
                newIndex++;
            } else {
                newIndex++;
            }
        }

        return newIndex;
    }


    findMatchesInScope(regex) {
        const matches = [];
        const walker = document.createTreeWalker(this.scope, NodeFilter.SHOW_TEXT, null, false);

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const text = node.nodeValue;
            let match;

            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    node: node,
                    match: match[0],
                    index: match.index,
                    length: match[0].length,
                });
            }
        }

        return matches;
    }
}

const engine = new SearchEngine();

class SelectiveSearch {
    constructor(part = '_all_') {
        this.part = part;
        this.readerSection = readerSection;
        this.api = window.api;
        this.paperContainer = paperContainer;
        this.PartTitle = PartTitle;
        this.count = 0;
    }

    async run(ids = [], query) {
        if (!query) return console.log('Search Parameter ie <str> is required');
        if (!ids || ids.length === 0) ids = [1, 2, 3, 4, 5];

        const sources = this.getMappedSources(ids);
        if (!sources) return;

        this.paperContainer.innerHTML = "";
        this.count = 0;

        const tasks = sources.map(async (src) => {
            const data = await this.readSrcFile(src);
            const filteredData = this.filterSearch_Strict(data, query);
            if (filteredData.parts.length > 0) {
                this.renderRes(filteredData, query);
            }
        });

        displaySelectorModal();

        await Promise.all(tasks);
        _modalHandler.hide("load");

        return true;
    }

    /**
     * @param {JSON} data - The json data read from file
     * @param {string} query - Search string
     * @returns {JSON} filteredData - filtered json data
     */
    filterSearch(data, query) {
        const filteredData = {
            ...data,
            parts: data.parts?.map(part => {
                const filteredPapers = part.papers?.map(paper => {
                    const filteredSections = paper.sections
                        ?.map(section => ({
                            ...section,
                            __score: this.search(section?.title, query)
                        }))
                        .filter(section => section.__score > 0)
                        .sort((a, b) => b.__score - a.__score); // sort by score descending

                    if (!filteredSections || filteredSections.length === 0) return null;

                    return {
                        ...paper,
                        sections: filteredSections
                    };
                }).filter(Boolean); // remove nulls

                if (!filteredPapers || filteredPapers.length === 0) return null;

                return {
                    ...part,
                    papers: filteredPapers
                };
            }).filter(Boolean)
        };

        return filteredData;
    }

    filterSearch_Flat(data, query) {
        let matchedSections = [];

        data.parts?.forEach(part => {
            part.papers?.forEach(paper => {
                paper.sections?.forEach(section => {
                    const score = this.search(section?.title, query);
                    if (score > 0) {
                        matchedSections.push({
                            ...section,
                            __score: score,
                            __meta: {
                                partTitle: part.title,
                                paperTitle: paper.title
                            }
                        });
                    }
                });
            });
        });

        // Sort all matched sections globally
        matchedSections.sort((a, b) => b.__score - a.__score);

        // Return a synthetic "part" that holds sorted sections
        return {
            parts: [{
                title: "Top Matches",
                papers: [{
                    title: "Sorted Sections",
                    sections: matchedSections
                }]
            }]
        };
    }

    filterSearch_Strict(data, query) {
        const filteredData = {
            ...data,
            parts: data.parts?.map(part => {
                let filteredPapers = part.papers?.map(paper => {
                    const filteredSections = paper.sections
                    ?.map(section => ({
                        ...section,
                        __score: this.search(section?.title, query)
                    }))
                    .filter(section => section.__score > 0)
                    .sort((a, b) => b.__score - a.__score);

                    if (!filteredSections || filteredSections.length === 0) return null;

                    return {
                        ...paper,
                        sections: filteredSections,
                        __maxScore: filteredSections[0].__score
                    };
                }).filter(Boolean);

                if (!filteredPapers || filteredPapers.length === 0) return null;

                // Sort papers by their highest scoring section
                filteredPapers = filteredPapers.sort((a, b) => b.__maxScore - a.__maxScore);

                return {
                    ...part,
                    papers: filteredPapers
                };
            }).filter(Boolean)
        };

        console.log(filteredData)
        return filteredData;
    }

    /**
     * @param {string} title - The title string to search within.
     * @param {string} query - The search query string.
     * @returns {number} - Match score (higher is better).
     */
    search(title = '', query) {
        if (!query || !title) return 0;

        const titleWords = title.toLowerCase().split(/\s+/);
        const queryWords = query.toLowerCase().split(/\s+/);

        let matchCount = 0;
        for (const word of queryWords) {
            if (titleWords.includes(word)) matchCount++;
        }

        return matchCount;
    }

    async readSrcFile(src) {
        return await window.api.readContent(src);
    }

    getMappedSources(ids = []) {
        const sources = {
            1: 'FN-foreword_structured.json',
            2: 'FN-central_superuniverses_structured.json',
            3: 'FN-Local_Universe_structured.json',
            4: 'FN-History_of_Urantia_structured.json',
            5: 'FN-Life_and_Teachings_of_Jesus_structured.json',
            '_all_': 'FN-Combined_Structured_UB.json'
        };

        const isAllSelected = Array.isArray(ids) && [1, 2, 3, 4, 5].every(id => ids.includes(id));
        if (isAllSelected) {
            return ['FN-Combined_Structured_UB.json'];
        }

        return (Array.isArray(ids) ? ids : []).map(id => sources[id]).filter(Boolean);
    }

    renderRes(data, query) {
        const renderer = new Reader(this.paperContainer, this.readerSection, window.api);

        const setTitle = (PartTitle, count) => {
            PartTitle.innerHTML = `Search Result: <span class="text-sm font-mono text-pink-400">@<span class="text-indigo-400 underline decoration-dotted">${query}</span><span class="text-[#ffffff]">&nbsp;Count-</span>${count}</span>`;
        };

        data.parts?.forEach(async (part) => {
            part?.papers?.forEach(paper => {
                this.count += paper.sections?.length;
            });

            setTitle(this.PartTitle, this.count);
            await renderer.load(null, part);
        });
    }
}

