document.addEventListener('DOMContentLoaded', ()=>{
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
    });
});
