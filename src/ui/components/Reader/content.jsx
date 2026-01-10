import React, { useEffect, useRef } from 'react';

export const ReaderContent = ({ }) => {
    const readerSection = useRef(null)

    useEffect(() => {
        const clearSection = () => {
            readerSection.current.innerHTML = ""
        }
        window.StateManager.set('readerSection', readerSection.current)

        document.addEventListener('clear-reader-section', clearSection)
        return () => {
            //window.StateManager.set('readerSection', null)
            document.removeEventListener('clear-reader-section', clearSection)
        }
    })

    return (
        <article
            ref={readerSection}
            data-portal-container='reader-content'
            id="reader-content"
            className="react-portal-root select-text bg-gradient-to-b from-[#f8f4e9] to-[#f2ebd8]  dark:from-gray-950 dark:to-gray-950 focus:outline-none mb-4 font-reader overflow-y-hidden mt-1 p-6 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-300 rounded-lg">
        </article>
    )
}
