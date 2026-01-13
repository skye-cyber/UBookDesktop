import { waitForElement } from "../../../renderer/js/syscore/dom_utils"
import { appState } from "./appState"

export class FontManager {
    constructor() {
        this.readable
        this.currentFontSize
        this.innitialFontSize

        this.init()
    }
    init() {
        waitForElement('#reader-content', (el) => {
            this.readable = el
            this.currentFontSize = parseInt(getComputedStyle(this.readable).fontSize)
            this.innitialFontSize = parseInt(getComputedStyle(this.readable).fontSize)
            appState.currentFontSize = this.currentFontSize
            appState.innitialFontSize = this.innitialFontSize
        })
    }
    changeFontSize(delta = 1, size = null) {
        this.currentFontSize = parseInt(getComputedStyle(this.readable).fontSize);
        appState.currentFontSize = this.currentFontSize

        size && typeof size === 'number' ? this.currentFontSize = size : this.currentFontSize += delta;
        this.readable.style.fontSize = this.currentFontSize + 'px';
        this.updateWordCount();
    }
    resetFontSize() {
        this.readable.style.fontSize = this.innitialFontSize + 'px';
        this.currentFontSize = this.innitialFontSize;
        appState.currentFontSize = this.currentFontSize

        this.updateWordCount();
    }

    updateWordCount() {
        const text = this.readable.innerText || this.readable.textContent;
        const wordCount = text.trim().split(/\s+/).length;
        document.getElementById('wordCount').textContent = `Words: ${wordCount}`;
    }
}

export const FontManager_ins = new FontManager()
