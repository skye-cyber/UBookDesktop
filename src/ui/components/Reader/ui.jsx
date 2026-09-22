import { useEffect, useRef } from 'react';
import { ReaderContent } from './content';
import { ToolTipUI } from '../Tooltips/tooltip';
import { BookItemSelectorUI } from '../SelectorUI/ItemSelector';
import { ContextMenuToast, DefaultToast } from '../Notifications/Toasts';
import { CopyFeedback } from '../StatusUI/ToastsUI';
import { NotesComposer } from '../ContextMenu/Modals/Notes';
import { SearchResultPage } from '../../Pages/Search';
import { Controls } from './controlbar.tsx';
import { StateManager } from '../../../common/syscore/StatesManager';
import { BookNavigator } from './navigator';

const NavigatorUi = () => (
    <section className='fixed bottom-16 left-1 flex gap-5'>
        {/* Navigate to previous section */}
        <button
            onClick={() => BookNavigator.previousSection()}
            aria-label="Previous Chapter"
            title="Previous Chapter"
            className="flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-colors duration-500"
        >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradPrev" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#48fa83" />
                        <stop offset="100%" stopColor="#2abda2" />
                    </linearGradient>
                </defs>
                <path d="M16 4l-8 8 8 8" fill="none" stroke="url(#gradPrev)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>

        {/* Navigate to next section */}
        <button
            onClick={() => BookNavigator.nextSection()}
            aria-label="Next Chapter"
            title="Next Chapter"
            className="flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700/60 rounded-lg transition-colors duration-500"
        >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradNext" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4facfe" />
                        <stop offset="100%" stopColor="#00f2fe" />
                    </linearGradient>
                </defs>
                <path d="M8 4l8 8-8 8" fill="none" stroke="url(#gradNext)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    </section>
)

export const ReaderUI = ({ }) => {
    const readerSection = useRef(null);
    const wrapper = useRef(null)

    useEffect(() => {
        readerSection.current = StateManager.get('readerSection')
    })

    return (
        <>
            <section className="w-screen h-[90dvh] sm:max-h-[100dvh] overflow-y-hidden">
                <section className='flex justify-center items-center rounded-xl max-w-full md:max-w-3xl mx-auto shadow-xl shadow-y-none shadow-gray-400 dark:shadow-slate-900'>
                    {/*Hide in mobile devices/small devices */}
                    {(window.innerWidth > 400) && (
                        <Controls />)
                    }
                </section>

                <div
                    ref={wrapper}
                    id="reader-wrapper-container"
                    className="relative h-[calc(100vh-7vh)] bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 pb-3 sm:px-6 md:px-0 md:pb-0.5 rounded-x-xl rounded-y-xl round-t-none max-w-3xl container mx-auto my-[0vh] shadow-xl shadow-y-none shadow-gray-400 dark:shadow-slate-900 leading-relaxed prose dark:prose-invert overflow-y-auto transition-colors duration-700 scrollbar-custom">
                    <ReaderContent />
                    <ToolTipUI />
                    {(window.innerWidth <= 400) && (
                        <NavigatorUi />
                    )}
                </div>
                <DefaultToast />
                <ContextMenuToast />
            </section>
            <BookItemSelectorUI />
            <CopyFeedback />
            <NotesComposer />
            <SearchResultPage />
        </>
    );
};
