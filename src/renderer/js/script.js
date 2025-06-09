document.addEventListener('DOMContentLoaded', ()=>{
    const scripts = ['displayHandler', 'readerUtils', 'RpaneTooltip', 'providers/contentRenderer', 'PlayerUtils', "searchBase/search", "searchBase/searchBaseEntry", "searchBase/packed_lunrSearch", "searchBase/Sutils"]
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
    script.src = `js/${target_script}.js`;
    script.async = true; // Optional: load the script asynchronously
    document.body.appendChild(script);
    //console.log(`Added ${target_script} script`);
}
