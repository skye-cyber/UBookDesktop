const RightPanetooltip = document.getElementById('rightpanel-tooltip-menu');

const quickread = document.getElementById('quick-acsess-container')

quickread.addEventListener('mouseup', (e) => {
    RpanetoolTipPositionHandler(true);
});

let Rpane = false

function RpanetoolTipPositionHandler() {
    const selection = window.getSelection();
    selectedText = normalizeSelection(selection.toString().trim()).toLowerCase();

    selectedContent = getSelectionHtml();

    Rpane = true

    if (selectedText.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        //wrapper = _quickread ? quickread : wrapper
        const wrapperRect = quickread.getBoundingClientRect();

        RightPanetooltip.style.display = 'block';
        RightPanetooltip.style.visibility = 'hidden'; // so we can measure it

        requestAnimationFrame(() => {
            const tooltipWidth = RightPanetooltip.offsetWidth;
            const tooltipHeight = RightPanetooltip.offsetHeight;

            // Position relative to wrapper/quickread
            const top = rect.top - wrapperRect.top - tooltipHeight + 80;
            let left = rect.left - wrapperRect.left + rect.width / 2 - tooltipWidth / 2;

            // Constrain within wrapper/quickread bounds
            left = Math.max(8, Math.min(left, quickread.offsetWidth - tooltipWidth - 8));

            RightPanetooltip.style.top = `${top}px`;
            RightPanetooltip.style.left = `${left}px`;
            RightPanetooltip.style.visibility = 'visible';
            RightPanetooltip.classList.remove('hidden', '-translate-x-[200%]');
            RightPanetooltip.classList.add('opacity-100');
        });
    } else {
        tooltip.classList.add('hidden');
        tooltip.classList.remove('opacity-100');
    }
}


// Hide when clicking outside the tooltip or selecting nothing
quickread.addEventListener('mousedown', (e) => {
    if (!RightPanetooltip.contains(e.target)) {
        hideTooltip();
    }
});

// Hide when selection changes and is cleared
quickread.addEventListener('selectionchange', () => {
    const text = window.getSelection().toString().trim();
    if (!text) hideTooltip();
});

// Optional: Hide on Esc

quickread.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideTooltip();
});

