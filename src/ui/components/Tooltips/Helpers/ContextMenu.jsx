import { appState } from "../../Reader/appState";

export class ContextMenuHelper {
    constructor() {
        this.menuactionmap = {
            copy: this.copy,
            selectAll: this.selectAll,
            search: this.search,
            hightlight: '',
            removeHightlight: '',
            showBookmarks: '',
            add_bookmark: '',
            show_notes: '',
            dictionary_lookup: '',
            print_content: '',
            theme_select: '',
            font_select: '',
        }
        setTimeout(() => {
            this.readerContent = window.StateManager.get('readerSection')
        }, 100)
    }
    copy(text = null) {
        navigator.clipboard.writeText(text || appState.selectedText);
        //tooltip.classList.add('hidden');
        //showActionToast('copy');
    }
    selectAll() {
        // select all only if not input field is active
        //if (!inputFieldsActive()) {
        const range = document.createRange();
        range.selectNodeContents(this.readerContent);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        appState.currentSelection = selection.toString();
        appState.selectionRange = range;
        //}
    }

    search() {
        if (appState.currentSelection) {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(appState.currentSelection)}`;
            window.open(searchUrl, '_blank');
        }
    }
    positionContextMenu(x, y, menu) {
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

    handleContextMenuAction(action, item = null) {
        let message = '';
        switch (action) {
            case 'copy':
                handleContextCopy();
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
                handleHighlight('yellow');
                message = 'Text highlighted in yellow';
                contextMenu.classList.remove('active');
                break;

            case 'highlightGreen':
                handleHighlight('green');
                message = 'Text highlighted in green';
                contextMenu.classList.remove('active');
                break;

            case 'highlightBlue':
                handleHighlight('blue');
                message = 'Text highlighted in blue';
                contextMenu.classList.remove('active');
                break;

            case 'highlightPink':
                handleHighlight('pink');
                message = 'Text highlighted in pink';
                contextMenu.classList.remove('active');
                break;

            case 'removeHighlight':
                handleHighlight(null, 'dehighlight');
                message = 'Highlight removed';
                contextMenu.classList.remove('active');
                break;

            case 'bookmark':
                addBookmark();
                message = 'Bookmark added';
                contextMenu.classList.remove('active');
                break;

            case 'notes':
                //openNoteModal();
                handleSaveNote()
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
}

export const contextmenu = new ContextMenuHelper()
