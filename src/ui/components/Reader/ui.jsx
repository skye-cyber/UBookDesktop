import React, { useEffect, useRef, useState } from 'react';
import { ReaderProgress } from './progress';
import { ReaderContent } from './content';
import { ToolTipUI } from '../Tooltips/tooltip';
import { BookItemSelectorUI } from '../SelectorUI/ItemSelector';
import { ContextMenuToast, DefaultToast } from '../Notifications/Toasts';
import { CopyFeedback } from '../StatusUI/ToastsUI';
import { NotesComposer } from '../ContextMenu/Modals/Notes';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';
import { SearchSettings } from '../../Pages/searchSettings';
import { SearchResultPage } from '../../Pages/Search';

export const ReaderUI = ({ }) => {
    const readerSection = useRef(null);
    const wrapper = useRef(null)
    const progressBar = useRef(null)
    const percentageRef = useRef(null)

    useEffect(() => {
        readerSection.current = StateManager.get('readerSection')
    })

    const handle_scrollprogress = () => {
        const scrollTop = wrapper.current.scrollTop;
        const scrollHeight = wrapper.current.scrollHeight - wrapper.current.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;

        progressBar.current.style.width = `${progress}%`;
        percentageRef.current.textContent = `${progress.toFixed(1)}%`;
    }

    useEffect(() => {
        wrapper.current.addEventListener('scroll', handle_scrollprogress);
        return () => {
            wrapper.current.removeEventListener('scroll', handle_scrollprogress);
        }
    })
    return (
        <>
            <section className="w-screen max-h-[calc(100vh-0vh)] overflow-y-hidden">
                <section className='flex justify-center items-center rounded-xl max-w-3xl mx-auto'>
                    <ReaderProgress progressRef={progressBar} percentageRef={percentageRef}/>
                </section>

                <div
                    ref={wrapper}
                    id="reader-wrapper-container"
                    className="relative h-[calc(100vh-7vh)] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 pb-3 px-6 md:px-0 md:pb-0.5 rounded-x-xl rounded-y-xl round-t-none max-w-3xl mx-auto my-[0vh] shadow-md leading-relaxed prose dark:prose-invert overflow-y-auto transition-colors duration-700 scrollbar-custom">
                    <ReaderContent />
                    <ToolTipUI />
                </div>
                <DefaultToast />
                <ContextMenuToast />
            </section>
            <BookItemSelectorUI />
            <CopyFeedback />
            <NotesComposer />
            <SearchSettings />
            <SearchResultPage />
        </>
    );
};
