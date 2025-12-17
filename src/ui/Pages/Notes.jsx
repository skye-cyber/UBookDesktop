import React, { useCallback, useEffect, useRef } from 'react';

export const NotesPage = ({ }) => {
    const noteui = useRef(null);
    const notebody = useRef(null)
    const notebackdrop = useRef(null)
    const notep = useRef(null)

    const showNotes = useCallback((noteContent = '') => {
        notep ? notep.innerHTML = noteContent : '';

        noteui.classList.remove('pointer-events-none');

        requestAnimationFrame(() => {
            notebackdrop.classList.remove('opacity-0', 'scale-95');
            notebackdrop.classList.add('opacity-100', 'scale-100');

            notebody.classList.remove('opacity-0', 'scale-90', 'translate-y-8');
            notebody.classList.add('opacity-100', 'scale-100', 'translate-y-0');
        });
    })


    const closeNotes = useCallback(() => {
        notebackdrop.classList.add('opacity-0', 'scale-95');
        notebackdrop.classList.remove('opacity-100', 'scale-100');

        notebody.classList.add('opacity-0', 'scale-90', 'translate-y-8');
        notebody.classList.remove('opacity-100', 'scale-100', 'translate-y-0');

        // Wait for animation to finish before disabling interaction
        setTimeout(() => {
            noteui.classList.add('pointer-events-none');
        }, 400);
    })

    useEffect(() => {
        document.addEventListener('show-notes', showNotes)
        document.addEventListener('hide-notes', closeNotes)

        return () => {
            document.removeEventListener('show-notes', showNotes)
            document.removeEventListener('hide-notes', closeNotes)
        }
    })

    return (
        <div ref={noteui} id="notesui" className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div ref={notebackdrop} id="notes-backdrop" className="absolute inset-0 bg-black/30 backdrop-brightness-50 transition-all duration-500 ease-in-out opacity-0 scale-95"></div>

            <div ref={notebody} id="notebody"
                className="relative z-10 min-w-[40vw] w-fit max-w-[60vw] h-fit min-h-[40vh] max-h-[90vh] p-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-2xl shadow-xl transform scale-90 translate-y-8 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden">
                <button id="closeModal" className="absolute top-3 right-3 text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition">
                    ✖
                </button>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 dark:border-cyan-400 select-none">📝 Notes</h2>
                <section id="notecontent" className="w-full max-h-[80vh] overflow-y-auto">
                    <p ref={notep} className="text-base leading-relaxed dark:text-gray-300">
                        No note available yet!
                    </p>
                </section>
            </div>
        </div>
    )
}
