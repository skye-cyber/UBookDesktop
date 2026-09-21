import { useCallback, useEffect, useRef } from 'react';
import { ChangeFontName, FontSizeManager_ins } from './font_manager';
import { BookNavigator } from './navigator';
import { ThemeManager } from './theme_manager';
import { StateManager } from '../../../common/syscore/StatesManager';
import { appState } from '../../State/appState';

export const SelectChevron = ({ className = '' }) => (
    <svg
        className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5
        text-gray-500 dark:text-slate-400 ${className}`}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M5 7.5l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/**
 * Shared select styling.
 *
 * Light theme:
 *   - surface matches the page's white background
 *   - border is a soft gray so the field reads as part of the bar, not a chip
 *   - focus ring uses the app's blue accent
 * Dark theme:
 *   - surface is gray-950 to match the bar itself
 *   - border is a slightly lighter gray for definition
 */
const selectClass =
    'appearance-none pr-7 pl-3 py-1.5 text-sm rounded-md ' +
    'bg-white dark:bg-gray-950 ' +
    'text-gray-800 dark:text-slate-100 ' +
    'border border-gray-200 dark:border-gray-800 ' +
    'hover:border-gray-300 dark:hover:border-gray-700 ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 ' +
    'transition-colors duration-200';

/** Small pill that groups the A-/A/A+ buttons. */
const fontSizePill =
    'flex items-center gap-2 px-2 py-1 rounded-md ' +
    'bg-gray-100 dark:bg-gray-900 ' +
    'border border-gray-200 dark:border-gray-800';

/** Consistent typography for the "Font Size:", "Font:", "Theme:" labels. */
const labelClass = 'text-xs font-medium text-gray-500 dark:text-slate-400';

/** Nav arrow buttons share this base; color comes from the gradient on the SVG. */
const navBtnClass =
    'flex items-center justify-center h-9 w-9 rounded-md ' +
    'hover:bg-gray-100 dark:hover:bg-gray-900 ' +
    'active:scale-95 ' +
    'transition-all duration-200';

export const Controls = ({ }) => {
    const controlBar = useRef<HTMLDivElement | null>(null);
    const themeRef = useRef<HTMLSelectElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const fontRef = useRef<HTMLSelectElement | null>(null);
    const ttsModel = useRef<HTMLSelectElement | null>(null);

    const readerTopPanelToggle = useCallback(() => {
        const focused = StateManager.get('focusMode');
        panelRef.current?.classList.toggle('hidden', !focused);
    }, []);

    const UpdateToobarTheme = useCallback((theme: string) => {
        if (themeRef.current) themeRef.current.value = theme;
    }, []);

    StateManager.set('UpdateToolbarTheme', UpdateToobarTheme);

    useEffect(() => {
        StateManager.set('ttsModel', ttsModel);
        StateManager.set('readerTopPanelToggle', readerTopPanelToggle);

        document.addEventListener('toggle-reader-top-panel', readerTopPanelToggle);

        return () => {
            document.removeEventListener('toggle-reader-top-panel', readerTopPanelToggle);
            StateManager.set('readerTopPanelToggle', null);
        };
    }, [readerTopPanelToggle]);

    return (
        <div ref={panelRef} id="top-utils-panel" className="select-none w-full">
            {/*
                Control bar.
                - Light: white surface, hairline bottom border, no top border so it
                merges into the white page above it.
                - Dark: gray-950 surface (same as the reader bg), so it disappears
                into the surrounding panel; a faint top border adds just enough
                definition to separate from the header.
                */}
            <div
                ref={controlBar}
                id="controlbar-utils"
                className="flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 bg-white dark:bg-gray-950 text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-gray-800 shadow-[0_1px_0_0_rgba(0,0,0,0.02)] dark:shadow-none"
            >
                {/* Previous section */}
                <button
                    onClick={() => BookNavigator.previousSection()}
                    aria-label="Previous Chapter"
                    title="Previous Chapter"
                    className={navBtnClass}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="gradPrev" x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#48fa83" />
                                <stop offset="100%" stopColor="#2abda2" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M16 4l-8 8 8 8"
                            fill="none"
                            stroke="url(#gradPrev)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {/* Center group — font size, font, theme */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Font size */}
                    <div className="flex items-center gap-2">
                        <span className={labelClass}>Font Size</span>
                        <div className={fontSizePill}>
                            <button
                                className="text-xs font-medium text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-1"
                                onClick={() => FontSizeManager_ins.changeFontSize(-1)}
                                aria-label="Decrease font size"
                            >
                                A-
                            </button>
                            <button
                                className="text-sm font-semibold text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-1"
                                onClick={() => FontSizeManager_ins.resetFontSize()}
                                aria-label="Reset font size"
                            >
                                A
                            </button>
                            <button
                                className="text-base font-bold text-gray-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 px-1"
                                onClick={() => FontSizeManager_ins.changeFontSize(1)}
                                aria-label="Increase font size"
                            >
                                A+
                            </button>
                        </div>
                    </div>

                    {/* Font family */}
                    <div className="hidden sm:flex items-center gap-2">
                        <span className={labelClass}>Font</span>
                        <div className="relative">
                            <select
                                ref={fontRef}
                                defaultValue={'normal'}
                                id="fontSelector"
                                className={selectClass}
                                onChange={(e) => { ChangeFontName(e.currentTarget.value); }}
                                aria-label="Font family"
                            >
                                {appState.reader.Fonts.map((font, key) => (
                                    <option key={key} value={font.value}>{font.label}</option>
                                ))}
                            </select>
                            <SelectChevron />
                        </div>
                    </div>

                    {/* Theme */}
                    <div className="hidden sm:flex items-center gap-2">
                        <span className={labelClass}>Theme</span>
                        <div className="relative">
                            <select
                                ref={themeRef}
                                defaultValue={'light'}
                                id="themeSelector"
                                className={selectClass}
                                onChange={(e) => ThemeManager.changeTheme(e.currentTarget.value)}
                                aria-label="Reader theme"
                            >
                                {appState.reader.Themes.map((theme, key) => (
                                    <option key={key} value={theme.value}>{theme.label}</option>
                                ))}
                            </select>
                            <SelectChevron />
                        </div>
                    </div>
                </div>

                {/* TTS model — right-aligned on md+ */}
                <div className="hidden md:flex items-center gap-2">
                    <span className={labelClass}>TTS</span>
                    <div className="relative">
                        <select
                            ref={ttsModel}
                            defaultValue={'picowave'}
                            className={`${selectClass} font-mono tracking-tight`}
                            aria-label="TTS model"
                        >
                            <option value="picowave">Robotic (fast)</option>
                            <option value="ttskit3">Natural (slow)</option>
                        </select>
                        <SelectChevron />
                    </div>
                </div>

                {/* Next section */}
                <button
                    onClick={() => BookNavigator.nextSection()}
                    aria-label="Next Chapter"
                    title="Next Chapter"
                    className={navBtnClass}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="gradNext" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4facfe" />
                                <stop offset="100%" stopColor="#00f2fe" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M8 4l8 8-8 8"
                            fill="none"
                            stroke="url(#gradNext)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};
