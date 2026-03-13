import { useCallback, useEffect, useRef, useState } from 'react';
import { loadingspinner } from '../components/StatusUI/Helpers/loader';
import { StateManager } from '../../common/syscore/StatesManager';
import { BaseSearchEntry } from './Search/search_entry';
import { settingsManager } from '../../common/syscore/SettingsManager';

export const SearchSettings = () => {
    const prefContainer = useRef(null);
    const backdrop = useRef(null);
    const part1 = useRef(null);
    const part2 = useRef(null);
    const part3 = useRef(null);
    const part4 = useRef(null);
    const part5 = useRef(null);
    const allParts = useRef(null);
    const search_mode_ref = useRef(null);
    const [searchMode, setSearchMode] = useState(null)

    // Load saved preferences
    useEffect(() => {
        const settings = settingsManager.getAll();
        if (settings.search) {
            // Apply saved defaults
            search_mode_ref.current.value = settings.search.defaultMode;

            // Set checkboxes based on saved defaults
            const defaultParts = settings.search.defaultParts || [1, 2, 3, 4, 5];
            part1.current.checked = defaultParts.includes(1);
            part2.current.checked = defaultParts.includes(2);
            part3.current.checked = defaultParts.includes(3);
            part4.current.checked = defaultParts.includes(4);
            part5.current.checked = defaultParts.includes(5);

            // Update "all" checkbox
            allParts.current.checked = defaultParts.length === 5;
        } else {
            search_mode_ref.current.value = 'text'
        }
        setSearchMode(search_mode_ref.current.value)
    }, []);

    const openPage = useCallback(() => {
        backdrop.current.classList.remove('hidden');
        prefContainer.current.classList.remove('hidden', 'translate-y-[100vh]');
        prefContainer.current.classList.add('translate-y-0');
    }, []);

    const closePage = useCallback(() => {
        prefContainer.current.classList.add('translate-y-[100vh]');
        prefContainer.current.classList.remove('translate-y-0');
        backdrop.current.classList.add('hidden');

        setTimeout(() => {
            prefContainer.current.classList.add('hidden');
        }, 700);
    }, []);

    const applysearch = useCallback(async () => {
        closePage();

        // clear previous search result
        StateManager.get('clearSearchResult')();

        await loadingspinner.open('Searching, please wait ...');

        setTimeout(async () => {
            const searchInput = StateManager.get('searchInput');
            const query = searchInput.value;

            // Clear Input
            searchInput.value = '';

            let parts = [];

            if (part1.current.checked) parts.push(1);
            if (part2.current.checked) parts.push(2);
            if (part3.current.checked) parts.push(3);
            if (part4.current.checked) parts.push(4);
            if (part5.current.checked) parts.push(5);

            if (parts.length === 5) parts = ["_all_"];

            // Save these preferences for next time
            if (parts.length > 0 && parts[0] !== "_all_") {
                settingsManager.set('search', 'defaultParts', parts);
            }

            let result;

            try {
                result = await (search_mode_ref.current.value === 'text'
                    ? BaseSearchEntry.fullTextSearch(parts, query)
                    : BaseSearchEntry.sectionSearch(parts, query));

            } finally {
                try {
                    loadingspinner.close();
                    if (result && search_mode_ref.current.value === 'text') {
                        StateManager.get('showSearchResult')();
                    }
                } catch (err) { }
            }
        }, 200);
    }, [closePage]);

    StateManager.set('applysearch', applysearch);

    const toggleFullSearch = useCallback(() => {
        const all_on = allParts.current.checked;
        part1.current.checked = all_on;
        part2.current.checked = all_on;
        part3.current.checked = all_on;
        part4.current.checked = all_on;
        part5.current.checked = all_on;
    }, []);

    useEffect(() => {
        allParts.current.addEventListener('click', toggleFullSearch);
        document.addEventListener('open-search-settings', openPage);
        document.addEventListener('hide-search-settings', closePage);
        document.addEventListener('escape-key-down', closePage);

        return () => {
            document.removeEventListener('open-search-settings', openPage);
            document.removeEventListener('hide-search-settings', closePage);
            document.removeEventListener('escape-key-down', closePage);
        };
    }, [openPage, closePage, toggleFullSearch]);

    const switchSearchMode = useCallback((value) => {
        search_mode_ref.current.value = value
        setSearchMode(value)
    })
    return (
        <div>
            {/* Backdrop */}
            <div
                ref={backdrop}
                onClick={closePage}
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
                        onClick={closePage}
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
                                onClick={() => switchSearchMode('text')}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-none ${searchMode === 'text'
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                                    }`}
                            >
                                <div className={`text-3xl mb-2 ${searchMode === 'text' ? 'hue-rotate-180 text-primary-600' : 'hue-rotate-90 text-slate-400'
                                    }`}>🔤</div>
                                <div className={`font-medium ${searchMode === 'text' ? 'text-primary-400' : 'text-slate-500'
                                    }`}>Full Text</div>
                                <div className="text-xs text-slate-400 mt-1">Search in all content</div>
                            </button>
                            <button
                                onClick={() => switchSearchMode('titles')}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-none ${searchMode === 'titles'
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                                    }`}
                            >
                                <div className={`text-3xl mb-2 ${searchMode === 'titles' ? 'hue-rotate-90 text-primary-600' : 'text-slate-400'
                                    }`}>📑</div>
                                <div className={`font-medium ${searchMode === 'titles' ? 'text-primary-400' : 'text-slate-500'
                                    }`}>Section Titles</div>
                                <div className="text-xs text-slate-400 mt-1">Search only headings</div>
                            </button>
                        </div>
                        <select ref={search_mode_ref} className="hidden" defaultValue="text">
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
                                        onChange={toggleFullSearch}
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
                            onClick={closePage}
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
