import { waitForElement } from "../../../renderer/js/syscore/dom_utils"
import { StateManager } from "../../../renderer/js/syscore/StatesManager"
import { appState } from "./appState"

export class FontSizeManager {
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
    }
    resetFontSize() {
        this.readable.style.fontSize = this.innitialFontSize + 'px';
        this.currentFontSize = this.innitialFontSize;
        appState.currentFontSize = this.currentFontSize
    }
}

export function ChangeFontName(fontname) {
    if (!fontname) return

    const readable = StateManager.get('readerSection')

    const textuals = readable.querySelectorAll('#textual')

    if (!textuals) return false

    textuals.forEach((textual) => {
        textual.classList.remove(`font-${appState.currentFontName}`)
        textual.classList.add(`font-${fontname}`)
    })

    appState.currentFontName = fontname

    return true
}


export const FontSizeManager_ins = new FontSizeManager()
