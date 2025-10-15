let selectedHighlightClass = 'bg-yellow-200 dark:bg-[#f4f400] text-black dark:text-slate-900';

let colors = 'bg-green-200 dark:bg-green-700 bg-blue-200 dark:bg-blue-700 bg-pink-200 dark:bg-pink-700'

function handleHighlight(color=null, action="highlight") {
    if (color){
        selectedHighlightClass = `bg-${color}-200 dark:bg-${color}-700 text-black dark:text-slate-900`
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    // Get all elements that are fully or partially selected
    const selectedElements = getSelectedElements(selection);
    if (!selectedElements){
        const range = selection?.getRangeAt(0);
        const span = document.createElement('span');
        const selectionHTML = getSelectionHtml(selection);

        span.className = selectedHighlightClass + ' px-0.5 rounded-sm transition-color duration-500';
        span.innerHTML = selectionHTML;

        range.deleteContents();
        range.insertNode(span);
        showActionToast('highlight');
        hideTooltip();
        return
    }
    // Apply highlight styling directly to elements
    selectedElements.forEach(element => {
        action==='highlight' ? applyDirectHighlight(element) : removeDirectHighlight(element);
    });

    showActionToast('highlight');
    hideTooltip();
    selection.removeAllRanges();
}

function getSelectedElements(selection) {
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

function applyDirectHighlight(element) {
    // Add highlight classes directly to the element
    const highlightClasses = selectedHighlightClass.split(' ');

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

function removeDirectHighlight(element) {
    // Add highlight classes directly to the element
    const highlightClasses = selectedHighlightClass.split(' ');

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
// Helper function to get selection HTML (your existing function)
function setHighlightColor(color) {
    const circles = document.querySelectorAll('#current-color-circle');

    switch (color) {
        case 'yellow':
            selectedHighlightClass = 'bg-yellow-200 dark:bg-[#f4f400] text-black dark:text-slate-900';
            circles.forEach(circle => {
                circle.className = 'size-6 rounded-full bg-yellow-300 dark:bg-yellow-500 mr-2';
            })
            break;
        case 'blue':
            selectedHighlightClass = 'bg-blue-200 dark:bg-blue-500 text-black dark:text-white';
            circles.forEach(circle => {
                circle.className = 'size-6 rounded-full bg-blue-300 dark:bg-blue-500 mr-2';
            })
            break;
        case 'pink':
            selectedHighlightClass = 'bg-pink-200 dark:bg-pink-500 text-black dark:text-black';
            circles.forEach(circle => {
                circle.className = 'size-6 rounded-full bg-pink-300 dark:bg-pink-500 mr-2';
            })
            break;
        case 'green':
            selectedHighlightClass = 'bg-green-300 dark:bg-green-500 text-black dark:text-black';
            circles.forEach(circle => {
                circle.className = 'size-6 rounded-full bg-green-500 dark:bg-green-500 mr-2';
            })
            break;
    }

    document.getElementById('color-picker').classList.add('hidden');
}
