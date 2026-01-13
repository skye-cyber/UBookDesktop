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

}

export const menuaction = new MenuAction()
