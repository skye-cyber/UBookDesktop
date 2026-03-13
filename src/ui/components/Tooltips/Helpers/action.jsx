import { appState } from "../../Reader/appState";
import { StateManager } from "../../../../common/syscore/StatesManager";
import { modalmanager } from "../../../../common/Status/Manager";

class MenuAction{
    copy(text = null) {
        navigator.clipboard.writeText(text || appState.selectedText);
        document.dispatchEvent(new CustomEvent('show-copy-feedback'))
    }
    selectAll() {
        // select all only if not input field is active
        //if (!inputFieldsActive()) {
        const range = document.createRange();
        range.selectNodeContents(StateManager.get('readerSection'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    search() {
        if (appState.selectedText) {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(appState.selectedText)}`;
            window.open(searchUrl, '_blank');
        }
    }
    dictionaryLookup(){
        //
    }
    print(){
        print()
    }
    handleExport() {
        const text = window.getSelection().toString().trim();
        if (!text) return;

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = 'highlighted-text.txt';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        modalmanager.showMessage('Export succeeded', 'info')
    }

}

export const menuaction = new MenuAction()
