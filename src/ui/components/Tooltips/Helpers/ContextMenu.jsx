import { appState } from "../../Reader/appState";

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
            this.readerContent = window.StateManager.get('readerSection')
        }, 100)
    }

    positionContextMenu(x, y, menu) {
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.add('active');

        // Adjust if menu goes out of viewport
        setTimeout(() => {
            const rect = menu.getBoundingClientRect();
            const viewportWidth = window.innerWidth + 100;
            const viewportHeight = window.innerHeight + 100;

            if (rect.right > viewportWidth) {
                menu.style.left = (x - rect.width) + 'px';
            }

            if (rect.bottom > viewportHeight) {
                menu.style.top = (y - rect.height) + 'px';
            }
            if (rect.top > viewportHeight) {
                menu.style.bottom = (y + rect.height) + 'px';
            }
        }, 10);
    }
}

export const contextmenu = new ContextMenuHelper()
