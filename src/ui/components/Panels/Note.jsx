import React, { useCallback } from 'react';
import { modalmanager } from '../../../renderer/js/Status/Manager';

export const NoteCard = ({ note, portal_id }) => {
    const ConfirmDeletion = useCallback(async () => {
        const confirmed = await modalmanager.confirm(`Delete ${note.timestamp} ?`, 'Confirm Deletion')

        if (confirmed && typeof (confirmed) === 'boolean') await DeleteNote();
    })

    const DeleteNote = async () => {
        console.log(note.timestamp);

        const isDeleted = await window.ubook.api.deleteNote(note.timestamp)
        if (isDeleted) {
            modalmanager.showMessage('Note Deleted.', 'success');
            window.reactPortalBridge.closeComponent(portal_id)
        }
    }
    return (
        <div className='group relative p-5 mb-4 rounded-2xl shadow-xl border border-transparent transition-all bg-gradient-to-br from-white via-gray-100 to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-indigo-900 hover:border-blue-400 dark:hover:border-indigo-400 hover:scale-[1.01] hover:shadow-2xl transform transition-all duration-150 ease-in-out mx-1'>
            <section className="flex justify-between">
                <div className="mb-2 text-xs text-gray-600 dark:text-gray-400 italic transition-colors duration-500">
                    {new Date(note.timestamp).toLocaleString()}
                </div>
                <button onClick={ConfirmDeletion}
                    className="w-10 h-10 bg-blue-50 dark:bg-indigo-900 hover:bg-white dark:hover:bg-indigo-800 text-red-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-indigo-300 transition-colors duration-500">
                {note.comment}
            </h3>
            <p className="mt-2 text-sm text-gray-800 dark:text-gray-200 leading-relaxed transition-colors duration-500" dangerouslySetInnerHTML={{ __html: note.content }}>
            </p>
        </div>
    )
}
