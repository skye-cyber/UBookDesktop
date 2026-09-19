import { useCallback, useEffect, useRef } from 'react';
import { ChangeFontName, FontSizeManager_ins } from './font_manager';
import { BookNavigator } from './navigator';
import { ThemeManager } from './theme_manager';
import { StateManager } from '../../../common/syscore/StatesManager';
import { appState } from '../../State/appState';

const SelectChevron = ({ className = '' }) => (
    <svg
        className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 dark:text-slate-400 ${className}`}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// shared select styling — keep in one place so all three stay in sync
const selectClass =
    "appearance-none pr-6 bg-gray-200 dark:bg-slate-700 text-sm border border-gray-300 dark:border-slate-600 rounded py-1 pl-2 " +
    "text-gray-800 dark:text-slate-100 " +
    "hover:border-primary-300 dark:hover:border-primary-500/60 " +
    "focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:focus:ring-primary-400/40 " +
    "transition-colors duration-200";

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
        <div ref={panelRef} id="top-utils-panel" className="select-none w-full">
            {/* Controls Bar */}
            <div
                ref={controlBar}
                id="controlbar-utils"
                className="flex flex-wrap items-center justify-between bg-white dark:bg-[#3b3b3b] dark:text-white rounded-lg shadow-sm px-0 rounded-none border-b-2 border-t border-blue-500 border-t-[#534afd] dark:border-b-blue-500 dark:border-t-zinc-800"
            >
                {/* Navigate to previous section */}
                <button
                    onClick={() => BookNavigator.previousSection()}
                    aria-label="Previous Chapter"
                    title="Previous Chapter"
                    className="flex items-center justify-center rounded-lg hover:bg-fuchsia-200 dark:hover:bg-slate-700/60 transition-colors duration-500"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        <span className="text-sm text-gray-600 dark:text-slate-300">Font Size:</span>
                        <div className="flex space-x-3 bg-gray-200 dark:bg-slate-700 dark:text-slate-100 font-semibold px-1 py-1 rounded border border-transparent dark:border-slate-600">
                            <button className="text-xs hover:text-primary-600 dark:hover:text-primary-400" onClick={() => FontSizeManager_ins.changeFontSize(-1)}>A-</button>
                            <button className="text-sm font-semibold hover:text-primary-600 dark:hover:text-primary-400" onClick={() => FontSizeManager_ins.resetFontSize()}>A</button>
                            <button className="text-base font-bold hover:text-primary-600 dark:hover:text-primary-400" onClick={() => FontSizeManager_ins.changeFontSize(1)}>A+</button>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center space-x-1">
                        <span className="text-sm text-gray-600 dark:text-slate-300">Font:</span>
                        <div className="relative">
                            <select
                                ref={fontRef}
                                defaultValue={'normal'}
                                id="fontSelector"
                                className={selectClass}
                                onChange={(e) => { ChangeFontName(e.currentTarget.value) }}
                            >
                                {appState.reader.Fonts.map((font, key) => (
                                    <option key={key} value={font.value}>{font.label}</option>
                                ))}
                            </select>
                            <SelectChevron />
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center space-x-1">
                        <span className="text-sm text-gray-600 dark:text-slate-300">Theme:</span>
                        <div className="relative">
                            <select
                                ref={themeRef}
                                defaultValue={'light'}
                                id="themeSelector"
                                className={selectClass}
                                onChange={(e) => ThemeManager.changeTheme(e.currentTarget.value)}
                            >
                                {appState.reader.Themes.map((theme, key) => (
                                    <option key={key} value={theme.value}>{theme.label}</option>
                                ))}
                            </select>
                            <SelectChevron />
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-1">
                    <span className="text-sm text-gray-600 dark:text-slate-300">TTS Model:</span>
                    <div className="relative">
                        <select
                            ref={ttsModel}
                            defaultValue={'picowave'}
                            className={`${selectClass} font-mono font-bold tracking-tightest`}
                        >
                            <option value="picowave">Robotic (fast)</option>
                            <option value="ttskit3">Natural (slow)</option>
                        </select>
                        <SelectChevron />
                    </div>
                </div>

                {/* Navigate to next section */}
                <button
                    onClick={() => BookNavigator.nextSection()}
                    aria-label="Next Chapter"
                    title="Next Chapter"
                    className="flex items-center justify-center hover:bg-blue-200 dark:hover:bg-slate-700/60 rounded-lg transition-colors duration-500"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="gradNext" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4facfe" />
                                <stop offset="100%" stopColor="#00f2fe" />
                            </linearGradient>
                        </defs>
                        <path d="M8 4l8 8-8 8" fill="none" stroke="url(#gradNext)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    )

}
