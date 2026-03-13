import { appState } from '../../../State/appState';
import { hightlightsearch } from "../../Reader/Search/hightlightSearch";

class SelectionHelper {
    updateAppstate() {
        const selection = window.getSelection();
        const selectionHTML = this.selectionTohtml(selection)

        if (selection.type !== "Range" || selection.rangeCount === 0) {
            document.dispatchEvent(new CustomEvent('hide-onselect-tooltip-menu'))
            // appState.selectedText = null;
            // appState.currentSelection = null
            // appState.selectionRange = null;
            return false
        }
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        try {
            const previousText = appState.selectedText

            appState.currentSelection = selection
            appState.selectedText = selectedText;
            appState.selectionRange = range;
            appState.selectedHTML = selectionHTML
            document.dispatchEvent(new CustomEvent('update-note-content'))

            // only if selected tect has really changed
            if (selectedText !== previousText) hightlightsearch.searchPage()

        } catch (err) {
            return false
        }

        return true
    }
    selectionTohtml(selection) {
        if (!selection.rangeCount) return '';
        const container = document.createElement('div');
        for (let i = 0; i < selection.rangeCount; i++) {
            container.appendChild(selection.getRangeAt(i).cloneContents());
        }
        return container.innerHTML;
    }
    normalizeSelection() {
        return this.replaceParagraphMarkers(this.uppercase2CamelCase(text))
    }
    replaceParagraphMarkers(text) {
        return text.replace(/\b\d+:\d+\.(\d+)\s*⇒/g, (_, z) => `Paragraph ${parseInt(z)}, `);
    }
    uppercase2CamelCase(text) {
        return text.replace(/\b([A-Z\s]{2,})\b/g, (match) => {
            const words = match.trim().split(/\s+/).map(w => w.toLowerCase());
            return words.map((word, index) =>
                index === 0 ? word : `${word.charAt(0).toUpperCase() + word.slice(1)} `
            ).join('');
        });
    }
}

export const selectionhelper = new SelectionHelper()
