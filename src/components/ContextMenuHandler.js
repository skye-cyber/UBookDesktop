// Global state
const contextMenu = document.getElementById('contextMenu');
const textOptions = document.getElementById('textOptions');
const bookContent = document.getElementById('reader-content');

const appState = {
    currentSelection: '',
    selectionRange: null,
    bookmarks: [],
    notes: [],
    highlights: [],
    currentFontSize: parseInt(getComputedStyle(bookContent).fontSize),
    currentTheme: 'sepia',
    innitialFontSize: parseInt(getComputedStyle(bookContent).fontSize)
};

// Initialize word count
updateWordCount();

// Show context menu on right click
document.addEventListener('contextmenu', function(e) {
    if (bookContent.contains(e.target)) {
        e.preventDefault();

        // Check if text is selected
        const selection = window.getSelection();
        const hasSelection = selection.toString().trim().length > 0;

        // Store selection info
        if (hasSelection && selection.rangeCount > 0) {
            appState.currentSelection = selection.toString();
            appState.selectionRange = selection.getRangeAt(0);
            textOptions.classList.remove('hidden');
        } else {
            appState.currentSelection = '';
            appState.selectionRange = null;
            textOptions.classList.add('hidden');
        }

        // Position the context menu
        positionContextMenu(e.pageX, e.pageY, contextMenu);
    }
});

// Hide context menu on click
document.addEventListener('click', function(e) {
    if (!contextMenu.contains(e.target)) {
        contextMenu.classList.remove('active');
    }
});

// Handle context menu actions
document.querySelectorAll('.context-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.stopPropagation();
        const action = this.getAttribute('data-action');
        handleContextMenuAction(action, this);
    });
});

function showSubmenu(item) {
    const submenu = item.querySelector(".sub-context-menu")
    submenu.classList.remove("hidden")
}

document.querySelectorAll('.sub-context-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation();
        const submenu = item.parentElement
        //console.log("Before", submenu.classList.contains("hidden"))

        const action = item.getAttribute('data-action')

        handleContextMenuAction(action, item)
        submenu.classList.add("hidden")
        //console.log("After", submenu.classList.contains("hidden"), submenu.classList)
        contextMenu.classList.remove('active');
    })
})
// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'a':
                e.preventDefault();
                handleContextMenuAction('selectAll');
                break;
            case 'c':
                e.preventDefault();
                handleContextMenuAction('copy');
                break;
            case 'f':
                e.preventDefault();
                handleContextMenuAction('search');
                break;
            case 'b':
                e.preventDefault();
                handleContextMenuAction('bookmark');
                break;

        }
    }

    if (e.key === 'Escape') {
        contextMenu.classList.remove('active');
        closeModals();
    }
});


function positionContextMenu(x, y, menu) {
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('active');

    // Adjust if menu goes out of viewport
    setTimeout(() => {
        const rect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth + 100;
        const viewportHeight = window.innerHeight + 100;

        if (rect.right > viewportWidth) {
            menu.style.left = (x - rect.width) + 'px';
        }

        if (rect.bottom > viewportHeight) {
            menu.style.top = (y - rect.height) + 'px';
        }
        if (rect.top > viewportHeight) {
            menu.style.bottom = (y + rect.height) + 'px';
        }
    }, 10);
}

function handleContextMenuAction(action, item = null) {
    let message = '';
    switch (action) {
        case 'copy':
            handleCopy();
            message = 'Text copied to clipboard';
            contextMenu.classList.remove('active');
            break;

        case 'selectAll':
            handleSelectAll();
            message = 'All text selected';
            contextMenu.classList.remove('active');
            break;

        case 'search':
            handleSearch();
            message = `Searching for "${appState.currentSelection}"`;
            contextMenu.classList.remove('active');
            break;

        case 'highlightYellow':
            applyHighlight('yellow');
            message = 'Text highlighted in yellow';
            contextMenu.classList.remove('active');
            break;

        case 'highlightGreen':
            applyHighlight('green');
            message = 'Text highlighted in green';
            contextMenu.classList.remove('active');
            break;

        case 'highlightBlue':
            applyHighlight('blue');
            message = 'Text highlighted in blue';
            contextMenu.classList.remove('active');
            break;

        case 'highlightPink':
            applyHighlight('pink');
            message = 'Text highlighted in pink';
            contextMenu.classList.remove('active');
            break;

        case 'removeHighlight':
            removeHighlight();
            message = 'Highlight removed';
            contextMenu.classList.remove('active');
            break;

        case 'bookmark':
            addBookmark();
            message = 'Bookmark added';
            contextMenu.classList.remove('active');
            break;

        case 'notes':
            openNoteModal();
            break;

        case 'dictionary':
            handleDictionaryLookup();
            message = `Looking up "${appState.currentSelection}" in dictionary`;
            contextMenu.classList.remove('active');
            break;

        case 'print':
            try {
                _modalHandler.show('load', 'Preparint printing service')
                message = 'Print dialog opened';
                contextMenu.classList.remove('active');
                setTimeout(async () => {
                    _modalHandler.hide('load')
                    window.print()
                }, 1000)
            } catch (e) {
                _modalHandler.show('erro', e.message)
                setTimeout(() => {
                    _modalHandler.hide('error')
                }, 4000)
                break
            }
            break;

        case 'theme':
            showSubmenu(item)
            break;

        case 'fontSize':
            showSubmenu(item)
            break;

        case 'highlight':
            showSubmenu(item)
            break;

        case 'viewBookmarks':
            //openBookmarksModal();
            contextMenu.classList.remove('active');
            break;

        case 'fontSmall':
            changeFontSize(-2);
            message = 'Font size set to Small';
            break;

        case 'fontMedium':
            resetFontSize();
            message = 'Font size set to Medium';
            break;

        case 'fontLarge':
            changeFontSize(2);
            message = 'Font size set to Large';
            break;

        case 'fontXLarge':
            changeFontSize(4);
            message = 'Font size set to Extra Large';
            break;

        case 'themeLight':
            changeTheme('light');
            message = 'Light theme applied';
            break;

        case 'themeSepia':
            changeTheme('sepia');
            message = 'Sepia theme applied';
            break;

        case 'themeDark':
            changeTheme('dark');
            message = 'Dark theme applied';
            break;

        case 'themeNight':
            changeTheme('night');
            message = 'Night mode applied';
            break;

        default:
            //handleSubmenu(item)
            message = `Action: ${action}`;
    }

    if (message) showToast(message);
}


// Implemented Functions
function handleCopy() {
    if (appState.currentSelection) {
        navigator.clipboard.writeText(appState.currentSelection);
    }
}

function handleCut() {
    if (appState.currentSelection && appState.selectionRange) {
        navigator.clipboard.writeText(appState.currentSelection);
        appState.selectionRange.deleteContents();
        updateWordCount();
    }
}

function handlePaste() {
    // For demonstration, we'll simulate paste by inserting at selection
    if (appState.selectionRange) {
        navigator.clipboard.readText().then(text => {
            appState.selectionRange.deleteContents();
            appState.selectionRange.insertNode(document.createTextNode(text));
            updateWordCount();
        });
    }
}

function handleSelectAll() {
    const range = document.createRange();
    range.selectNodeContents(bookContent);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    appState.currentSelection = selection.toString();
    appState.selectionRange = range;
}

function handleSearch() {
    if (appState.currentSelection) {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(appState.currentSelection)}`;
        window.open(searchUrl, '_blank');
    }
}

function applyHighlight(color) {
    if (appState.selectionRange) {
        const span = document.createElement('span');
        span.className = `highlight-${color}`;
        span.textContent = appState.currentSelection;

        appState.selectionRange.deleteContents();
        appState.selectionRange.insertNode(span);

        // Store highlight info
        appState.highlights.push({
            text: appState.currentSelection,
            color: color,
            timestamp: new Date()
        });
    }
}

function removeHighlight() {
    if (appState.selectionRange) {
        const selectedNode = appState.selectionRange.startContainer.parentNode;
        if (selectedNode.classList && selectedNode.classList.value.includes('highlight-')) {
            const text = selectedNode.textContent;
            selectedNode.replaceWith(text);
        }
    }
}

function addBookmark() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const bookmark = {
            text: appState.currentSelection || 'Bookmark',
            position: range.startOffset,
            paragraph: range.startContainer.parentNode.getAttribute('data-paragraph') || '1',
            timestamp: new Date(),
            id: Date.now()
        };

        appState.bookmarks.push(bookmark);
        updateBookmarkCount();
        showToast(`Bookmark added to paragraph ${bookmark.paragraph}`);

        // Visual indicator (in a real app, this would be more sophisticated)
        const indicator = document.createElement('div');
        indicator.className = 'bookmark-indicator';
        indicator.setAttribute('data-bookmark-id', bookmark.id);
        range.startContainer.parentNode.style.position = 'relative';
        range.startContainer.parentNode.appendChild(indicator);
    }
}

function openNoteModal() {
    document.getElementById('noteModal').classList.remove('hidden');
    document.getElementById('noteText').value = appState.currentSelection;
    document.getElementById('noteText').focus();
}

function closeNoteModal() {
    document.getElementById('noteModal').classList.add('hidden');
}

function saveNote() {
    const noteText = document.getElementById('noteText').value;
    if (noteText.trim()) {
        appState.notes.push({
            text: noteText,
            selection: appState.currentSelection,
            timestamp: new Date()
        });
        closeNoteModal();
        showToast('Note saved successfully');

        // Add visual indicator for note
        if (appState.selectionRange) {
            const indicator = document.createElement('div');
            indicator.className = 'note-indicator';
            appState.selectionRange.startContainer.parentNode.style.position = 'relative';
            appState.selectionRange.startContainer.parentNode.appendChild(indicator);
        }
    }
}

function handleDictionaryLookup() {
    if (appState.currentSelection) {
        // Clean the selection for dictionary lookup (get first word)
        const word = appState.currentSelection.trim().split(/\s+/)[0];
        const dictUrl = `https://www.merriam-webster.com/dictionary/${encodeURIComponent(word)}`;
        window.open(dictUrl, '_blank');
    }
}

function openBookmarksModal() {
    const modal = document.getElementById('bookmarksModal');
    const list = document.getElementById('bookmarksList');

    list.innerHTML = '';

    if (appState.bookmarks.length === 0) {
        list.innerHTML = '<p class="text-gray-500 text-center py-4">No bookmarks yet</p>';
    } else {
        appState.bookmarks.forEach(bookmark => {
            const bookmarkEl = document.createElement('div');
            bookmarkEl.className = 'border-b border-gray-200 py-3';
            bookmarkEl.innerHTML = `
                    <div class="flex justify-between items-start">
                    <div>
                    <p class="font-medium">${bookmark.text.substring(0, 100)}${bookmark.text.length > 100 ? '...' : ''}</p>
                    <p class="text-sm text-gray-500">Paragraph ${bookmark.paragraph} • ${new Date(bookmark.timestamp).toLocaleDateString()}</p>
                    </div>
                    <button class="text-red-500 hover:text-red-700" onclick="removeBookmark(${bookmark.id})">
                    <i class="fas fa-trash"></i>
                    </button>
                    </div>
                    `;
            list.appendChild(bookmarkEl);
        });
    }

    modal.classList.remove('hidden');
}

function closeBookmarksModal() {
    document.getElementById('bookmarksModal').classList.add('hidden');
}

function removeBookmark(id) {
    appState.bookmarks = appState.bookmarks.filter(b => b.id !== id);
    updateBookmarkCount();
    openBookmarksModal(); // Refresh the modal
}

function changeFontSize(delta) {
    appState.currentFontSize = parseInt(getComputedStyle(bookContent).fontSize);
    appState.currentFontSize += delta;
    bookContent.style.fontSize = appState.currentFontSize + 'px';
    updateWordCount();
}

function resetFontSize() {
    bookContent.style.fontSize = appState.innitialFontSize + 'px';
    appState.currentFontSize = appState.innitialFontSize;
    updateWordCount();
}

function changeTheme(theme) {
    const themeSelector = document.getElementById('themeSelector');

    // Remove all theme classes
    bookContent.className = bookContent.className.replace(/\b(bg-\w+|text-\w+)\b/g, '');

    // Add base classes
    bookContent.classList.add('book-content', 'p-6', 'rounded-lg', 'border');

    console.log(theme)
    // Add theme-specific classes
    switch (theme) {
        case 'light':
            bookContent.classList.add('bg-white', 'text-gray-800', 'border-gray-300');
            break;
        case 'sepia':
            bookContent.classList.add('book-content', 'border-amber-200');
            break;
        case 'dark':
            bookContent.classList.add('bg-gray-800', 'text-gray-200', 'border-gray-700');
            break;
        case 'night':
            bookContent.classList.add('bg-gray-900', 'text-gray-300', 'border-gray-800');
            break;
    }

    appState.currentTheme = theme;
    themeSelector.value = theme;
}

function updateWordCount() {
    const text = bookContent.innerText || bookContent.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    document.getElementById('wordCount').textContent = `Words: ${wordCount}`;
}

function updateBookmarkCount() {
    document.getElementById('bookmarkCount').textContent = `Bookmarks: ${appState.bookmarks.length}`;
}

function closeModals() {
    closeNoteModal();
    closeBookmarksModal();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-10');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-10');
    }, 3000);
}
