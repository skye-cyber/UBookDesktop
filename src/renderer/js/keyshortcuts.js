// shortcut implementations
document.addEventListener('keydown', (event) => {
    // 1) if it’s F11, do nothing here and let the browser/Electron handle it
    if (event.key === "F11" || event.code === "F11") {
        return;
    }

    if (event.ctrlKey && event.key === 'S' || event.ctrlKey && event.key === 's') {
        event.preventDefault(); // Prevent the default Save action in browsers
        document.getElementById("search-toggle").click()

    } else if (event.key === 'Escape') {
        event.preventDefault();
        closeSearchModal();
        closeSearchPref();
        engine.removeHighlightedSpans();
        hideTooltip();

    } else if ((event.ctrlKey && event.key === 'P' || event.ctrlKey && event.key === 'p') && !event.shiftKey) {
        event.preventDefault(); // Prevent any default action
        document.getElementById("sidepane-toggle").click()

    } else if (event.ctrlKey && event.key === 'N' || event.ctrlKey && event.key === 'n') {
        //NewConversation(event);

    } else if (event.ctrlKey && event.key === 'f' || event.ctrlKey && event.key === 'F') {
        event.preventDefault(); // Prevent any default action
        //attachFiles.click();

    } else if (event.key.toLocaleLowerCase() === 'p' && event.shiftKey) {
        event.preventDefault(); // Prevent any default action
        handleContextMenuAction('print');
    } else if (event.key.toLocaleLowerCase()===' '){
        event.preventDefault();
        btnPlayPause.click()
    // fast forward
    } else if (event.key.toLocaleLowerCase()==='arrowright'){
        event.preventDefault();
        document.getElementById('btn-forward').click()
    //seek backward
    } else if (event.key.toLocaleLowerCase()==='arrowleft'){
        event.preventDefault();
        document.getElementById('btn-backward').click()
    // Next chapter
    } else if (event.key.toLocaleLowerCase()==='pageup'){
        event.preventDefault();
        nextSection()
    // Previous chapter
    } else if (event.key.toLocaleLowerCase()==='pagedown'){
        event.preventDefault();
        previousSection()
    //Increase font
    } else if (event.ctrlKey && event.key.toLocaleLowerCase()==='='){
        event.preventDefault();
        changeFontSize(1)
    // Decrease Font
    } else if (event.ctrlKey && event.key.toLocaleLowerCase()==='-'){
        event.preventDefault();
        changeFontSize(-1)
    // Reset font
    } else if (event.ctrlKey && event.key.toLocaleLowerCase()==='0'){
        event.preventDefault();
        changeFontSize(-1)
    } else if (event.ctrlKey && event.key.toLocaleLowerCase() === 'tab'){
        event.preventDefault();
        clearInterface()
    }
});
