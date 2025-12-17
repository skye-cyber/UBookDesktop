import React from 'react';

export const DefaultToast = ({ }) => {
    return (
        <div id="action-toast" className="fixed right-0 top-10 transform translate-x-full transition-all duration-500 ease-in-out z-50 bg-primary-600 dark:bg-gray-800 text-gray-50 dark:text-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 border border-gray-300 dark:border-gray-600 opacity-0 transition-colors duration-700">
            <span id="toast-icon" className="w-5 h-5 text-green-900"></span>
            <span id="toast-message" className="text-sm font-mono font-semibold">Action completed</span>
        </div>
    )
}

export const ContextMenuToast = ({ }) => {
    return (
        <div id="toast" className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg transform translate-y-10 opacity-0 transition-all duration-300 z-50">
        <span id="toastMessage" className="font-mono tracking-tight">Action completed</span>
        </div>
    )
}
