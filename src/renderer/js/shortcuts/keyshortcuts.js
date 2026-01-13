import { StateManager } from "../syscore/StatesManager";
import { menuaction } from "../../../ui/components/Tooltips/Helpers/action";

const inputFields = [document.getElementById("searchInput"), document.getElementById("note-comment"), document.getElementById("noteText")]

function inputFieldsActive(e) {
    const index = inputFields.map(f => (f.contains(e.target))).findIndex(v => (v === true))
    return index !== -1

}
// shortcut implementations
document.addEventListener('keydown', (event) => {
    //console.log(document.getElementById("searchInput").focused)

    // 1) if it’s F11, do nothing here and let the browser/Electron handle it
    if (event.key === "F11" || event.code === "F11") {
        focus()
    }
    else if (event.key === 'Escape') {
        event.preventDefault();
        //document.dispatchEvent(new CustomEvent('toggle-left-panel'))
        document.dispatchEvent(new CustomEvent('escape-key-down'))
        /*
         * closeSearchPref();
        engine.removeHighlightedSpans();
        document.dispatchEvent(new CustomEvent('hide-onselect-tooltip-menu'))

        // Context menu handler
        contextMenu.classList.remove('active');
        closeModals();
        handleDelectAll()

        hideNotesModal()
        */
    }
    if (event.ctrlKey && event.key === 'A' || event.ctrlKey && event.key === 'a') {
        event.preventDefault(); // Prevent the default Save action in browsers
        menuaction.selectAll()
    }
    if (event.ctrlKey && event.key === 'S' || event.ctrlKey && event.key === 's') {
        event.preventDefault(); // Prevent the default Save action in browsers
        document.getElementById("search-toggle").click()

    } else if ((event.ctrlKey && event.key === 'P' || event.ctrlKey && event.key === 'p') && !event.shiftKey) {
        event.preventDefault(); // Prevent any default action
        document.getElementById("book-content-panel").click()

    } else if (event.ctrlKey && event.key === 'N' || event.ctrlKey && event.key === 'n') {
        //NewConversation(event);

    } else if (event.ctrlKey && event.key === 'f' || event.ctrlKey && event.key === 'F') {
        event.preventDefault(); // Prevent any default action
        //attachFiles.click();

    } else if (event.key.toLocaleLowerCase() === 'p' && event.shiftKey) {
        event.preventDefault(); // Prevent any default action
        handleContextMenuAction('print');
    } else if (event.key.toLocaleLowerCase() === ' ') {
        if (!inputFieldsActive(event)) {
            event.preventDefault();
            btnPlayPause.click()
        }
        // fast forward
    } else if (event.key.toLocaleLowerCase() === 'arrowright') {
        if (!inputFieldsActive(event)) {
            event.preventDefault();
            document.getElementById('btn-forward').click()
        }
        //seek backward
    } else if (event.key.toLocaleLowerCase() === 'arrowleft') {
        if (!inputFieldsActive(event)) {
            event.preventDefault();
            document.getElementById('btn-backward').click()
        }
        // Next chapter
    } else if (event.key.toLocaleLowerCase() === 'pageup') {
        event.preventDefault();
        nextSection()
        // Previous chapter
    } else if (event.key.toLocaleLowerCase() === 'pagedown') {
        event.preventDefault();
        previousSection()
        //Increase font
    } else if (event.ctrlKey && event.key.toLocaleLowerCase() === '=') {
        event.preventDefault();
        changeFontSize(1)
        // Decrease Font
    } else if (event.ctrlKey && event.key.toLocaleLowerCase() === '-') {
        event.preventDefault();
        changeFontSize(-1)
        // Reset font
    } else if (event.ctrlKey && event.key.toLocaleLowerCase() === '0') {
        event.preventDefault();
        changeFontSize(-1)
    } else if (event.ctrlKey && event.key.toLocaleLowerCase() === 'tab') {
        event.preventDefault();
        focus()
    }
});

function focus() {
    const focused = StateManager.get('focusMode')
    document.dispatchEvent(new CustomEvent('focusMode'))
    StateManager.get('readerTopPanelToggle')()
    StateManager.set('focusMode', !focused)
}
