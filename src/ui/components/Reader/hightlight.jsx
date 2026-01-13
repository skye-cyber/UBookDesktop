import { appState } from "./appState";

class HighlightManager {
    constructor() {
        this.HighlightClass = 'bg-yellow-200 dark:bg-[#f4f400] text-black dark:text-slate-900';
        this.color_map = {
            yellow: {
                className: 'bg-yellow-200 dark:bg-[#f4f400] text-black dark:text-slate-900',
                circle: 'size-6 rounded-full bg-yellow-300 dark:bg-yellow-500 mr-2'
            },
            blue: {
                className: 'bg-blue-200 dark:bg-blue-500 text-black dark:text-white',
                circle: 'size-6 rounded-full bg-blue-300 dark:bg-blue-500 mr-2'
            },
            pink: {
                className: 'bg-pink-200 dark:bg-pink-500 text-black dark:text-black',
                circle: 'size-6 rounded-full bg-pink-300 dark:bg-pink-500 mr-2'
            },
            green: {
                className: 'bg-green-300 dark:bg-green-500 text-black dark:text-black',
                circle: 'size-6 rounded-full bg-green-500 dark:bg-green-500 mr-2'
            }
        }
    }
    getSelectedElements(selection = appState.currentSelection) {
        const range = selection.getRangeAt(0);
        const commonAncestor = range.commonAncestorContainer;

        // Check if it's an element (supports querySelectorAll)
        if (!(commonAncestor instanceof Element)) {
            return null;
        }

        // Get all elements within the selection
        const allElements = commonAncestor.querySelectorAll('*');
        const selectedElements = new Set();

        allElements.forEach(element => {
            if (range.intersectsNode(element)) {
                // Find the innermost elements that contain text
                if (element.childElementCount === 0 || element.textContent.trim()) {
                    selectedElements.add(element);
                }
            }
        });

        return Array.from(selectedElements);
    }

    applyDirectHighlight(element) {
        // Add highlight classes directly to the element
        const highlightClasses = this.HighlightClass.split(' ');

        highlightClasses.forEach(className => {
            if (!element.classList.contains(className)) {
                element.classList.add(className);
            }
        });

        // Add additional styling classes
        const additionalClasses = ['px-0.5', 'rounded-sm', 'transition-color', 'duration-500', 'direct-highlight'];
        additionalClasses.forEach(className => {
            if (!element.classList.contains(className)) {
                element.classList.add(className);
            }
        });

        // Ensure text color is maintained for dark mode compatibility
        element.classList.add('text-inherit');
    }

    removeDirectHighlight(element) {
        // Add highlight classes directly to the element
        const highlightClasses = this.HighlightClass.split(' ');

        highlightClasses.forEach(className => {
            if (element.classList.contains(className)) {
                element.classList.remove(className);
            }
        });

        // Add additional styling classes
        const additionalClasses = ['px-0.5', 'rounded-sm', 'transition-color', 'duration-500', 'direct-highlight'];
        additionalClasses.forEach(className => {
            if (element.classList.contains(className)) {
                element.classList.remove(className);
            }
        });

        // Ensure text color is maintained for dark mode compatibility
        element.classList.add('text-inherit');
    }
    hightlight(color = null) {
        if (color) {
            this.HighlightClass = `bg-${color}-200 dark:bg-${color}-700 text-black dark:text-slate-900`
        }

        const selection = appState.currentSelection || window.getSelection();
        if (!selection || selection.isCollapsed) return;

        // Get all elements that are fully or partially selected
        const selectedElements = this.getSelectedElements(selection);
        if (!selectedElements) {
            const range = selection?.getRangeAt(0);
            const span = document.createElement('span');
            const selectionHTML = appState.selectedHTML || getSelectionHtml(selection);

            span.className = selectedHighlightClass + ' px-0.5 rounded-sm transition-color duration-500';
            span.innerHTML = selectionHTML;

            range.deleteContents();
            range.insertNode(span);
            return
        }
        // Apply highlight styling directly to elements
        selectedElements.forEach(element => {
            this.applyDirectHighlight(element);
        });
    }
    delhighlight() {
        // Remove highlight styling directly to elements
        selectedElements.forEach(element => {
            this.removeDirectHighlight(element);
        });
    }
    setHighlightColor(color) {
        this.HighlightClass = this.color_map[color].className

        //circles.forEach(circle => {
        //
        //})
    }
    get_color(color){
        return this.color_map[color]
    }
}

export const Highlighter = new HighlightManager()
