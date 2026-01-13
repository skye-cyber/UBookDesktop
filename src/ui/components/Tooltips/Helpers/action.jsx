import { appState } from "../../Reader/appState";

class MenuAction{
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
            console.log(searchUrl)
        }
    }
    dictionaryLookup(){
        //
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
        showActionToast('export');
    }

}

export const menuaction = new MenuAction()
