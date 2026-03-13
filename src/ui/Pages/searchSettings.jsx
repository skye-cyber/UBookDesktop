import { useCallback, useEffect, useRef, useState } from 'react';
import { loadingspinner } from '../components/StatusUI/Helpers/loader';
import { StateManager } from '../../common/syscore/StatesManager';
import { BaseSearchEntry } from './Search/search_entry';

let call_count = 0

export const SearchSettings = ({ }) => {
    const prefContainer = useRef(null);
    const backdrop = useRef(null);
    const part1 = useRef(null);
    const part2 = useRef(null);
    const part3 = useRef(null);
    const part4 = useRef(null);
    const part5 = useRef(null);
    const allParts = useRef(null);
    const search_mode = useRef(null);

    const openPage = useCallback(() => {
        backdrop.current.classList.remove('hidden')
        prefContainer.current.classList.remove('hidden', 'translate-y-[100vh]')
        prefContainer.current.classList.add('translate-y-0')
    })

    const closePage = useCallback(() => {
        prefContainer.current.classList.add('translate-y-[100vh]')
        prefContainer.current.classList.remove('translate-y-0')
        backdrop.current.classList.add('hidden')

        setTimeout(() => {
            prefContainer.current.classList.add('hidden')
        }, 700)
    })

    const applysearch = useCallback(async () => {
        closePage()

        // clear previous search result
        StateManager.get('clearSearchResult')()

        const portalId = await loadingspinner.open('Searching, please wait ...')
        setTimeout(async () => {

            const searchInput = StateManager.get('searchInput')
            const query = searchInput.value

            // Clear Input
            searchInput.value = ''

            //const partmap = {part1: 1, }
            let parts = []

            if (part1.current.checked) parts.push(1)
            if (part2.current.checked) parts.push(2)
            if (part3.current.checked) parts.push(3)
            if (part4.current.checked) parts.push(4)
            if (part5.current.checked) parts.push(5)

            if (parts.length === 5) parts = ["_all_"]

            let result

            try {
                result = await (search_mode.current.value === 'text'
                    ? BaseSearchEntry.fullTextSearch(parts, query)
                    : BaseSearchEntry.sectionSearch(parts, query))

            } finally {
                try {
                    loadingspinner.close()
                    if (result && search_mode.current.value === 'text') StateManager.get('showSearchResult')()
                } catch (err) { }
            }
        }, 200)
    })

    StateManager.set('applysearch', applysearch)

    const toggle_all_parts = useCallback(() => {
        const all_on = allParts.current.checked
        part1.current.checked = all_on
        part2.current.checked = all_on
        part3.current.checked = all_on
        part4.current.checked = all_on
        part5.current.checked = all_on
    })

    useEffect(() => {
        allParts.current.addEventListener('click', toggle_all_parts)
        document.addEventListener('open-search-settings', openPage)
        document.addEventListener('hide-search-settings', closePage)
        document.addEventListener('escape-key-down', closePage)
        return () => {
            document.removeEventListener('show-search-settings', openPage)
            document.removeEventListener('search-settings', closePage)
            document.removeEventListener('escape-key-down', closePage)
        }
    })

    return (
        <div>
            <div ref={backdrop} className="fixed inset-0 z-[41] bg-black/50 backdrop-brightness-100 animate-fade-in hidden transition-all duration-500"></div>
            <section
                ref={prefContainer}
                id="search-pref"
                className="fixed inset-1 left-0 top-0 translate-x-[32vw] -translate-y-[110vh] rounded-2xl z-[60] w-fit h-fit min-w-[40vh] max-w-[80vw] max-h-[100vh] lg:max-w-[90vw] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden hidden animate-slide-in transition-all duration-300 select-none">

                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 relative">
                    {/* Close Button */}
                    <button id="close-pref"
                        onClick={closePage}
                        className="absolute top-4 right-4 text-xl text-white/80 hover:text-white transition-all duration-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white/20">
                        <i className="">&times;</i>
                    </button>

                    {/* Title */}
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <svg className="h-5 w-5 fill-slate-50 dark:fill-current text-xl text-white dark:text-slate-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Search Preferences
                        </h2>
                    </div>
                    <p className="text-primary-100 mt-2 text-sm">Customize your search parameters</p>
                </div>

                {/* Content */}
                <div id="search-pref-wrapper" className="p-6 overflow-y-auto max-h-[calc(100vh-110px)] scrollbar-custom">

                    {/* Search Type Option */}
                    <div className="mb-6">
                        <label className="block mb-3 font-semibold text-slate-700 dark:text-slate-200">Search Mode</label>
                        <div className="relative">
                            <select
                                ref={search_mode}
                                defaultValue={'text'}
                                id="search-mode"
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer">
                                <option value="text">Search in Text</option>
                                <option value="titles">Search in Section Titles</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                <svg className="h-5 w-5 fill-gray-50 rotate-360" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Search Scope Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
                            <svg className="h-6 w-6 fill-primary-600 dark:fill-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 128C83.1 128 71.4 135.8 66.4 147.8C61.4 159.8 64.2 173.5 73.4 182.6L256 365.3L256 480C256 488.5 259.4 496.6 265.4 502.6L329.4 566.6C338.6 575.8 352.3 578.5 364.3 573.5C376.3 568.5 384 556.9 384 544L384 365.3L566.6 182.7C575.8 173.5 578.5 159.8 573.5 147.8C568.5 135.8 556.9 128 544 128L96 128z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            Search Scope
                        </h3>
                    </div>

                    {/* Toggle All Switch */}
                    <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                        <span className="font-medium text-slate-700 dark:text-slate-200">Toggle All Parts</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input ref={allParts} type="checkbox" id="toggle-all" className="sr-only peer"></input>
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    {/* Switch-Style Checkboxes */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                            <div>
                                <span className="font-medium text-slate-800 dark:text-slate-100">1: Foreword</span>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Introduction and foundational concepts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input ref={part1} type="checkbox" name="part1" id="part1" className="part-toggle sr-only peer" defaultChecked={'true'} />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                            <div>
                                <span className="font-medium text-slate-800 dark:text-slate-100">2: Central & Superuniverse</span>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cosmic administration and universe structure</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input ref={part2} type="checkbox" name="part2" id="part2" className="part-toggle sr-only peer" defaultChecked={'true'} />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                            <div>
                                <span className="font-medium text-slate-800 dark:text-slate-100">3: Local Universe</span>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Nebadon and local universe affairs</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input ref={part3} type="checkbox" name="part3" id="part3" className="part-toggle sr-only peer" defaultChecked={'true'} />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                            <div>
                                <span className="font-medium text-slate-800 dark:text-slate-100">4: History of Urantia</span>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Earth's planetary history</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input ref={part4} type="checkbox" name="part4" id="part4" className="part-toggle sr-only peer" defaultChecked={'true'} />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                            <div>
                                <span className="font-medium text-slate-800 dark:text-slate-100">5: Life & Teachings of Jesus</span>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Michael bestowal on Urantia</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input ref={part5} type="checkbox" name="part5" id="part5" className="part-toggle sr-only peer" defaultChecked={'true'} />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button onClick={closePage} className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
                            Cancel
                        </button>
                        <button onClick={applysearch} className="flex-1 px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            <svg className="h-5 w-5 mr-3 fill-gray-400 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z" /></svg>
                            Apply Search
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}


// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { loadingspinner } from '../StatusUI/Helpers/loader';
// import { StateManager } from '../../../common/syscore/StatesManager';
// import { BaseSearchEntry } from './Search/search_entry';
import { settingsManager } from '../../common/syscore/SettingsManager';

export const SearchSettings_new = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [settings, setSettings] = useState(settingsManager.getAll().search);

    const prefContainer = useRef(null);
    const backdrop = useRef(null);
    const part1 = useRef(null);
    const part2 = useRef(null);
    const part3 = useRef(null);
    const part4 = useRef(null);
    const part5 = useRef(null);
    const allParts = useRef(null);
    const search_mode = useRef(null);

    // Subscribe to settings changes
    useEffect(() => {
        const unsubscribe = settingsManager.subscribe(newSettings => {
            setSettings(newSettings.search);
        });
        return unsubscribe;
    }, []);

    // Load saved preferences when component mounts
    useEffect(() => {
        if (settings) {
            search_mode.current.value = settings.defaultMode || 'text';

            const defaultParts = settings.defaultParts || [1, 2, 3, 4, 5];
            part1.current.checked = defaultParts.includes(1);
            part2.current.checked = defaultParts.includes(2);
            part3.current.checked = defaultParts.includes(3);
            part4.current.checked = defaultParts.includes(4);
            part5.current.checked = defaultParts.includes(5);

            allParts.current.checked = defaultParts.length === 5;
        }
    }, [settings]);

    // Animation control
    useEffect(() => {
        if (isVisible) {
            backdrop.current?.classList.remove('hidden');
            prefContainer.current?.classList.remove('hidden');
            // Force reflow
            void prefContainer.current?.offsetHeight;
            prefContainer.current?.classList.add('translate-y-0');
            prefContainer.current?.classList.remove('-translate-y-[110vh]');
        } else {
            prefContainer.current?.classList.add('-translate-y-[110vh]');
            prefContainer.current?.classList.remove('translate-y-0');
            setTimeout(() => {
                backdrop.current?.classList.add('hidden');
                prefContainer.current?.classList.add('hidden');
            }, 300);
        }
    }, [isVisible]);

    // Event listeners
    useEffect(() => {
        const openHandler = () => setIsVisible(true);
        const closeHandler = () => setIsVisible(false);

        document.addEventListener('open-search-settings', openHandler);
        document.addEventListener('hide-search-settings', closeHandler);
        document.addEventListener('escape-key-down', closeHandler);

        return () => {
            document.removeEventListener('open-search-settings', openHandler);
            document.removeEventListener('hide-search-settings', closeHandler);
            document.removeEventListener('escape-key-down', closeHandler);
        };
    }, []);

    const toggle_all_parts = useCallback(() => {
        const all_on = allParts.current.checked;
        [part1, part2, part3, part4, part5].forEach(part => {
            part.current.checked = all_on;
        });
    }, []);

    const applysearch = useCallback(async () => {
        setIsVisible(false);

        // Get current selections
        const mode = search_mode.current.value;
        const parts = [];
        if (part1.current.checked) parts.push(1);
        if (part2.current.checked) parts.push(2);
        if (part3.current.checked) parts.push(3);
        if (part4.current.checked) parts.push(4);
        if (part5.current.checked) parts.push(5);

        const searchParts = parts.length === 5 ? ["_all_"] : parts;

        // Save preferences to SettingsManager
        await settingsManager.update('search', {
            defaultMode: mode,
            defaultParts: parts
        });

        // Clear previous search result
        StateManager.get('clearSearchResult')?.();

        const searchInput = StateManager.get('searchInput');
        const query = searchInput?.value || '';

        // Clear input
        if (searchInput) searchInput.value = '';

        if (!query.trim()) return;

        const portalId = await loadingspinner.open('Searching, please wait ...');

        try {
            // Small delay to allow loading spinner to render
            await new Promise(resolve => setTimeout(resolve, 200));

            const result = mode === 'text'
                ? await BaseSearchEntry.fullTextSearch(searchParts, query)
                : await BaseSearchEntry.sectionSearch(searchParts, query);

            if (result && mode === 'text') {
                StateManager.get('showSearchResult')?.();
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            loadingspinner.close();
        }
    }, []);

    // Register with StateManager
    useEffect(() => {
        StateManager.set('applysearch', applysearch);
        return () => StateManager.delete('applysearch');
    }, [applysearch]);

    return (
        <div>
            {/* Backdrop */}
            <div
                ref={backdrop}
                onClick={() => setIsVisible(false)}
                className="fixed inset-0 z-[60] bg-black/50 backdrop-brightness-sm hidden transition-all duration-300"
            ></div>

            {/* Settings Panel */}
            <section
                ref={prefContainer}
                className="fixed left-1/2 top-1/5 -translate-x-1/2 -translate-y-[110vh] z-[61] w-[90vw] max-w-2xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden hidden transition-all duration-300 ease-out"
            >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 relative">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 z-10 text-3xl text-white/80 hover:text-white transition-all duration-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20"
                        aria-label="Close"
                    >
                        &times;
                    </button>

                    {/* Title Section */}
                    <div className="relative p-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Search Preferences
                                </h2>
                                <p className="text-primary-100 mt-1 text-sm">
                                    Customize how you search through The Urantia Book
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="h-1 bg-white/20">
                        <div className="w-1/3 h-full bg-white/40 rounded-r-full"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-custom">
                    {/* Search Mode Selection */}
                    <div className="mb-8">
                        <label className="block mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Search Mode
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => search_mode.current.value = 'text'}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${search_mode.current?.value === 'text'
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                                    }`}
                            >
                                <div className={`text-3xl mb-2 ${search_mode.current?.value === 'text' ? 'text-primary-600' : 'text-slate-400'
                                    }`}>🔤</div>
                                <div className={`font-medium ${search_mode.current?.value === 'text' ? 'text-primary-700' : 'text-slate-600'
                                    }`}>Full Text</div>
                                <div className="text-xs text-slate-500 mt-1">Search in all content</div>
                            </button>
                            <button
                                onClick={() => search_mode.current.value = 'titles'}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${search_mode.current?.value === 'titles'
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                                    }`}
                            >
                                <div className={`text-3xl mb-2 ${search_mode.current?.value === 'titles' ? 'text-primary-600' : 'text-slate-400'
                                    }`}>📑</div>
                                <div className={`font-medium ${search_mode.current?.value === 'titles' ? 'text-primary-700' : 'text-slate-600'
                                    }`}>Section Titles</div>
                                <div className="text-xs text-slate-500 mt-1">Search only headings</div>
                            </button>
                        </div>
                        <select ref={search_mode} className="hidden" defaultValue="text">
                            <option value="text">Full Text</option>
                            <option value="titles">Section Titles</option>
                        </select>
                    </div>

                    {/* Search Scope */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Search Scope
                            </label>

                            {/* Toggle All Switch */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Select All</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        ref={allParts}
                                        type="checkbox"
                                        className="sr-only peer"
                                        onChange={toggle_all_parts}
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* Part Selection Cards */}
                        <div className="space-y-3">
                            {[
                                { ref: part1, num: 1, title: 'Foreword', desc: 'Introduction and foundational concepts', icon: '🌟' },
                                { ref: part2, num: 2, title: 'Central & Superuniverse', desc: 'Cosmic administration and universe structure', icon: '🌌' },
                                { ref: part3, num: 3, title: 'Local Universe', desc: 'Nebadon and local universe affairs', icon: '🌠' },
                                { ref: part4, num: 4, title: 'History of Urantia', desc: 'Earth\'s planetary history', icon: '🌍' },
                                { ref: part5, num: 5, title: 'Life & Teachings of Jesus', desc: 'The Michael bestowal on Urantia', icon: '✝️' }
                            ].map(part => (
                                <div
                                    key={part.num}
                                    className="group relative flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="text-2xl">{part.icon}</div>
                                        <div>
                                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                                {part.num}: {part.title}
                                            </span>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                                {part.desc}
                                            </p>
                                        </div>
                                    </div>

                                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                                        <input
                                            ref={part.ref}
                                            type="checkbox"
                                            className="sr-only peer"
                                            defaultChecked={true}
                                            onChange={() => {
                                                // Update "all" checkbox state
                                                const allChecked = [
                                                    part1.current.checked,
                                                    part2.current.checked,
                                                    part3.current.checked,
                                                    part4.current.checked,
                                                    part5.current.checked
                                                ].every(Boolean);
                                                allParts.current.checked = allChecked;
                                            }}
                                        />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 group-hover:shadow-lg"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search Statistics */}
                    <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-slate-600 dark:text-slate-400">Papers: 196</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-slate-600 dark:text-slate-400">Sections: 2,455</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span className="text-slate-600 dark:text-slate-400">Paragraphs: 15,000+</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={applysearch}
                            className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                        >
                            <svg className="h-5 w-5 text-white/90 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                            <span>Apply Search</span>
                            <span className="text-xs opacity-75 ml-2">(Enter)</span>
                        </button>
                    </div>

                    {/* Quick tip */}
                    <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
                        💡 Tip: You can also press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-xs">Ctrl/Cmd + K</kbd> to open search
                    </p>
                </div>
            </section>
        </div>
    );
};
