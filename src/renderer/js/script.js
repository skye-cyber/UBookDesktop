document.addEventListener('DOMContentLoaded', ()=>{
    const scripts = ['js/displayHandler', 'js/readerUtils', 'js/RpaneTooltip', 'js/providers/contentRenderer', 'js/PlayerUtils', "js/searchBase/search", "js/searchBase/searchBaseEntry", "js/searchBase/packed_lunrSearch", "js/searchBase/Sutils", '../components/ContextMenuHandler']
    for (const item of scripts) {
        addScripts(item);
    }

    const navToggle = document.getElementById('sidepane-toggle');
    const sidepane = document.getElementById('sidepane');
    const sidepaneMask = document.getElementById('sidepaneMask');

    navToggle.addEventListener('click', ()=>{
        sidepaneMask.classList.toggle('-translate-x-full');
        sidepaneMask.classList.toggle('-translate-x-0');
        sidepane.classList.toggle('-translate-x-full');
        sidepane.classList.toggle('-translate-x-0');
    })

    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.getElementById('search-container');

    searchToggle.addEventListener('click', () => {
        searchContainer.classList.toggle('opacity-0');
        searchContainer.classList.toggle('opacity-100');
        searchContainer.classList.toggle('pointer-events-none');
        //searchContainer.focus()
    });
});

function addScripts(target_script) {
    const script = document.createElement('script');
    script.src = `${target_script}.js`;
    script.async = true; // Optional: load the script asynchronously
    document.body.appendChild(script);
    //console.log(`Added ${target_script} script`);
}
