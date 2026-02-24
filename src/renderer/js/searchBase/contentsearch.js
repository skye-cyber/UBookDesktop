import { StateManager } from "../syscore/StatesManager";
import { reactPortalBridge } from "../react-portal-bridge";
import { ContentHelper } from "../../../ui/components/Reader/Book/utils";
import { modalmanager } from "../Status/Manager";

export class ContentSearch {
    constructor(part = '_all_') {
        this.part = part;

        StateManager.subscribe('readerSection', (el) => this.readerSection = el)
        StateManager.subscribe('paperContainer', (el) => this.paperContainer = el)
        StateManager.subscribe('selectorTitle', (el) => this.selectorTitle = el)

        this.api = window.ubook.api;
        this.count = 0;
        this.query = null

        this.sources = {
            1: 'FN-foreword_structured.json',
            2: 'FN-central_superuniverses_structured.json',
            3: 'FN-Local_Universe_structured.json',
            4: 'FN-History_of_Urantia_structured.json',
            5: 'FN-Life_and_Teachings_of_Jesus_structured.json',
            '_all_': 'FN-Combined_Structured_UB.json'
        };
    }

    async run(ids = [], query) {
        if (!query) return //console.log('Search Parameter ie <str> is required');
        if (!ids || ids.length === 0) ids = ["_all_"];

        this.query = query

        const sources = this.getMappedSources(ids);
        if (!sources) return;

        if (this.paperContainer) this.paperContainer.innerHTML = "";
        this.count = 0;

        const tasks = sources.map(async (src) => {
            const data = await this.readSrcFile(src);

            const filteredData = this.filterSearch_Strict(data);
            if (filteredData.parts.length > 0) {
                await this.renderResult(filteredData);
            }
        });

        await Promise.all(tasks);

        if (this.count > 0) {
            document.dispatchEvent(new CustomEvent('show-item-selector'))
        } else {
            modalmanager.showMessage('Zero mtaches for query', 'warn')
        }

        return this.count > 0;
    }

    /**
     * @param {JSON} data - The json data read from file
     * @returns {JSON} filteredData - filtered json data
     */
    filterSearch(data) {
        const filteredData = {
            ...data,
            parts: data.parts?.map(part => {
                const filteredPapers = part.papers?.map(paper => {
                    const filteredSections = paper.sections
                        ?.map(section => ({
                            ...section,
                            __score: this.search(section?.title, this.query)
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

    filterSearch_Flat(data) {
        let matchedSections = [];

        data.parts?.forEach(part => {
            part.papers?.forEach(paper => {
                paper.sections?.forEach(section => {
                    const score = this.search(section?.title, this.query);
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

    filterSearch_Strict(data) {
        const filteredData = {
            ...data,
            parts: data.parts?.map(part => {
                let filteredPapers = part.papers?.map(paper => {
                    const filteredSections = paper.sections
                        ?.map(section => ({
                            ...section,
                            __score: this.search(section?.title, this.query)
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

        //console.log(filteredData)
        return filteredData;
    }

    /**
     * @param {string} title - The title string to search within.
     * @param {string} query - The search query string.
     * @returns {number} - Match score (higher is better).
     */
    search(title = '',) {
        if (!this.query || !title) return 0;

        const titleWords = title.toLowerCase().split(/\s+/);
        const queryWords = this.query.toLowerCase().split(/\s+/);

        let matchCount = 0;
        for (const word of queryWords) {
            if (titleWords.includes(word)) matchCount++;
        }

        return matchCount === queryWords.length ? matchCount : 0;
    }

    async readSrcFile(src) {
        return await window.ubook.api.readContent(src);
    }

    getMappedSources(ids = []) {
        const isAllSelected = Array.isArray(ids) && [1, 2, 3, 4, 5].every(id => ids.includes(id));
        if (isAllSelected) {
            return ['FN-Combined_Structured_UB.json'];
        }

        return (Array.isArray(ids) ? ids : []).map(id => this.sources[id]).filter(Boolean);
    }

    async renderResult(data) {
        for (const part of data.parts) {
            for (const paper of part.papers) {
                for (const section of paper.sections) {
                    //const title = `Search Result: ${this.count}`;
                    const title = ContentHelper.prepTitle(section);

                    const datatag = `${part.id}-${paper.paper_id}-${section.section_number}`

                    const struct = {
                        part_id: part.id,
                        paper_id: paper.paper_id,
                        section_number: section.section_number,
                    };

                    reactPortalBridge.showComponentInTarget(
                        'BookItem',
                        'paper-container',
                        {
                            part: part, paper: paper, section: section, title: title, tag: datatag, struct: struct
                        },
                        'section_search_result'
                    )
                    this.count += 1
                }
            }
        }
        const Title = `Search Result: ${this.count}`;
        if (this.selectorTitle) this.selectorTitle.textContent = Title
    }
}

export const searchcontent = new ContentSearch()
