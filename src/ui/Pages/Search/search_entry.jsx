import { reactPortalBridge } from "../../../common/react-portal-bridge";
import { searchcontent } from "../../../common/searchBase/contentsearch";
import { modalmanager } from "../../../common/Status/Manager";
import { StateManager } from "../../../common/syscore/StatesManager";
import { lunrsearch } from "../../../common/searchBase/LunrSearch";
import { appSettings } from "../../State/appState";

let MAX_RESULTS = 50

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
            MAX_RESULTS = appSettings.search.historySize
            results = await lunrsearch.search(ids, query, MAX_RESULTS);

            if (!results || results.length === 0) {
                modalmanager.showMessage('No results found', 'info');
                StateManager.get('clearSearchResult')("No results found for the search")
                return false
            }
            const renderResult = this.renderTextSearchResult(results, query, { start: 0, end: 10 });

            // Pass results and pagination info to UI
            StateManager.get('prepSearchPage')(
                query,
                results.length,
                results
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

    static renderTextSearchResult(results, query, bounds = { start: 0, end: 10 }) {

        const keywords = query.split(/\s+/).filter(Boolean);
        let count = bounds.start;

        // Only render limited results to prevent UI overload
        const limitedResults = results.slice(bounds.start, bounds.end);

        limitedResults.forEach(result => {
            count++;
            // Highlight keywords
            let highlightedContent = result.content.replace(/[\'\"]/g, "");

            const Qpattern = new RegExp(`(${this.escapeRegExp(query)})`, "gi");

            // Create a temporary placeholder for HTML tags
            const tempPlaceholder = "TEMP_HTML_TAG_";
            let contentWithPlaceholders = highlightedContent.replace(/<[^>]*>/g, (match) => {
                return tempPlaceholder + Math.random().toString(36).substring(2, 15);
            });

            if (contentWithPlaceholders.toLowerCase().includes(query.toLowerCase())) {
                // Replace query matches outside HTML tags
                highlightedContent = contentWithPlaceholders.replace(Qpattern, `<span class="font-mono p-0.5 bg-yellow-500 rounded-sm dark:bg-slate-950 text-black dark:text-yellow-400">$1</span>`);
            } else {
                let proceedQueue = [];
                keywords.forEach(word => {
                    if (!proceedQueue.includes(word) && word.length > 2) {
                        const pattern = new RegExp(`(${this.escapeRegExp(word)})`, "gi");
                        highlightedContent = contentWithPlaceholders.replace(pattern, `<span class="font-mono p-0.5 bg-yellow-500 rounded-sm dark:bg-slate-950 text-black dark:text-yellow-400 space-x-1">$1</span>`);
                        proceedQueue.push(word);
                    }
                });
            }

            // Restore the original HTML tags
            highlightedContent = highlightedContent.replace(new RegExp(tempPlaceholder + "[a-zA-Z0-9]+", "g"), "<");

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
                    query: query,
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
        }
    }
    /**
     * Escape special characters for regex use
     * @param {string} str
     * @returns {string}
     */
    static escapeRegExp(str) {
        return str.replace(/[<!.\*+?^${}()|[\]\\]/g, "\\$&")
    }

}
