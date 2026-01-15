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
            // Add reasonable limit to prevent memory overload
            results = await lunrsearch.search(ids, query, 50);

            if (!results || results.length === 0) {
                modalmanager.showMessage('No results found', 'info');
                StateManager.get('clearSearchResult')("No results found for the search")
                return false
            }
            const renderResult = this.renderTextSearchResult(results, query, 10);

            // Pass results and pagination info to UI
            StateManager.get('prepSearchPage')(
                query,
                renderResult.displayedResults,
                results,
                renderResult.hasMore
            );

            return {
                success: true,
                totalResults: results.length,
                displayedResults: renderResult.displayedResults,
                hasMore: renderResult.hasMore
            };
        } catch (error) {
            modalmanager.showMessage(error, 'error')
            return false;
        } finally {
            results = null;
        }
    }

    static async sectionSearch(ids, query) {
        const result = await searchcontent.run(ids, query);
        return result;
    }

    static renderTextSearchResult(results, query, limit = 10) {

        // Clear result page and set title
        StateManager.get('prepSearchPage')(query, Math.min(results.length, limit) || 0)

        const keywords = query.split(/\s+/).filter(Boolean);
        let count = 0;

        // Only render limited results to prevent UI overload
        const limitedResults = results.slice(0, limit);

        limitedResults.forEach(result => {
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

            const link_data = {
                part_id: result.part_id,
                paper_id: result.paper_id,
                section_number: result.section_number,
                paragraph_number: result.paragraph_number,
            }

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

        return {
            totalResults: results.length,
            displayedResults: count,
            hasMore: results.length > limit
        }
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
