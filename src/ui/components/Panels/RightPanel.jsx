import React, { useState, useCallback, useEffect } from 'react';


export const RightPanel = ({ }) => {
    return (
        <section id="RightpanelMask" className="bg-slate-700/20 backdrop-blur-sm translate-x-full xl:translate-x-0 mt-[8vh] w-fit fixed right-0 transform transition-all duration-700 ease-in-out z-[40] hover:bg-slate-700/30">
            <div id="Rightpanel" className="relative w-[21.9vw] h-[calc(100vh-7vh)] shadow-2xl transform translate-x-0 transition-all duration-700 ease-in-out bg-gradient-to-b from-white/95 to-gray-100/95 dark:from-gray-900/95 dark:to-gray-800/95 rounded-l-2xl border-l border-t border-b border-white/30 dark:border-gray-600/30">
                <span onClick="hideRightPane()" className="absolute top-2 right-2 text-gray-200 dark:text-sky-500 text-2xl cursor-pointer hover:rotate-45 transition-transform duration-500">&times;</span>
                <div id="quick-acsess-head" className="flex w-full p-4 text-white dark:text-gray-200 bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-amber-900 dark:to-orange-900 select-none rounded-tl-2xl shadow-inner">
                    <h3 className="text-lg font-semibold tracking-wide">Quick Access</h3>
                </div>

                <section id="quick-acsess-container" className="h-fit pb-[16vh] max-h-[84vh] overflow-y-auto select-text bg-gradient-to-b from-blue-50/80 to-blue-100/80 dark:invert rounded-[8px] m-2 transform transition-all duration-700 font-reader scrollbar-custom border border-white/50 shadow-inner">
                </section>

                {/*<!-- Tooltip Menu -->*/}
                <div id="rightpanel-tooltip-menu"
                    className="absolute hidden -translate-x-[200%] bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 border border-gray-600 dark:border-gray-300 text-sm rounded-2xl shadow-2xl px-4 py-3 z-50 transition-all duration-300 opacity-0 backdrop-blur-sm">

                    <div id="tooltip-row" className="flex-row justify-start gap-2">
                        <div className="flex flex-wrap gap-3 w-fit space-x-3 mb-2">
                            <button onClick="handleCopy()" className="hover:text-blue-300 dark:hover:text-blue-600 transition-all duration-200 hover:scale-105 p-2 rounded-lg hover:bg-white/10">
                                <p className="flex space-x-1 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-6 fill-none stroke-green-500 hover:stroke-green-400 mr-1 transition-all" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                    <span className="font-medium">Copy</span>
                                </p>
                            </button>
                            <button onClick="handleWebSearch()" className="hover:text-green-300 dark:hover:text-green-600 transition-all duration-200 hover:scale-105 p-2 rounded-lg hover:bg-white/10 font-medium">
                                🔍 Search
                            </button>
                            <button onClick="handleSaveNote()" className="hover:text-yellow-300 dark:hover:text-yellow-600 transition-all duration-200 hover:scale-105 p-2 rounded-lg hover:bg-white/10 font-medium">
                                💾 Save
                            </button>
                            <button onClick="handleHighlight()" className="hover:text-yellow-400 dark:hover:text-yellow-600 transition-all duration-200 hover:scale-105 p-2 rounded-lg hover:bg-white/10 font-medium">
                                🖊️ Highlight
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3 w-fit space-x-3 pt-3 border-t border-gray-500/50 dark:border-gray-400/50">
                            <button onClick="showColorPicker()" className="flex items-center hover:text-purple-400 dark:hover:text-purple-600 transition-all duration-200 hover:scale-105 p-2 rounded-lg hover:bg-white/10">
                                <span id="current-color-circle" className="size-6 rounded-full bg-yellow-300 dark:bg-yellow-500 mr-2 border-2 border-white shadow-lg transition-transform hover:scale-110"></span>
                                <span className="font-medium">Color</span>
                            </button>
                            <button onClick="handleReadAloud()" className="hover:text-pink-400 dark:hover:text-pink-600 transition-all duration-200 hover:scale-105 p-2 rounded-lg hover:bg-white/10 font-medium">
                                🔊 Read Aloud
                            </button>
                            <button onClick="handleExport()" className="hover:text-indigo-400 dark:hover:text-indigo-600 transition-all duration-200 hover:scale-105 p-2 rounded-lg hover:bg-white/10 font-medium">
                                📤 Export
                            </button>
                        </div>
                    </div>

                    <div id="color-picker-right"
                        className="absolute hidden top-full mt-2 bg-white/95 dark:bg-gray-800/95 border border-gray-300 dark:border-gray-600 p-3 rounded-xl shadow-2xl z-50 flex gap-3 backdrop-blur-sm">
                        <div onClick="setHighlightColor('yellow')"
                            className="size-7 bg-yellow-400 dark:bg-yellow-600 rounded-full cursor-pointer hover:scale-125 transition-all duration-200 border-2 border-white shadow-lg hover:shadow-xl"></div>
                        <div onClick="setHighlightColor('blue')"
                            className="size-7 bg-blue-400 dark:bg-blue-600 rounded-full cursor-pointer hover:scale-125 transition-all duration-200 border-2 border-white shadow-lg hover:shadow-xl"></div>
                        <div onClick="setHighlightColor('pink')"
                            className="size-7 bg-pink-400 dark:bg-pink-600 rounded-full cursor-pointer hover:scale-125 transition-all duration-200 border-2 border-white shadow-lg hover:shadow-xl"></div>
                        <div onClick="setHighlightColor('green')"
                            className="size-7 bg-green-400 dark:bg-green-500 rounded-full cursor-pointer hover:scale-125 transition-all duration-200 border-2 border-white shadow-lg hover:shadow-xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};
