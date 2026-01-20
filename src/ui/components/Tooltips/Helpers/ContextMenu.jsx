import { StateManager } from "../../../../renderer/js/syscore/StatesManager";

export class ContextMenuHelper {
    constructor() {
        this.menuactionmap = {
            copy: this.copy,
            selectAll: this.selectAll,
            search: this.search,
            hightlight: '',
            removeHightlight: '',
            showBookmarks: '',
            add_bookmark: '',
            show_notes: '',
            dictionary_lookup: '',
            print_content: '',
            theme_select: '',
            font_select: '',
        }
        setTimeout(() => {
            this.readerContent = StateManager.get('readerSection')
        }, 100)
    }

    positionContextMenu(x, y, menu) {
        menu.style.left = x + 'px';
        menu.style.bottom = y + 'px';
        menu.classList.add('active');

        // Adjust if menu goes out of viewport
        setTimeout(() => {
            const rect = menu.getBoundingClientRect();
            const viewportWidth = parseInt(getComputedStyle(this.readerContent).width)
            const viewportHeight = window.innerHeight

            if (x > viewportWidth) {
                // prevent from going offscreen to the left
                menu.style.left = (x + rect.width) + 'px';
            }
            if (x > (viewportWidth * 0.8)) { // Percentage is more reliable to for different screen size
                const menuWidth = parseInt(getComputedStyle(menu).width);

                // invert positions so that the menu come to the left to avoid going off the content left = x-menuwidth
                menu.style.left = (x - menuWidth) + 'px';
            }

            if (y > (viewportHeight * 0.7)) {
                menu.style.bottom = viewportHeight - y + 'px';
                menu.style.top = 'auto';
                console.log(menu.style.bottom)
            }
            else {
                menu.style.top = y + 'px';
            }
        }, 10);
    }
}

export const contextmenu = new ContextMenuHelper()
