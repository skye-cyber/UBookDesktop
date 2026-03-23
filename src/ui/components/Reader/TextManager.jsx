import { FontSizeManager_ins } from "./font_manager"
import { waitForElement } from "../../../common/syscore/dom_utils"

export class TextManager{
    constructor(){
        this.readable = FontSizeManager_ins.readable
    }
    init() {
        waitForElement('#reader-content', (el) => {
            this.readable = el
            console.log(el)
        })
    }
    changeLineHeight(value){
        this.readable.style.lineHeight = value
    }
}

export const textmanager = new TextManager()
