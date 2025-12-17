import React from 'react';
import { ReaderProgress } from './progress';
import { ReaderContent } from './content';
import { ToolTipUI } from '../Tooltips/tooltip';
import { ItemsUI } from '../SelectorUI/Item';
import { ContextMenuToast, DefaultToast } from '../Notifications/Toasts';

export const ReaderUI = ({ }) => {
    return (
        <section class="mt-[6.6vh] md:mt-[10vh] w-screen max-h-[calc(100vh-0vh)] overflow-y-hidden">
            <div id="reader-wrapper-container" class="relative h-[calc(100vh-7vh)] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 md:px-0 md:py-0.5 rounded-xl max-w-3xl mx-auto my-[0vh] shadow-md leading-relaxed prose dark:prose-invert overflow-y-auto transition-colors duration-700 scrollbar-custom-v1">

                <ReaderProgress />
                <ReaderContent />
                <ToolTipUI />
            </div>
            <ItemsUI />
            <DefaultToast />
            <ContextMenuToast />
        </section>
    );
};
