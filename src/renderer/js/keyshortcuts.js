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
        //settingsmodal.classList.add('hidden');
    } else if (event.ctrlKey && event.key === 'P' || event.ctrlKey && event.key === 'p') {
        event.preventDefault(); // Prevent any default action
        document.getElementById("sidepane-toggle").click()
    } else if (event.ctrlKey && event.key === 'N' || event.ctrlKey && event.key === 'n') {
        //NewConversation(event);
    } else if (event.ctrlKey && event.key === 'f' || event.ctrlKey && event.key === 'F') {
        event.preventDefault(); // Prevent any default action
        //attachFiles.click();
    } else if (event.altKey && event.key === 'a' || event.altKey && event.key === 'A') {
        event.preventDefault(); // Prevent any default action
        //document.getElementById('AutoScroll').click();
    }
});
