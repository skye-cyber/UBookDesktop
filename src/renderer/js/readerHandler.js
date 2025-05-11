
const tooltip = document.getElementById('tooltip-menu');
const wrapper = document.getElementById('reader-content');
let selectedText = "";
let selectedContent = "";

wrapper.addEventListener('mouseup', () => {
    toolTipPositionHandler();
});

function toolTipPositionHandler() {
    const selection = window.getSelection();
    selectedText = selection.toString().trim();
    //console.log(selection.toString())
    selectedContent = getSelectionHtml();
    //console.log(selectedContent)

    if (selectedText.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden'; // so we can measure it

        requestAnimationFrame(() => {
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;

            // Position relative to wrapper
            const top = rect.top - wrapperRect.top - tooltipHeight + 30;
            let left = rect.left - wrapperRect.left + rect.width / 2 - tooltipWidth / 2;

            // Constrain within wrapper bounds
            left = Math.max(8, Math.min(left, wrapper.offsetWidth - tooltipWidth - 8));

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
            tooltip.style.visibility = 'visible';
            tooltip.classList.remove('hidden', '-translate-x-[200%]');
            tooltip.classList.add('opacity-100');
        });
    } else {
        tooltip.classList.add('hidden');
        tooltip.classList.remove('opacity-100');
    }
}

function getSelectionHtml(_selection) {
    const selection = _selection ? _selection : window.getSelection();
    if (!selection.rangeCount) return '';
    const container = document.createElement('div');
    for (let i = 0; i < selection.rangeCount; i++) {
        container.appendChild(selection.getRangeAt(i).cloneContents());
    }
    return container.innerHTML;
}

// Hide when clicking outside the tooltip or selecting nothing
wrapper.addEventListener('mousedown', (e) => {
    if (!tooltip.contains(e.target)) {
        hideTooltip();
    }
});

// Hide when selection changes and is cleared
wrapper.addEventListener('selectionchange', () => {
    const text = window.getSelection().toString().trim();
    if (!text) hideTooltip();
});

// Optional: Hide on Esc
wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideTooltip();
});


function hideTooltip() {
    if (!Rpane) {
        tooltip.classList.add('hidden', '-translate-x-[200%]');
        tooltip.classList.remove('opacity-100');
    } else {
        document.getElementById('rightpanel-tooltip-menu').classList.add('hidden', '-translate-x-[200%]');
        document.getElementById('rightpanel-tooltip-menu').classList.remove('opacity-100');
    }
}

function handleCopy() {
    navigator.clipboard.writeText(selectedText);
    tooltip.classList.add('hidden');
    showActionToast('copy');
}

function handleWebSearch() {
    const query = window.getSelection().toString().trim();
    if (query.length > 0) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, '_blank');
    }
    hideTooltip();
}

function handleSaveNote() {
    showNoteModal();
}

function saveNote() {
    // show comment modal
    //
    const note = {
        comment: document.getElementById('note-comment').value,
        timestamp: new Date().toISOString(),
        text: selectedText,
        content: selectedContent
    };

    window.api.saveNote(note);

    console.log("Note saved:", note); // You can persist to localStorage or send to a backend later
    showActionToast('save');
    closeNoteModal();
}


let selectedHighlightClass = 'bg-yellow-200 dark:bg-[#f4f400] text-black dark:text-black';

function handleHighlight() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const selectionHTML = getSelectionHtml(selection);
    //console.log(selectionHTML)
    const span = document.createElement('span');
    span.className = selectedHighlightClass + ' px-0.5 rounded-sm transition-color duration-500';
    span.innerHTML = selectionHTML;

    range.deleteContents();
    range.insertNode(span);
    showActionToast('highlight');
    hideTooltip();
}

function showColorPicker() {
    const picker = document.getElementById('color-picker');
    picker.classList.toggle('hidden');
}

function setHighlightColor(color) {
    const circle = document.getElementById('current-color-circle');

    switch (color) {
        case 'yellow':
            selectedHighlightClass = 'bg-yellow-200 dark:bg-yellow-100 text-black dark:text-black';
            circle.className = 'size-6 rounded-full bg-yellow-300 dark:bg-yellow-500 mr-2';
            break;
        case 'blue':
            selectedHighlightClass = 'bg-blue-200 dark:bg-blue-500 text-black dark:text-white';
            circle.className = 'size-6 rounded-full bg-blue-300 dark:bg-blue-500 mr-2';
            break;
        case 'pink':
            selectedHighlightClass = 'bg-pink-200 dark:bg-pink-500 text-black dark:text-black';
            circle.className = 'size-6 rounded-full bg-pink-300 dark:bg-pink-500 mr-2';
            break;
        case 'green':
            selectedHighlightClass = 'bg-green-300 dark:bg-green-500 text-black dark:text-black';
            circle.className = 'size-6 rounded-full bg-green-500 dark:bg-green-500 mr-2';
            break;
    }

    document.getElementById('color-picker').classList.add('hidden');
}

function showActionToast(action=null, _message=null, _icon=null) {
    const toast = document.getElementById('action-toast');
    const icon = document.getElementById('toast-icon');
    const message = document.getElementById('toast-message');

    // Define icons and messages
    const actionMap = {
        copy: {
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" class="stroke-green-500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>`,
            text: "Copied!",
        },
        save: {
            icon: `<svg class="fill-green-400" viewBox="0 0 24 24" class="w-5 h-5"><path d="M17 3H5a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>`,
            text: "Saved!",
        },
        highlight: {
            icon: `<svg class="fill-green-400" viewBox="0 0 24 24" class="w-5 h-5"><path d="M15.5 4l4.5 4.5L9 19.5H4.5V15L15.5 4zM20 5.5l-1.5-1.5a1.5 1.5 0 00-2.12 0l-.88.88 3.5 3.5.88-.88a1.5 1.5 0 000-2.12z"/></svg>`,
            text: "Highlighted!",
        },
        export: {
            icon: `💾`,
            text: 'Exported!'
        },
        read: {
            icon: `🔊`,
            text: 'Read Aloud!'
        },
        favourite: {
            icon: `🩷`,
            text: 'Favourited!'
        },
        bookmark: {
            icon: `🔖`,
            text: 'Bookmarked!'
        }
    };

    if (!actionMap[action]) return;

    // Inject icon and message
    icon.innerHTML = _icon || actionMap[action].icon;
    message.textContent = _message || actionMap[action].text;

    // Animate: slide in
    toast.classList.remove('translate-x-full', 'opacity-0');
    toast.classList.add('right-1/2', 'translate-x-1/2', 'opacity-100');

    // Wait then slide out
    setTimeout(() => {
        toast.classList.remove('translate-x-1/2', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
    }, 3000);
}

async function handleReadAloud() {
    try {
        const read_Ok = await window.api.ReadAloud(selectedText)
        read_Ok ? showActionToast('read') : '';
    } catch (err) {
        console.log(err)
    }
}

function handleExport() {
    const text = window.getSelection().toString().trim();
    if (!text) return;

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = 'highlighted-text.txt';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    showActionToast('export');
}

// Reading progress logic
const readerContainer = document.getElementById('reader-wrapper-container');
const progressBar = document.getElementById('reading-progress-bar');

readerContainer.addEventListener('scroll', () => {
    const scrollTop = readerContainer.scrollTop;
    const scrollHeight = readerContainer.scrollHeight - readerContainer.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${progress}%`;
    document.getElementById('read-percentage').textContent = `${progress.toFixed(1)}%`;
});

/*
let scrollTimeout;
wrapper.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        //toolTipPositionHandler();
    }, 16); // ~60fps
});
*/
