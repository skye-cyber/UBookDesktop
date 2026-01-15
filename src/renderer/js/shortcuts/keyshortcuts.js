import { StateManager } from "../syscore/StatesManager";
import { menuaction } from "../../../ui/components/Tooltips/Helpers/action";
import { BookNavigator } from "../../../ui/components/Reader/navigator";
import { FontSizeManager_ins } from "../../../ui/components/Reader/font_manager";



function inputFieldsActive(e) {
    const inputFields = []
    const index = inputFields.map(f => (f.contains(e.target))).findIndex(v => (v === true))
    return index !== -1

}

export function ImplementShortcutKeys() {
    try {
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
            }
            if (event.ctrlKey && event.key === 'A' || event.ctrlKey && event.key === 'a') {
                const isFocused = document.activeElement === StateManager.get('searchInput');

                if (StateManager.get('NoteComposer_open') || isFocused) return

                event.preventDefault(); // Prevent the default Save action in browsers

                menuaction.selectAll()
            }
            if (event.ctrlKey && event.key === 'S' || event.ctrlKey && event.key === 's') {
                event.preventDefault(); // Prevent the default Save action in browsers
                document.getElementById("search-toggle").click()

            } else if ((event.ctrlKey && event.key === 'P' || event.ctrlKey && event.key === 'p') && !event.shiftKey) {
                event.preventDefault(); // Prevent any default action
                StateManager.get('BookPanelToggle')()

            } else if (event.key.toLocaleLowerCase() === 'p' && event.shiftKey) {
                event.preventDefault(); // Prevent any default action
                print()
            } else if (event.key.toLocaleLowerCase() === ' ') {
                const isFocused = document.activeElement === StateManager.get('searchInput');
                if (!isFocused) {
                    event.preventDefault();
                    StateManager.get('onPlayPause')()
                }
                // Next chapter
            } else if (['arrowright', 'pageup'].includes(event.key.toLocaleLowerCase())) {
                event.preventDefault();
                BookNavigator.nextSection()
                // Previous chapter
            } else if (['arrowleft', 'pagedown'].includes(event.key.toLocaleLowerCase())) {
                event.preventDefault();
                BookNavigator.previousSection()
                //Increase font
            } else if (event.ctrlKey && event.key.toLocaleLowerCase() === '=') {
                event.preventDefault();
                FontSizeManager_ins.changeFontSize(1)
                // Decrease Font
            } else if (event.ctrlKey && event.key.toLocaleLowerCase() === '-') {
                event.preventDefault();
                FontSizeManager_ins.changeFontSize(-1)
                // Reset font
            } else if (event.ctrlKey && event.key.toLocaleLowerCase() === '0') {
                event.preventDefault();
                FontSizeManager_ins.resetFontSize()
            }
        });
    } catch (err) {
        //
    }
}

function focus() {
    const focused = StateManager.get('focusMode')
    document.dispatchEvent(new CustomEvent('focusMode'))
    StateManager.get('readerTopPanelToggle')()
    StateManager.set('focusMode', !focused)
}

ImplementShortcutKeys()
