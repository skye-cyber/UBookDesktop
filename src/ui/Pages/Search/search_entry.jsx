import { searchcontent } from "../../../renderer/js/searchBase/contentsearch";
import { modalmanager } from "../../../renderer/js/Status/Manager";
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
            results = [] //await lunrsearch.search(ids, query);
            console.log(results)
            //showResults(results, query);

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
}
