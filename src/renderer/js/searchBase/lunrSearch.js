const lunr = require('lunr');
const fs = require('fs').promises;
const path = require('path');

const contentFile = "search_optimized_ubook.json";

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

async function search(_query) {
    const query = sanitizeQuery(_query)
    const data = await window.api.readContent(contentFile);
    ;
    if (!data) return [];

    const documents = flattenContent(data);
    const idx = await buildIndex(documents);

    const results = idx.search(query);
    const docMap = Object.fromEntries(documents.map(doc => [doc.id, doc]));

    console.log(results)

    return results.map(result => ({
        score: result.score,
        ...docMap[result.ref],
    }));
}

function sanitizeQuery(query) {
    return query.replace(/[:~^*+-]/g, ' ').trim(); // Replace special Lunr chars with space
}

window.lunrsearch = search;

// Usage

//const query = `It is exceedingly difficult to present enlarged concepts and advanced truth`;

/*search(query).then(results => {
    console.log("Top Match:\n", results[0] ?? "No result");
});
*/
