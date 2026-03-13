/// <reference path="../../types/preload.d.ts" />
import lunr from 'lunr';

export class LunrSearch {
    constructor() {
        this.sources = {
            1: 'FN-foreword_structured.json',
            2: 'FN-central_superuniverses_structured.json',
            3: 'FN-Local_Universe_structured.json',
            4: 'FN-History_of_Urantia_structured.json',
            5: 'FN-Life_and_Teachings_of_Jesus_structured.json',
            '_all_': 'FN-Combined_Structured_UB.json'
        };
    }
    /**
     * Maps IDs to their respective structured JSON files
     * @param {Array<number|string>} ids
     * @returns {string[]} List of file paths
     */
    getFileMap(ids = []) {
        return ids.map(id => this.sources[id]).filter(Boolean); // Avoid undefined entries
    }

    /**
     * Flattens the nested JSON content into an array of searchable documents
     * @param {Object} data
     * @returns {Array<Object>}
     */
    flattenContent(data) {
        const documents = [];

        data.parts?.forEach(part => {
            part.papers?.forEach(paper => {
                paper.sections?.forEach(section => {
                    section.paragraphs?.forEach(paragraph => {
                        documents.push({
                            id: `${part.id}-${paper.paper_id}-${section.section_number}-${paragraph.paragraph_number}`,
                            part_id: part.id,
                            part_title: part.title,
                            paper_id: paper.paper_id,
                            paper_title: paper.title,
                            section_number: section.section_number,
                            section_title: section.title,
                            paragraph_number: paragraph.paragraph_number,
                            content: paragraph.text,
                        });
                    });
                });
            });
        });

        return documents;
    }

    /**
     * Builds a Lunr index from the list of documents
     * @param {Array<Object>} documents
     * @returns {Promise<Object>} Lunr index
     */
    async buildIndex(documents) {
        return lunr(function() {
            this.ref('id');
            this.field('part_id')
            this.field('part_title');
            this.field('paper_id');
            this.field('paper_title');
            this.field('section_number');
            this.field('section_title');
            this.field('paragraph_number')
            this.field('content');

            documents.forEach(doc => this.add(doc));
        });
    }

    /**
     * Sanitizes the query string by removing or replacing special characters
     * @param {string} query
     * @returns {string}
     */
    sanitizeQuery(query) {
        return query.replace(/[:~^*+-]/g, ' ').trim(); // Remove Lunr special characters
    }

    /**
     * Searches structured documents for a given query
     * @param {string} _query - The search query
     * @param {Array<number|string>} ids - Source file IDs
     * @param {number} limit - Maximum number of results to return (default: 50)
     * @returns {Promise<Object[]>} Array of matched results
     */
    async search(ids, _query, limit = 50) {
        let results = [];

        try {
            const query = this.sanitizeQuery(_query);
            const sourceFiles = this.getFileMap(ids);

            // Process files sequentially to reduce memory pressure
            for (const file of sourceFiles) {
                const data = await window.ubook.content.read(file)
                if (!data) continue;

                const documents = this.flattenContent(data);
                const idx = await this.buildIndex(documents);

                const docMap = Object.fromEntries(documents.map(doc => [doc.id, doc]));

                // Only get top results from this file
                const res = idx.search(query).slice(0, limit);

                results.push(...res.map(result => ({
                    score: result.score,
                    ...docMap[result.ref],
                })));

                // Early exit if we have enough results
                if (results.length >= limit) break;

                // Clean up after each file to free memory
                documents.length = 0;
                Object.keys(docMap).forEach(key => delete docMap[key]);
            }

            // Sort and limit final results
            results.sort((a, b) => b.score - a.score);
            return results.slice(0, limit);

        } finally {
            // Clean up results array
            //if (results) results.length = 0;
            results = 0
        }
    }
}

// Expose search globally
export const lunrsearch = new LunrSearch();
