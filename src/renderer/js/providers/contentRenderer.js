const PartTitle = document.getElementById('Part-title');
const paperContainer = document.getElementById('paper-container')
const readerSection = document.getElementById('reader-content');
const readerWrapper = document.getElementById('reader-wrapper-container');

function getSource(target) {
    const foreword_source = 'foreword_structured.json';
    const central_superuniverses_source = "central_superuniverses_structured.json";
    const local_universe_source = "Local_Universe_structured.json";
    const history_urantia_source = "History_of_Urantia_structured.json";
    const jesus_life_teachings_source = "Life_and_Teachings_of_Jesus_structured.json";

    const sources = {
        "foreword_source": foreword_source,
        "central_superuniverses_source": central_superuniverses_source,
        "local_universe_source": local_universe_source,
        "history_urantia_source": history_urantia_source,
        "jesus_life_teachings_source": jesus_life_teachings_source
    }
    return sources[target]
}

function CreateItem(text) {
    const item = document.createElement('li')
    item.className = "flex items-center justify-between gap-4 py-3"
    item.innerHTML = `
    <button id="bookmark" class="rounded-full p-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500 hover:text-blue-700 transition">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-none stroke-blue-500" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5v14l7-5 7 5V5H5z" />
    </svg>
    </button>
    <span class="flex-1 cursor-pointer text-left font-medium text-gray-800 dark:text-white">${text}</span>
    <button id="favourite" class="rounded-full p-1.5 hover:bg-pink-300 dark:hover:bg-pink-900 text-pink-100 hover:text-pink-700 transition-colors duration-300 ease-in-out">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 fill-white dark:fill-pink-300 stroke-pink-600">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
    </button>`
    return item
}

function cleanText(text) {
    return text
        .replace(/\n+/g, '<br><br>')
    //.replace(/\n/g, '<br>')
}

function checkComment(paragraph) {
    try {
        let comment = null;

        if (paragraph.text.split('[') && paragraph.text.split('[')[1].slice(-1) === "]") {
            comment = paragraph.text.split('[')[1].slice(0, -1) || null
        } else {
            paragraph.text.split('[')[1] || null;
        }
        return comment || null
    } catch (err) {
        //console.log(err)
    }
}

const partNameMap = {
    0: 'Foreword',
    1: 'Central and Superuniverse',
    2: 'Local Universe',
    3: 'History of Urantia',
    4: 'Life and Teachings of Jesus'
};

function getPartName(id) {
    console.log(id)
    return partNameMap[id] || null;
}


function prepTitle(section, fore = false, sep = ':') {
    if (fore === false) {
        return `${section.section_number} ${sep} ${section.title}`
    }
    let title = null
    if (section.section_number) {
        if (section.section_number > 1) {
            title = `${section.section_number.split(':')[1]}`
        } else {
            title = `${section.section_number} ${sep} ${section.title}`
        }
    }
    return title
}

function toggleSvgClasses(svg, ...classes) {
    if (!svg || !svg.classList) return;
    classes.forEach(cls => svg.classList.toggle(cls));
}

function highLightFav(svg) {
    try {
        toggleSvgClasses(svg, 'fill-white', 'dark:fill-pink-300', 'fill-pink-600');
    } catch (err) {
        console.error('Error in highLightFav:', err);
    }
}

function highLightBookmark(svg) {
    try {
        toggleSvgClasses(svg, 'fill-none', 'fill-blue-600');
    } catch (err) {
        console.error('Error in highLightBookmark:', err);
    }
}

async function checkFav(item, struct) {
    // Read Favourites file
    const fav = await window.api.readFavourites();

    if (!fav || !Array.isArray(fav.fav)) return;

    const matchFound = fav.fav.some(value => {
        return value.part_id === struct.part_id &&
            value.paper_id === struct.paper_id &&
            value.section_number === struct.section_number;
    });

    if (matchFound) {
        const svg = item.lastChild?.getElementsByTagName('svg')[0];
        if (svg) highLightFav(svg);
    }
}


async function checkBookmark(item, struct) {
    const bookmarks = await window.api.readBookmarks();

    if (!bookmarks || !Array.isArray(bookmarks.bookmark)) return;

    const matchFound = bookmarks.bookmark.some(value => {
        return value.part_id === struct.part_id &&
            value.paper_id === struct.paper_id &&
            value.section_number === struct.section_number;
    });

    if (matchFound) {
        const svg = item.children[0]?.getElementsByTagName('svg')[0];
        if (svg) highLightBookmark(svg);
    }
}


class Reader {
    constructor(container, readerSection, api) {
        this.paperContainer = container;
        this.readerSection = readerSection;
        this.api = api;
    }

    async load(part) {
        const data = await this.api.readContent(part);
        const partData = data.parts?.[0];

        if (!partData || !partData.papers) return;

        for (const paper of partData.papers) {
            for (const section of paper.sections) {
                const title = prepTitle(section);
                const sectionEntry = CreateItem(title);
                this.paperContainer.appendChild(sectionEntry);

                const struct = {
                    part_id: partData.id,
                    paper_id: paper.paper_id,
                    section_number: section.section_number,
                };

                await this.checkAndHighlight(sectionEntry, struct);
                this.setupClickEvent(sectionEntry, section, paper, partData);
            }
        }
    }

    async checkAndHighlight(entry, struct) {
        await checkBookmark(entry, struct);
        await checkFav(entry, struct);
    }

    setupClickEvent(entry, section, paper, part) {
        entry.addEventListener('click', async (event) => {
            let target = event.target;

            while (target !== entry) {
                const lastChild = entry.lastChild;
                const firstChild = entry.children[0];

                if (target === lastChild || lastChild.contains(target)) {
                    event.preventDefault();
                    this.handleFavouriteClick(lastChild, section, paper, part);
                    return;
                } else if (target === firstChild || firstChild.contains(target)) {
                    event.preventDefault();
                    this.handleBookmarkClick(firstChild, section, paper, part);
                    return;
                }

                target = target.parentNode;
            }

            this.displaySection(section);
        });
    }

    async handleFavouriteClick(node, section, paper, part) {
        highLightFav(node.getElementsByTagName('svg')[0]);
        const structure = this.createStructure(section, paper, part);
        const status = await this.api.addFavourite(structure);
        if (status.success) {
            status.task === 'add'
                ? showActionToast('favourite')
                : showActionToast(null, 'Favourite Removed!', '💔');
        }
    }

    async handleBookmarkClick(node, section, paper, part) {
        highLightBookmark(node.getElementsByTagName('svg')[0]);
        const structure = this.createStructure(section, paper, part);
        const status = await this.api.addBookmark(structure);
        if (status.success) {
            status.task === 'add'
                ? showActionToast('bookmark')
                : showActionToast(null, 'Bookmark Removed!', '🔖');
        }
    }

    createStructure(section, paper, part) {
        return {
            part_id: part.id,
            part_name: getPartName(part.id),
            paper_id: paper.paper_id,
            section_number: section.section_number,
            section_title: section.title,
        };
    }

    displaySection(section) {
        this.readerSection.innerHTML = "";

        const head = document.createElement('h1');
        head.className = "text-3xl font-bold mb-4 text-center underline decoration-lime-400";
        head.textContent = section.title;
        this.readerSection.appendChild(head);

        section.paragraphs.forEach(paragraph => {
            const comment = checkComment(paragraph);
            const span = `<span class="text-md text-sky-500"><i>${comment}</i></span>`;
            const p = document.createElement('p');
            const text = cleanText(paragraph.text).replace(comment, span);
            p.innerHTML = text;
            this.readerSection.appendChild(p);
        });

        hideSelectorModal();
        setTimeout(() => scrollToTop(readerWrapper), 100);
    }
}

function scrollToTop(element) {
    // Use setTimeout to ensure the scroll happens after the DOM has updated
    setTimeout(() => {
        element.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

function scrollToBottom(element) {
    // Use setTimeout to ensure the scroll happens after the DOM has updated
    setTimeout(() => {
        element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    }, 100);
}

async function setQuickRead(randpart) {

    const data = await window.api.readContent(randpart)

    // Get Random paper
    const papers = data['parts'][0]['papers']
    const randPaper = papers[Math.floor(Math.random() * papers.length)]
    const paperTitle = randPaper.title
    const paper_no = randPaper.paper_id

    //Get Random section
    const sections = randPaper['sections']
    const randSection = sections[Math.floor(Math.random() * sections.length)]


    // Set paper title
    const titleTxt = prepTitle(randSection)
    document.getElementById('quick-acsess-head').innerHTML = `<section class="block w-full">
    <h1 class="flex flex-col w-full text-xl font-bold">${paperTitle}<br><p class="p-0.5 rounded-md bg-white dark:bg-green-600"></p><p class="text-lg font-normal">${titleTxt}</p></h1>
    <div class="flex w-full justify-between items-center">
        <p class="text-sm text-orange-300">
            <sub>${paper_no}</sub>
        </p>

        <button onclick="init6()" aria-label="reload" title="Reload"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 transition duration-300">
            <svg id="reloadIcon" class="w-6 h-6 animate transition-all duration-1000" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1 2.13-9.36" />
            </svg>
            <span class="text-sm">Reload</span>
        </button>
    </div>
    </section>`

    const readContainer = document.getElementById('quick-acsess-container')

    //Reset container content
    readContainer.innerHTML = "";

    // Obtain Content
    randSection.paragraphs.forEach(paragraph => {

        const comment = checkComment(paragraph);

        const span = `<span class="text-md text-sky-500"><i>${comment}</i></span>`

        // Create Read Paragraphs
        const pr = document.createElement('p');
        pr.className = "p-2 text-sm"
        pr.innerHTML = ""

        const text = cleanText(paragraph.text).replace(comment, span);;
        pr.innerHTML = text;

        readContainer.appendChild(pr);

        //hideSelectorModal();

        //const itemSec = document.getElementById('quick-acsess-items')
    })
}
function init1() {
    SetForeword(false);
    //Open sidepane
    document.getElementById("sidepane-toggle").click()
    //Choose First Conversation
    setTimeout(() => {
        paperContainer.children[0].click()
    }, 100)
    // init2 Set the quick read section-> allow reload/refresh
    init6()
}

function init6() {
    const list = ["foreword_source",
        "central_superuniverses_source",
        "local_universe_source",
        "history_urantia_source",
        "jesus_life_teachings_source"
    ]

    const randPart = getSource(list[Math.floor(Math.random() * list.length)])

    //set right panel
    setQuickRead(randPart)

    setTimeout(() => {
        handleReload()
    }, 100)
}

function handleReload() {
    const icon = document.getElementById("reloadIcon");
    icon.classList.add("animate-spin-200");

    // Simulate async task (replace with your real logic)
    setTimeout(() => {
        icon.classList.remove("animate-spin-200");
    }, 600); // stop spinning after 2s
}


function SetForeword(display = true) {
    PartTitle.textContent = "Foreword"
    paperContainer.innerHTML = "";
    const reader = new Reader(paperContainer, readerSection, window.api);
    reader.load(getSource('foreword_source'));
    display === true ? displaySelectorModal() : ''
}

function SetSuperUniverse() {
    PartTitle.textContent = "Central and Superuniverse";
    paperContainer.innerHTML = "";
    const reader = new Reader(paperContainer, readerSection, window.api);
    reader.load(getSource('central_superuniverses_source'));
    displaySelectorModal()
}

function SetLocalUniverse() {
    PartTitle.textContent = "Local Universe";
    paperContainer.innerHTML = "";
    const reader = new Reader(paperContainer, readerSection, window.api);
    reader.load(getSource('local_universe_source'));
    displaySelectorModal()
}

function SetHistoryOfUrantia() {
    PartTitle.textContent = "History of Urantia";
    paperContainer.innerHTML = "";
    const reader = new Reader(paperContainer, readerSection, window.api);
    reader.load(getSource('history_urantia_source'));
    displaySelectorModal()
}

function SetJesusTeachings() {
    PartTitle.textContent = "Life and Teachings of Jesus";
    paperContainer.innerHTML = "";
    const reader = new Reader(paperContainer, readerSection, window.api);
    reader.load(getSource('jesus_life_teachings_source'));
    displaySelectorModal()
}

async function loadItems(type = 'favourites') {
    const data = await window.api[`read${capitalize(type)}`]();
    const items = data?.[type === 'favourites' ? 'fav' : 'bookmark'];

    if (!Array.isArray(items) || items.length === 0) {
        paperContainer.innerHTML = `<h2 class='text-center font-semibold text-gray-900 dark:text-white underline'>No ${capitalize(type)} ❌🤷‍🤷</h2>`;
        displaySelectorModal();
        return;
    }

    PartTitle.textContent = capitalize(type);
    paperContainer.innerHTML = "";

    const contentFile = 'Combined_Structured_UB.json';
    const fullData = await window.api.readContent(contentFile);
    const partsById = Object.fromEntries(fullData.parts.map(part => [part.id, part]));

    const reader = new Reader(paperContainer, readerSection, window.api);

    for (const item of items) {
        const part = partsById[item.part_id];
        if (!part) continue;

        const paper = part.papers.find(p => p.paper_id === item.paper_id);
        if (!paper) continue;

        const section = paper.sections.find(s => s.section_number === item.section_number);
        if (!section) continue;

        const title = prepTitle(section);
        const sectionEntry = CreateItem(title);
        paperContainer.appendChild(sectionEntry);

        const struct = {
            part_id: part.id,
            paper_id: paper.paper_id,
            section_number: section.section_number,
        };

        reader.checkAndHighlight(sectionEntry, struct);
        reader.setupClickEvent(sectionEntry, section, paper, part);
    }

    displaySelectorModal();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function loadFavourites() {
    await loadItems('favourites');
}

async function loadBookmarks() {
    await loadItems('bookmarks');
}

//showNotesModal("✨ You can inject dynamic note content here using HTML.");


async function renderNotes() {
    const notesData = await window.api.readNotes();
    const items = notesData?.notes;


    if (!Array.isArray(items) || items.length === 0) {
        NotesmodalContent.innerHTML = `
            <h2 class='text-center font-semibold text-gray-900 dark:text-white underline'>
                No notes available yet
            </h2>`;
        showNotesModal();
        return;
    }

    NotesmodalContent.innerHTML = "";
    //PartTitle.textContent = "Notes";

    for (const note of items) {
        const noteCard = document.createElement("div");
        noteCard.className = `group relative p-5 mb-4 rounded-2xl shadow-xl border border-transparent transition-all bg-gradient-to-br from-white via-gray-100 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-indigo-900 hover:border-blue-400 dark:hover:border-indigo-400 hover:scale-[1.01] hover:shadow-2xl transform transition-all duration-150 ease-in-out mx-1`;

        noteCard.innerHTML = `
            <div class="mb-2 text-xs text-gray-600 dark:text-gray-400 italic transition-colors duration-500">
                ${new Date(note.timestamp).toLocaleString()}
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-indigo-300 transition-colors duration-500">
                ${note.comment}
            </h3>
            <p class="mt-2 text-sm text-gray-800 dark:text-gray-200 leading-relaxed transition-colors duration-500">
                ${note.content}
            </p>
        `;

        NotesmodalContent.appendChild(noteCard);
    }

    showNotesModal();
}


// Load Foreword Initially
init1();
