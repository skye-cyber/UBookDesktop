import React, { useCallback, useEffect, useRef } from 'react';
import { FontManager_ins } from './font';
import { BookNavigator } from './navigator';
import { ThemeManager } from './theme';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';

export const ReaderProgress = ({ progressRef = useRef(null), percentageRef = useRef(null) }) => {
    const controlBar = useRef(null)
    const panelRef = useRef(null)

    const toggleControlBar = useCallback(() => {
        controlBar.current.classList.toggle('hidden')
    })

    const readerTopPanelToggle = useCallback(() => {
        const focused = StateManager.get('focusMode')
        panelRef.current.classList.toggle('hidden', !focused)
    })

    useEffect(() => {
        //StateManager.set('toggleControlBar', toggleControlBar)
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
            <div ref={controlBar} id="controlbar-utils" className="bg-white dark:bg-[#3b3b3b] dark:text-white rounded-lg shadow-sm py-0 px-4 mb-0 flex flex-wrap items-center justify-between rounded-none border-b-2 border-blue-500 dark:border-blue-500">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-white">Font Size:</span>
                        <div className="flex space-x-4 bg-gray-200 dark:bg-zinc-600 dark:text-white font-semibold px-2 py-1 rounded">
                            <button className="text-xs" onClick={() => FontManager_ins.changeFontSize(-1)}>A-</button>
                            <button className="text-sm font-semibold" onClick={() => FontManager_ins.resetFontSize()}>A</button>
                            <button className="text-base font-bold" onClick={() => FontManager_ins.changeFontSize(1)}>A+</button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-white">Theme:</span>
                        <select id="themeSelector" className="bg-gray-200 dark:bg-zinc-600 text-sm border border-gray-800/0 dark:border-gray-800 rounded px-2 py-1 focus:ring-none focus:outline-none" onChange={(e) => ThemeManager.changeTheme(e.currentTarget.value)}>
                            <option value="sepia">Sepia</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="night">Night</option>
                        </select>
                    </div>
                </div>

                <div className="items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-white">TTS Model:</span>
                    <select
                        defaultValue={'picowave'}
                        id="tts-model-selector"
                        className="bg-gray-200 dark:bg-zinc-600 text-sm border dark:border-zinc-800/0 rounded px-2 py-1 font-mono font-bold tracking-tightest focus:ring-none focus:outline-none">
                        <option value="picowave">Robotic (fast)</option>
                        <option value="ttskit3">Natural (slow)</option>
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
