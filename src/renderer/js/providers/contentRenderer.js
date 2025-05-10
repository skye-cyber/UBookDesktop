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
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

async function reader(part) {

    const data = await window.api.readContent(part)

    const papers = data['parts'][0]['papers']
    for (const paper of papers) {
        for (const section of paper['sections']) {
            const title = prepTitle(section)
            const sectionEntry = CreateItem(title);
            paperContainer.appendChild(sectionEntry);

            //console.log(sectionEntry.lastChild)
            sectionEntry.addEventListener('click', (event) => {
                let target = event.target;

                //console.log(target)

                // Traverse up the DOM tree to check if the event target or any of its ancestors is the last child
                while (target !== sectionEntry) {
                    if (target === sectionEntry.lastChild || sectionEntry.lastChild.contains(target)) {
                        event.preventDefault();
                        console.log('fav');
                        return;
                    } else if (target === sectionEntry.children[0] || sectionEntry.children[0].contains(target)) {
                        event.preventDefault();
                        console.log('bookmark');
                        return;
                    }
                    target = target.parentNode;
                }

                setReader();
            });
            function setReader() {
                readerSection.innerHTML = ""
                const head = document.createElement('h1');
                head.className = "text-3xl font-bold mb-4 text-center underline decoration-lime-400";
                head.textContent = section.title
                readerSection.appendChild(head);
                section.paragraphs.forEach(paragraph => {

                    const comment = checkComment(paragraph);

                    const span = `<span class="text-md text-sky-500"><i>${comment}</i></span>`

                    const p = document.createElement('p');

                    const text = cleanText(paragraph.text).replace(comment, span);;
                    p.innerHTML = text;
                    readerSection.appendChild(p);
                    hideSelectorModal();
                    setTimeout(() => {
                        scrollToTop(readerWrapper)
                    }, 100)
                })
            }
        }
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
    reader(getSource('foreword_source'))
    display === true ? displaySelectorModal() : ''
}

function SetSuperUniverse() {
    PartTitle.textContent = "Central and Superuniverse";
    paperContainer.innerHTML = "";
    reader(getSource('central_superuniverses_source'));
    displaySelectorModal()
}

function SetLocalUniverse() {
    PartTitle.textContent = "Local Universe";
    paperContainer.innerHTML = "";
    reader(getSource('local_universe_source'))
    displaySelectorModal()
}

function SetHistoryOfUrantia() {
    PartTitle.textContent = "History of Urantia";
    paperContainer.innerHTML = "";
    reader(getSource('history_urantia_source'))
    displaySelectorModal()
}

function SetJesusTeachings() {
    PartTitle.textContent = "Life and Teachings of Jesus";
    paperContainer.innerHTML = "";
    reader(getSource('jesus_life_teachings_source'))
    displaySelectorModal()
}

// Load Foreword Initially
init1();
