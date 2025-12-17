import React from 'react';
import { ColorPicker } from './colorpicker';

export const OnselectTooltip = ({ }) => {
    return (
        <section id="tooltip-menu"
            className="absolute hidden -translate-x-[200%] bg-gray-900 text-white dark:bg-white dark:text-gray-900 border border-gray-700 dark:border-gray-200 text-sm rounded-lg shadow-xl px-3 py-2 z-50 transition-opacity duration-200 opacity-0">

            <div id="tooltip-row" className="flex-row justify-start gap-2">
                <div className="flex flex-wrap gap-2 w-fit space-x-3 mb-1">

                    <button onClick="handleCopy()" className="hover:text-blue-300 dark:hover:text-blue-600"><p className="flex space-x-1"><svg xmlns="http://www.w3.org/2000/svg" className="size-6 fill-none stroke-green-500 hover:stroke-green-400 mr-1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>Copy</p></button>

                    <button onClick="handleWebSearch()" className="flex hover:text-green-300 dark:hover:text-green-600">
                        <svg className="h-5 w-5 fill-indigo-400 dark:fill-blue-600 text-white dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg>Search
                    </button>

                    <button onClick="handleSaveNote()" className="hover:text-yellow-300 dark:hover:text-yellow-600">Save</button>

                    <button onClick="handleHighlight()" className="hover:text-yellow-400 dark:hover:text-yellow-600">🖊️Highlight</button>
                </div>

                <div className="flex flex-wrap gap-2 w-fit space-x-3 pt-2 w-fit border-t border-gray-600 dark:border-gray-300">
                    <button onClick="showColorPicker()" className="flex items-center hover:text-purple-400 dark:hover:text-purple-600">
                        <span id="current-color-circle" className="size-6 rounded-full bg-yellow-300 dark:bg-yellow-500 mr-1"></span>
                        <span>Color</span>
                    </button>
                    <button onClick="handleReadAloud()" className="hover:text-pink-400 dark:hover:text-pink-600">
                        🔊 Read Aloud
                    </button>
                    <button onClick="handleExport()" className="hover:text-indigo-400 dark:hover:text-indigo-600">
                        💾 Export
                    </button>
                </div>
            </div>
            <ColorPicker />
        </section>
    )
}
