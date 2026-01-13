import { appState } from "../../Reader/appState";

class SelectionHelper {
    updateAppstate() {
        const selection = window.getSelection();
        const selectionHTML = this.selectionTohtml(selection)

        if (selection.type !== "Range") {
            document.dispatchEvent(new CustomEvent('hide-onselect-tooltip-menu'))
            // appState.selectedText = null;
            // appState.currentSelection = null
            // appState.selectionRange = null;
            return false
        }

        try {
            appState.currentSelection = selection
            appState.selectedText = selection.toString();
            appState.selectionRange = selection.getRangeAt(0);
            appState.selectedHTML = selectionHTML
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
