import React, { useCallback, useEffect, useRef } from 'react';
import { ChangeFontName, FontSizeManager_ins } from './font_manager';
import { BookNavigator } from './navigator';
import { ThemeManager } from './theme_manager';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';

export const Controls = ({ }) => {
    const controlBar = useRef(null)
    const themeRef = useRef(null);
    const panelRef = useRef(null)
    const fontRef = useRef(null)
    const ttsModel = useRef(null)

    const readerTopPanelToggle = useCallback(() => {
        const focused = StateManager.get('focusMode')
        panelRef.current.classList.toggle('hidden', !focused)
    })

    const UpdateToobarTheme = useCallback((theme) => {
        themeRef.current.value = theme
    })

    StateManager.set('UpdateToolbarTheme', UpdateToobarTheme)

    useEffect(() => {
        StateManager.set('ttsModel', ttsModel)

        StateManager.set('readerTopPanelToggle', readerTopPanelToggle)
        document.addEventListener('toggle-reader-top-panel', readerTopPanelToggle)

        //document.addEventListener('controlBar-toggle', toggleControlBar)
        return () => {
            //document.removeEventListener('controlBar-toggle', toggleControlBar)
            document.removeEventListener('toggle-reader-top-panel', readerTopPanelToggle)
            //StateManager.set('toggleControlBar', null)
            StateManager.set('readerTopPanelToggle', null)
        }
    })//sticky -top-2 -mt-6 md:-mt-10 z-30
    return (
        <div ref={panelRef} id="top-utils-panel" className="select-none w-full" >
            {/* Controls Bar */}
            <div ref={controlBar} id="controlbar-utils" className="flex flex-wrap items-center justify-between bg-white dark:bg-[#3b3b3b] dark:text-white rounded-lg shadow-sm px-0 rounded-none border-b-2 border-t border-blue-500 border-t-[#534afd] dark:border-b-blue-500 dark:border-t-zinc-800">

                {/*Naviagte to previous section*/}
                <button onClick={() => BookNavigator.previousSection()} aria-label="Previous Chapter" title="Previous Chapter" className="flex items-center justify-center rounded-lg hover:bg-fuchsia-200 transition-colors duration-500">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="gradPrev" x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#48fa83" />
                                <stop offset="100%" stopColor="#2abda2" />
                            </linearGradient>
                        </defs>
                        <path d="M16 4l-8 8 8 8" fill="none" stroke="url(#gradPrev)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600 dark:text-white">Font Size:</span>
                        <div className="flex space-x-3 bg-gray-200 dark:bg-zinc-600 dark:text-white font-semibold px-1 py-1 rounded">
                            <button className="text-xs" onClick={() => FontSizeManager_ins.changeFontSize(-1)}>A-</button>
                            <button className="text-sm font-semibold" onClick={() => FontSizeManager_ins.resetFontSize()}>A</button>
                            <button className="text-base font-bold" onClick={() => FontSizeManager_ins.changeFontSize(1)}>A+</button>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center space-x-1">
                        <span className="text-sm text-gray-600 dark:text-white">Font:</span>
                        <select
                            ref={fontRef}
                            defaultValue={'normal'}
                            id="themeSelector"
                            className="bg-gray-200 dark:bg-zinc-600 text-sm border border-gray-800/0 dark:border-gray-800 rounded py-1 focus:ring-none focus:outline-none" onChange={(e) => {ChangeFontName(e.currentTarget.value)}}>
                            <option value="normal">Default</option>
                            <option value="handwriting">Handwriting</option>
                            <option value="mono">Mono</option>
                            <option value="brand">Brand</option>
                            <option value="elegant">Elegant</option>
                        </select>
                    </div>

                    <div className="hidden sm:flex items-center space-x-1">
                        <span className="text-sm text-gray-600 dark:text-white">Theme:</span>
                        <select
                            ref={themeRef}
                            defaultValue={'light'}
                            id="themeSelector"
                            className="bg-gray-200 dark:bg-zinc-600 text-sm border border-gray-800/0 dark:border-gray-800 rounded py-1 focus:ring-none focus:outline-none" onChange={(e) => ThemeManager.changeTheme(e.currentTarget.value)}>
                            <option value="sepia">Sepia</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="night">Night</option>
                        </select>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-1">
                    <span className="text-sm text-gray-600 dark:text-white">TTS Model:</span>
                    <select
                        ref={ttsModel}
                        defaultValue={'picowave'}
                        className="bg-gray-200 dark:bg-zinc-600 text-sm border dark:border-zinc-800/0 rounded py-1 font-mono font-bold tracking-tightest focus:ring-none focus:outline-none">
                        <option value="picowave">Robotic (fast)</option>
                        <option value="ttskit3">Natural (slow)</option>
                    </select>
                </div>

                {/*Naviagte to previous section*/}
                <button onClick={() => BookNavigator.nextSection()} aria-label="Next Chapter" title="Next Chapter" className="flex items-center justify-center hover:bg-blue-200 rounded-lg transition-colors duration-500">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="gradNext" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4facfe" />
                                <stop offset="100%" stopColor="#00f2fe" />
                            </linearGradient>
                        </defs>
                        <path d="M8 4l8 8-8 8"
                            fill="none"
                            stroke="url(#gradNext)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div >
    )

}
