const lunr = require('lunr');
const fs = require('fs').promises;
const path = require('path');
const source = "/home/skye/UBookDesktop/src/assets/files/Combined_Structured_UB.json";

async function fileExists(file) {
    try {
        await fs.access(file);
        return true;
    } catch (err) {
        console.error(`File check failed: ${err.message}`);
        return false;
    }
}

async function readContent() {
    if (await fileExists(source)) {
        const content = await fs.readFile(source, 'utf8');
        return JSON.parse(content);
    }
    return null;
}

function flattenContent(structuredData) {
    const documents = [];
    structuredData.parts.forEach(part => {
        part.papers?.forEach(paper => {
            paper.sections?.forEach(section => {
                section.paragraphs?.forEach(paragraph => {
                    documents.push({
                        id: `${part.id}-${paper.paper_id}-${section.section_number}-${paragraph.paragraph_number}`,
                        partTitle: part.title,
                        paperTitle: `${paper.title}`,
                        section_number:`${section.section_number}`,
                        sectionTitle:`${section.title}`,
                        paragraphNumber: `${paragraph.paragraph_number}`,
                        content: paragraph.text,
                    });
                });
            });
        });
    });
    return documents;
}

async function search(query) {
    const data = await readContent();
    if (!data) return null;

    const documents = flattenContent(data);
    const idx = lunr(function () {
        this.field('content');
        this.field('title');
        this.ref('id');

        documents.forEach(doc => this.add(doc));
    });

    const results = idx.search(query);
    return results.map(result => {
        const matchedDoc = documents.find(doc => doc.id === result.ref);
        return {
            score: result.score,
            ...matchedDoc,
        };
    });
}

// Sample query
const query = `It is exceedingly difficult to present enlarged concepts and advanced truth, in our endeavor to expand cosmic consciousness and enhance spiritual perception, when we are restricted to the use of a circumscribed language of the realm But our mandate admonishes us to make every effort to convey our meanings by using the word symbols of the English tongue We have been instructed to introduce new terms only when the concept to be portrayed finds no terminology in English which can be employed to convey such a new concept partially or even with more or less distortion of meaning`;
search(query).then(results => {
    console.log("Search Results:\n", results[0]);
});
