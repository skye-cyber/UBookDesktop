import React, { useCallback, useEffect, useRef } from 'react';

export const NotesModal = ({ }) => {
    const noteModal = useRef(null)
    const noteBox = useRef(null)
    const notComment = useRef(null)
    const noteContent = useRef(null)

    const openNoteModal = useCallback(() => {
        noteModal.current.classList.remove("-translate-x-full");
        noteModal.current.classList.add('-translae-x-0');
        noteBox.current.classList.remove('-translate-x-full');
        noteBox.current.classList.add('-translate-x-0');
    })

    const closeNoteModal = useCallback(() => {
        noteModal.current.classList.add("-translate-x-full");
        noteBox.current.classList.add('-translate-x-full');
        noteModal.current.classList.remove('-translate-x-0')

        setTimeout(() => {
            noteBox.current.classList.remove('-translate-x-0')
        }, 700)
        notComment.current.value = '';
    })
    const saveNote = useCallback(() => {
        console.log(notComment.current.value)
        const note = {
            comment: notComment.current.value,
            timestamp: new Date().toISOString(),
            text: noteContent.current.textContent,
            content: noteContent.current.innerHTML
        };

        window.api.saveNote(note);

        console.log("Note saved:", note);
        //showActionToast('save');
        closeNoteModal();
    })
    const cancelNote = useCallback(() => {
        notComment.current.value = '';
        noteText.current.innerHTML = ''
        closeNoteModal()
    })

    useEffect(() => {
        document.addEventListener('openNoteModal', openNoteModal)
        document.addEventListener('closeNoteModal', closeNoteModal)
        return () => {
            document.removeEventListener('openNoteModal', openNoteModal)
            document.removeEventListener('closeNoteModal', closeNoteModal)
        }
    })

    return (
        <div ref={noteModal} id="note-modal" className="fixed inset-0 flex items-center justify-center -translate-x-full w-full transform transition-transform transition-colors duration-700 ease-in-out z-50">
            <div className="modal-overlay absolute inset-0"></div>
            <div ref={noteBox} id="note-box" className="bg-white -translate-x-full dark:bg-gray-100 rounded-lg shadow-xl w-full max-w-md md:max-w-lg mx-4 z-10">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Note</h3>
                    <div ref={noteContent} id="noteContent" className="dark:bg-gray-50 w-full min-h-32 max-h-64 overflow-y-scroll p-3 border border-gray-400 rounded-lg" contenteditable="false" role="note-display"></div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Note Comment(#)</h3>
                    <textarea ref={notComment} id="note-comment" oninput="this.style.height = 'auto'; this.style.height = Math.min(this.scrollHeight, 28 * window.innerHeight / 100) + 'px'; this.scrollTop = this.scrollHeight;" className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:border-blue-500 resize-none" placeholder="Enter your comment here..."></textarea>
                    <div className="flex justify-end space-x-3 mt-4">
                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800" onClick={cancelNote}>Cancel</button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={saveNote}>Save Note</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
