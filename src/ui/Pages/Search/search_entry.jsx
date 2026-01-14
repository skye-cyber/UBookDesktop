import { reactPortalBridge } from "../../../renderer/js/react-portal-bridge";
import { searchcontent } from "../../../renderer/js/searchBase/contentsearch";
import { modalmanager } from "../../../renderer/js/Status/Manager";
import { StateManager } from "../../../renderer/js/syscore/StatesManager";
import { lunrsearch } from "../../../renderer/js/searchBase/LunrSearch";

export class BaseSearchEntry {
    /**
     * Perform Lunr-based full-text search
     * @param {Array<string|number>} ids
     * @param {string} query
     */
    static async fullTextSearch(ids, query) {
        let results

        try {
            results = await lunrsearch.search(ids, query);

            if(!results) return false

            this.renderTextSearchResult(results, query);

            // Clean up
            return results
        } catch (error) {
            modalmanager.showMessage(error, 'error')
            return false;
        } finally {
            results = null
        }
    }

    static async sectionSearch(ids, query) {
        const result = await searchcontent.run(ids, query);
        return result;
    }

    static renderTextSearchResult(results, query) {
        // Clear result page and set title
        StateManager.get('prepSearchPage')(query, results.length || 0)

        const keywords = query.split(/\s+/).filter(Boolean);
        let count = 0;

        results.forEach(result => {
            count++;
            // Highlight keywords
            let highlightedContent = result.content.replace(/[\'\"]/g, "")

            const Qpattern = new RegExp(`(${this.escapeRegExp(query)})`, "gi");

            if (highlightedContent.toLowerCase().includes(query.toLowerCase())) {
                highlightedContent = highlightedContent.replace(Qpattern, `<span class='font-mono p-0.5 bg-yellow-500 rounded-sm dark:bg-slate-950 text-black dark:text-yellow-400'>$1</span>`);
            } else {
                let proceedQueue = []
                keywords.forEach(word => {
                    if (!proceedQueue.includes(proceedQueue)) {
                        const pattern = new RegExp(`(${this.escapeRegExp(word)})`, "gi");

                        highlightedContent = highlightedContent.replace(pattern, `<span class='font-mono p-0.5 bg-yellow-500 rounded-sm dark:bg-slate-950 text-black dark:text-yellow-400 space-x-1'>$1</span>`);
                        proceedQueue.push(word)
                    }
                });
            }

            const link_data = JSON.stringify({
                part_id: result.part_id,
                paper_id: result.paper_id,
                section_number: result.section_number,
                paragraph_number: result.paragraph_number,
            })

            reactPortalBridge.showComponentInTarget(
                'ResultCard',
                'searchResult',
                {
                    result: result,
                    link_data: link_data,
                    highlightedContent: highlightedContent,
                    count: count
                },
                'searchResult'
            )
        })
        return true
    }
    /**
     * Escape special characters for regex use
     * @param {string} str
     * @returns {string}
     */
    static escapeRegExp(str) {
        return str.replace(/[.\*+?^${}()|[\]\\]/g, "\\$&");
    }

}
