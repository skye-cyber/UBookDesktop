class SearchEngine {
    constructor(wrapper) {
        this.scope = wrapper || document.getElementById('reader-content');
    }

    screenXY(range){
        // Save the current selection coordinates
        this.rect = range.getBoundingClientRect();
        this.startX = this.rect.left;
        this.startY = this.rect.top;
        this.endX = this.rect.right;
        this.endY = this.rect.bottom;
    }

    getCaretPositionFromPoint(x, y) {
        let pos = null;
        if (document.caretPositionFromPoint) {
            const caret = document.caretPositionFromPoint(x, y);
            pos = { node: caret.offsetNode, offset: caret.offset };
        } else if (document.caretRangeFromPoint) {
            const range = document.caretRangeFromPoint(x, y);
            pos = { node: range.startContainer, offset: range.startOffset };
        }
        return pos;
    }


    searchPage() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        // store screen coordinates
        this.screenXY(range);

        if (!selectedText) return;

        // Find the closest parent element of the selection
        //const selectionPElement = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
          //  ? range.commonAncestorContainer
            //: range.commonAncestorContainer.parentNode;

        // Create a regex to match the search text but not the selected text
        const regex = new RegExp(selectedText, 'g');
        const replaceWith = `<span class="border border-dotted border-pink-500 dark:border-green-400 p-0">${selectedText}</span>`;

        // Find all occurrences of the search text and their parent elements
        const matches = this.findMatchesInScope(regex)
        matches.forEach(match => {
            const parentElement = match.node.parentNode;
            if (parentElement) {
                const parentTextContent = parentElement.innerHTML;
                const parentRegex = new RegExp(`(${match.match})`, 'g');
                parentElement.innerHTML = parentTextContent.replace(parentRegex, replaceWith);
            }
        });

        // Restore the selection using the saved coordinates
        selection.removeAllRanges();

        const startPos = this.getCaretPositionFromPoint(this.startX, this.startY);
        const endPos = this.getCaretPositionFromPoint(this.endX, this.endY);

        if (startPos && endPos) {
            range.setStart(startPos.node, startPos.offset);
            range.setEnd(endPos.node, endPos.offset);
            selection.addRange(range);
        }
    }

    removeHighlightedSpans() {
        const spans = this.scope.querySelectorAll('span.border.border-dotted.dark\\:border-green-400');

        spans.forEach(span => {
            const parent = span.parentNode;
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        });
    }


    getOffset(originalText, newText, offset) {
        let originalIndex = 0;
        let newIndex = 0;

        while (originalIndex < offset && newIndex < newText.length) {
            if (originalText[originalIndex] === newText[newIndex]) {
                originalIndex++;
                newIndex++;
            } else {
                newIndex++;
            }
        }

        return newIndex;
    }


    findMatchesInScope(regex) {
        const matches = [];
        const walker = document.createTreeWalker(this.scope, NodeFilter.SHOW_TEXT, null, false);

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const text = node.nodeValue;
            let match;

            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    node: node,
                    match: match[0],
                    index: match.index,
                    length: match[0].length,
                });
            }
        }

        return matches;
    }
}

// Usage
const engine = new SearchEngine();
