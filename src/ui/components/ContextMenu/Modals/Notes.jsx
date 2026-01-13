import React, { useCallback, useEffect, useRef } from 'react';
import { appState } from '../../Reader/appState';
import { modalmanager } from '../../../../renderer/js/Status/Manager';

export const NotesComposer = ({ }) => {
    const noteModal = useRef(null)
    const noteBox = useRef(null)
    const notComment = useRef(null)
    const noteContent = useRef(null)
    const selectedHTML = useRef(null)

    const openComposer = useCallback(() => {
        noteModal.current.classList.remove("-translate-x-full");
        noteModal.current.classList.add('-translae-x-0');
        noteBox.current.classList.remove('-translate-x-full');
        noteBox.current.classList.add('-translate-x-0');
    })

    const closeComposer = useCallback(() => {
        noteModal.current.classList.add("-translate-x-full");
        noteBox.current.classList.add('-translate-x-full');
        noteModal.current.classList.remove('-translate-x-0')

        setTimeout(() => {
            noteBox.current.classList.remove('-translate-x-0')
        }, 700)
        notComment.current.value = '';
    })
    const saveNote = useCallback(() => {
        const note = {
            comment: notComment.current.value,
            timestamp: new Date().toISOString(),
            text: appState.selectedText,
            content: appState.selectedHTML
        };

        const status_ok = window.ubook.api.saveNote(note);
        if (status_ok) {
            modalmanager.showMessage('Note save successfully', 'success')
        } else {
            modalmanager.showMessage('Failed to save note', 'error')
        }
        closeComposer();
    })
    const cancelNote = useCallback(() => {
        notComment.current.value = '';
        closeComposer()
    })

    const onInputHandler = useCallback((e) => {
        const target = e.currentTarget;

        target.style.height = 'auto';
        target.style.height = Math.min(target.scrollHeight, 28 * window.innerHeight / 100) + 'px'; target.scrollTop = target.scrollHeight;

    })

    const updateHTML = useCallback(() => {
        noteContent.current.innerHTML = appState.selectedHTML
    })

    useEffect(() => {
        noteContent.current.innerHTML = appState.selectedText
        document.addEventListener('OpenNotesComposer', openComposer)
        document.addEventListener('closeNoteComposer', closeComposer)
        return () => {
            document.removeEventListener('OpenNotesComposer', openComposer)
            document.removeEventListener('closeNoteComposer', closeComposer)
        }
    })

    return (
        <div ref={noteModal} id="note-modal" className="fixed inset-0 flex items-center justify-center -translate-x-full w-full transform transition-transform transition-colors duration-700 ease-in-out z-50">
            <div className="modal-overlay absolute inset-0"></div>
            <div ref={noteBox} id="note-box" className="bg-white -translate-x-full dark:bg-gray-100 rounded-lg shadow-xl w-full max-w-md md:max-w-lg mx-4 z-10">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Note</h3>
                    <div ref={noteContent} id="noteContent" className="dark:bg-gray-50 w-full min-h-32 max-h-64 overflow-y-scroll p-3 border border-gray-400 rounded-lg" contentEditable="false" role="note-display" dangerouslySetInnerHTML={{ __html: selectedHTML.current }}>{selectedHTML.current}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Note Comment(#)</h3>
                    <textarea ref={notComment} id="note-comment" onInput={onInputHandler} className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:border-blue-500 resize-none" placeholder="Enter your comment here..."></textarea>
                    <div className="flex justify-end space-x-3 mt-4">
                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800" onClick={cancelNote}>Cancel</button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={saveNote}>Save Note</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
