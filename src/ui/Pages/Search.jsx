import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StateManager } from '../../common/syscore/StatesManager';
import { loadingspinner } from '../components/StatusUI/Helpers/loader';
import { waitForElement } from '../../common/syscore/dom_utils';
import { ContentLoader_ins } from '../components/Panels/content_loader';
import { BaseSearchEntry } from './Search/search_entry';

export const SearchResultPage = ({ }) => {
    const resultRef = useRef(null);
    const resultContainer = useRef(null);
    const searchQuery = useRef(null);
    const resultTotal = useRef(null);
    const loadMoreBtn = useRef(null);

    // Pagination state
    const [searchState, setSearchState] = useState({
        currentQuery: '',
        allResults: [],
        displayedResults: 0,
        totalResult: 0,
        hasMore: false,
        isLoadingMore: false
    });

    const showSearchResult = useCallback(() => {
        resultContainer.current.classList.remove('translate-y-[100vh]')
        resultContainer.current.classList.add('translate-y-0')
    })

    const hideSearchResult = useCallback(() => {
        resultContainer.current.classList.add('translate-y-[100vh]')
        resultContainer.current.classList.remove('translate-y-0')
    })

    const clearSearchResult = useCallback((content = "") => {
        resultRef.current.innerHTML = content
    })

    const prepSearchPage = useCallback((query, total, results = []) => {
        // clear first
        clearSearchResult()

        const hasMore = total > 10
        const initialDisplay = Math.min(total, 10) // Initial display limit


        searchQuery.current.textContent = query;

        // Update pagination state
        setSearchState({
            currentQuery: query,
            allResults: results,
            displayedResults: initialDisplay,
            hasMore: hasMore,
            isLoadingMore: false,
            totalResult: total
        });

        if (resultTotal.current) {
            resultTotal.current.textContent = `${initialDisplay} of ${total}`;
        }

        // Show/hide load more button
        if (loadMoreBtn.current) {
            loadMoreBtn.current.style.display = hasMore ? 'block' : 'none';
        }
    })

    StateManager.set('clearSearchResult', clearSearchResult)
    StateManager.set('prepSearchPage', prepSearchPage)
    StateManager.set('showSearchResult', showSearchResult)
    StateManager.set('hideSearchResult', hideSearchResult)

    const loadMoreResults = useCallback(() => {
        if (searchState.isLoadingMore || !searchState.hasMore) return;

        setSearchState(prev => ({ ...prev, isLoadingMore: true }));

        // Use current state values for calculations
        const currentDisplayed = searchState.displayedResults;
        const totalResults = searchState.allResults.length;
        const newDisplayed = Math.min(currentDisplayed + 10, totalResults);

        setSearchState(prev => ({
            ...prev,
            displayedResults: newDisplayed,
            hasMore: totalResults > newDisplayed,
            isLoadingMore: false
        }));

        BaseSearchEntry.renderTextSearchResult(searchState.allResults, searchState.currentQuery, { start: currentDisplayed, end: newDisplayed })

        // Update the "showing X of Y" text
        if (resultTotal.current) {
            resultTotal.current.textContent = `${newDisplayed} of ${totalResults}`;
        }

        // Show/hide load more button
        if (loadMoreBtn.current) {
            loadMoreBtn.current.style.display = newDisplayed < totalResults ? 'block' : 'none';
        }
    }, [searchState])

    useEffect(() => {
        document.addEventListener('showSearchResult', showSearchResult)
        document.addEventListener('hideSearchResult', hideSearchResult)
        document.addEventListener('escape-key-down', hideSearchResult)
        return () => {
            document.removeEventListener('showSearchResult', showSearchResult)
            document.removeEventListener('hideSearchResult', hideSearchResult)
            document.removeEventListener('escape-key-down', hideSearchResult)
        }
    })

    return (
        <div ref={resultContainer} id="search-result-container" className="fixed inset-0 flex items-center justify-center p-4 bg-black/20 backdrop-brightness-100 translate-y-[100vh] z-50 transition-all duration-300">
            <div className="bg-[#1d0066] dark:bg-[#0e0e2c] rounded-lg border border-[#4800ff] dark:border-purple-600 shadow-lg max-w-full lg:max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-300 font-reader shadow-lg shadow-primary-950">
                {/* Header */}
                <div className="flex justify-between items-center p-3 bg-[#1d0066] dark:bg-[#0e0e2c] border-b border-[#4800ff]/80 dark:border-[#8a2be2]/70">
                    <h2 className="text-xl font-mono font-semibold text-white">Search Result:<span className="text-[#5555ff]">?</span><span ref={searchQuery} id="search-query" className="max-w-[30%] rounded-md text-[#5555ff] underline overflow-x-hidden text-sm truncate"></span></h2>
                    <p ref={resultTotal} className="font-bold text-white">{searchState.displayedResults}<span id="result-total" className="font-semibold text-[#0097d3]">/</span>{searchState.totalResult}</p>
                    <button
                        id="closeModalBtn"
                        onClick={hideSearchResult}
                        aria-label="Close modal"
                        className="text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 transition text-2xl font-bold leading-none">&times;</button>
                </div>
                {/* Content scrollable */}
                <div
                    ref={resultRef}
                    data-portal-container="searchResult"
                    id="searchResult"
                    className="p-6 overflow-y-auto bg-[#160041] dark:bg-slate-950 space-y-4 flex-1 text-gray-100 text-sm sm:text-base scrollbar-custom">
                    <p className="text-lg text-center text-[#5555ff] font-semibold">No Results</p>
                    {/* Dynamic content inserted here */}
                </div>
                {/* Footer */}
                <div className="p-2 border-t bg-[#1d0066] dark:bg-[#0e0e2c] border-[#4800fd] dark:border-[#4800fd] text-right">
                    <div className="flex justify-between items-center">
                        <div>
                            <button
                                ref={loadMoreBtn}
                                onClick={loadMoreResults}
                                className="px-4 py-2 bg-[#2a5c8a] dark:bg-[#1a3c5a] hover:bg-[#3a6c9a] text-white rounded transition-all duration-300 hover:scale-[1.02] hover:translate-y-[3px] in-expo out-expo focus:outline-none"
                                style={{ display: 'none' }}>
                                {searchState.isLoadingMore ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                        <button
                            id="closeModalBtn2"
                            onClick={hideSearchResult}
                            className="px-4 py-2 bg-[#5555ff] dark:bg-[#28287f] hover:bg-[#3333a2] text-white rounded transition-all duration-300 hover:scale-[1.02] hover:translate-y-[3px] in-expo out-expo">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const ResultCard = ({ result, highlightedContent, count, link_data }) => {
    const part_id_map = {
        0: 'Foreword',
        1: 'SuperUniverse',
        2: 'LocalUniverse',
        3: 'HistoryOfUrantia',
        4: 'JesusTeachings'
    }

    const openSearchContent = useCallback(() => {
        //console.log(`Find: ${link_data.part_id}-${link_data.paper_id}-${link_data.section_number}`)

        /*
         * STEP1: Prepare part content
         * true no items interface display
         */
        ContentLoader_ins[`set${part_id_map[link_data.part_id]}`](true)

        // closeResult page
        StateManager.get('hideSearchResult')()

        // Given the page time to animate out
        setTimeout(() => {
            loadingspinner.open('Loading section, please wait...')

            //STEP3: find and click right section
            let ready = false
            waitForElement(`[data-tag="${link_data.part_id}-${link_data.paper_id}-${link_data.section_number}"]`, (e) => {
                e.click()
                ready = true
            })
            if (ready) loadingspinner.close();
        }, 300)

    })

    return (
        <section>
            <div className="relative mt-1 mb-1">
                <button className="flex absolute -left-5 -top-6 px-2 py-0.5 w-fit h-fit rounded-full items-center justify-center bg-green-500 dark:bg-green-600 text-white">{count}</button>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-x-2 gap-y-3">
                <dt className="font-semibold">Part:</dt><dd className="font-normal">{result.part_id}: {result.part_title}</dd>
                <dt className="font-semibold">Paper:</dt><dd>{result.paper_id}: {result.paper_title}</dd>
                <dt className="font-semibold">Section:</dt><dd>{result.section_number}: {result.section_title}</dd>
                <dt className="font-semibold">Paragraph Number:</dt><dd>{result.paragraph_number}</dd>
                <dt className="font-semibold">Score:</dt><dd>{result.score.toFixed(3)}</dd>
                <dt className="font-semibold"><button className="text-slate-200 dark:text-white hover:scale-[1.05] hover:translate-y-[6px] transform transition-transform transition-translate duration-300 rounded-lg shadow-lg shadow-[#341055] bg-[#3f3fbf] dark:bg-[#1e1e5d] p-2" onClick={openSearchContent}>Open</button></dt>
            </dl>
            <hr className="my-4 border-gray-300 dark:border-gray-600" />
            <p id={`search-${result.part_id}-${result.paper_id}-${result.section_number}`} className='whitespace-pre-line leading-relaxed' dangerouslySetInnerHTML={{ __html: highlightedContent }}></p>
            <p className="mb-2 p-0.5 bg-[#0071a6]"></p>
        </section >
    )
}
