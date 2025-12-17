import React from 'react';

export const ReaderProgress = ({ }) => {
    return (
        < div id="top-utils-panel" className="sticky -top-2 -mt-6 md:-mt-10 z-30 select-none w-full" >
            <div id="progressbar" className="flex items-center bg-stone-600 w-full dark:bg-zinc-800 backdrop-blur-md py-0 px-6 md:px-10 border-gray-500 dark:border-sky-500">
                <button onClick="previousSection()" aria-label="Previous Chapter" title="Previous Chapter" className="flex items-center justify-center px-1 rounded-lg hover:bg-fuchsia-200 mr-1 transition-colors duration-500">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="gradPrev" x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#48fa83" />
                                <stop offset="100%" stop-color="#2abda2" />
                            </linearGradient>
                        </defs>
                        <path d="M16 4l-8 8 8 8" fill="none" stroke="url(#gradPrev)" stroke-Width="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="w-full bg-gray-300 dark:bg-white rounded-full h-2 overflow-hidden">
                    <div id="reading-progress-bar"
                        className="bg-blue-500 dark:bg-green-400 h-full w-0 transition-all duration-200"></div>
                </div>
                <p id="read-percentage" className="bg-stone-950 text-gray-100 dark:text-slate-100 mx-1 rounded-sm">%</p>
                <button onClick="ReadAllAloud()" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-hue-rotate-90 dark:hover:bg-sky-900 rounded-full px-1 transition-colors duration-500 focus:ring-none focus:outline-none" aria-label="Read aloud" title="Read aloud">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-black dark:stroke-blue-100 hover:stroke-green-300 dark:hover:stroke-orange-400 transition-colors duration-500" fill="none" stroke-Width="2"
                        strokeLinecap="round" strokeLinejoininejoin="round" viewBox="0 0 24 24">
                        <path d="M3 11v2a1 1 0 0 0 1 1h2l4 5V5L6 10H4a1 1 0 0 0-1 1z" />
                        <path d="M14 9a3 3 0 0 1 0 6" />
                        <path d="M18 7a7 7 0 0 1 0 10" />
                    </svg>
                </button>
                <button onClick="nextSection()" aria-label="Next Chapter" title="Next Chapter" className="flex items-center justify-center p-1 hover:bg-blue-200 rounded-lg transition-colors duration-500">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="gradNext" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#4facfe" />
                                <stop offset="100%" stop-color="#00f2fe" />
                            </linearGradient>
                        </defs>
                        <path d="M8 4l8 8-8 8"
                            fill="none"
                            stroke="url(#gradNext)"
                            stroke-Width="2"
                            strokeLinecap="round"
                            strokeLinejoininejoin="round" />
                    </svg>
                </button>
            </div>
            {/* Controls Bar */}
            <div id="controlbar-utils" className="bg-white dark:bg-fuchsia-950 dark:text-white rounded-lg shadow-sm py-0.5 px-4 mb-1 flex flex-wrap items-center justify-between rounded-none">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-white">Font Size:</span>
                        <div className="flex space-x-1">
                            <button className="text-xs font-semibold px-2 py-1 bg-gray-200 dark:bg-slate-900 dark:text-white rounded" onClick="changeFontSize(-1)">A-</button>
                            <button className="text-sm font-semibold px-2 py-1 bg-gray-200 dark:bg-slate-900 dark:text-white rounded" onClick="resetFontSize()">A</button>
                            <button className="text-base font-bold px-2 py-1 bg-gray-200 dark:bg-slate-900 dark:text-white rounded" onClick="changeFontSize(1)">A+</button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-white">Theme:</span>
                        <select id="themeSelector" className="text-sm border dark:border-zinc-900 dark:bg-slate-900 rounded px-2 py-1 focus:ring-none focus:outline-none" onchange="changeTheme(this.value)">
                            <option value="sepia">Sepia</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="night">Night</option>
                        </select>
                    </div>
                </div>

                <div className="items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-white">TTS Model:</span>
                    <select id="tts-model-selector" className="text-sm border dark:border-zinc-800 dark:bg-gray-700 rounded px-2 py-1 font-mono font-bold tracking-tightest focus:ring-none focus:outline-none">
                        <option value="picowave" selected>Default (fast-robotic)</option>
                        <option value="ttskit3">ttskit3 (slow-natural)</option>
                    </select>
                </div>
                <div className="hidden flex items-center space-x-2">
                    <span id="wordCount" className="text-sm text-gray-600 dark:text-white">Words: 0</span>
                    <span id="bookmarkCount" className="hidden text-sm text-gray-600 dark:text-white">Bookmarks: 0</span>
                </div>
            </div>
        </div >
    )

}
