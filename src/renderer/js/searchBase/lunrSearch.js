const lunr = require('lunr');

/**
 * Maps IDs to their respective structured JSON files
 * @param {Array<number|string>} ids
 * @returns {string[]} List of file paths
 */
function getFileMap(ids = []) {
    const sources = {
        1: 'FN-foreword_structured.json',
        2: 'FN-central_superuniverses_structured.json',
        3: 'FN-Local_Universe_structured.json',
        4: 'FN-History_of_Urantia_structured.json',
        5: 'FN-Life_and_Teachings_of_Jesus_structured.json',
        '_all_': 'FN-Combined_Structured_UB.json'
    };

    return ids.map(id => sources[id]).filter(Boolean); // Avoid undefined entries
}

/**
 * Flattens the nested JSON content into an array of searchable documents
 * @param {Object} data
 * @returns {Array<Object>}
 */
function flattenContent(data) {
    const documents = [];

    data.parts?.forEach(part => {
        part.papers?.forEach(paper => {
            paper.sections?.forEach(section => {
                section.paragraphs?.forEach(paragraph => {
                    documents.push({
                        id: `${part.id}-${paper.paper_id}-${section.section_number}-${paragraph.paragraph_number}`,
                        partTitle: part.title,
                        paperTitle: paper.title,
                        sectionNumber: section.section_number,
                        sectionTitle: section.title,
                        paragraphNumber: paragraph.paragraph_number,
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
async function buildIndex(documents) {
    return lunr(function() {
        this.ref('id');
        this.field('content');
        this.field('sectionTitle');
        this.field('paperTitle');
        this.field('partTitle');

        documents.forEach(doc => this.add(doc));
    });
}

/**
 * Sanitizes the query string by removing or replacing special characters
 * @param {string} query
 * @returns {string}
 */
function sanitizeQuery(query) {
    return query.replace(/[:~^*+-]/g, ' ').trim(); // Remove Lunr special characters
}

/**
 * Searches structured documents for a given query
 * @param {string} _query - The search query
 * @param {Array<number|string>} ids - Source file IDs
 * @returns {Promise<Object[]>} Array of matched results
 */
async function search(ids, _query) {
    const query = sanitizeQuery(_query);
    const sourceFiles = getFileMap(ids);

    const results = [];

    await Promise.all(sourceFiles.map(async (file) => {
        const data = await window.api.readContent(file);
        if (!data) return;

        const documents = flattenContent(data);
        const idx = await buildIndex(documents);

        const docMap = Object.fromEntries(documents.map(doc => [doc.id, doc]));
        const res = idx.search(query);

        results.push(...res.map(result => ({
            score: result.score,
            ...docMap[result.ref],
        })));
    }));
    // Sort results by score in descending order (higher score = more relevant)
    results.sort((a, b) => b.score - a.score);

    return results;
}


// Expose search globally
window.lunrsearch = search;
