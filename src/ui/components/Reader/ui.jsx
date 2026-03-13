import { useEffect, useRef } from 'react';
import { ReaderContent } from './content';
import { ToolTipUI } from '../Tooltips/tooltip';
import { BookItemSelectorUI } from '../SelectorUI/ItemSelector';
import { ContextMenuToast, DefaultToast } from '../Notifications/Toasts';
import { CopyFeedback } from '../StatusUI/ToastsUI';
import { NotesComposer } from '../ContextMenu/Modals/Notes';
import { SearchSettings_new } from '../../Pages/searchSettings';
import { SearchResultPage } from '../../Pages/Search';
import { Controls } from './controlbar';
import { StateManager } from '../../../common/syscore/StatesManager';

export const ReaderUI = ({ }) => {
    const readerSection = useRef(null);
    const wrapper = useRef(null)

    useEffect(() => {
        readerSection.current = StateManager.get('readerSection')
    })

    return (
        <>
            <section className="w-screen max-h-[calc(100vh-0vh)] overflow-y-hidden">
                <section className='flex justify-center items-center rounded-xl max-w-full md:max-w-3xl mx-auto shadow-xl shadow-y-none shadow-gray-400 dark:shadow-slate-900 '>
                    <Controls />
                </section>

                <div
                    ref={wrapper}
                    id="reader-wrapper-container"
                    className="relative h-[calc(100vh-7vh)] bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 pb-3 px-6 md:px-0 md:pb-0.5 rounded-x-xl rounded-y-xl round-t-none max-w-3xl container mx-auto my-[0vh] shadow-xl shadow-y-none shadow-gray-400 dark:shadow-slate-900 leading-relaxed prose dark:prose-invert overflow-y-auto transition-colors duration-700 scrollbar-custom">
                    <ReaderContent />
                    <ToolTipUI />
                </div>
                <DefaultToast />
                <ContextMenuToast />
            </section>
            <BookItemSelectorUI />
            <CopyFeedback />
            <NotesComposer />
            <SearchSettings_new />
            <SearchResultPage />
        </>
    );
};
