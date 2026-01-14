import React, { useCallback, useEffect, useRef } from 'react';
import { StateManager } from '../../renderer/js/syscore/StatesManager';
import { loadingspinner } from '../components/StatusUI/Helpers/loader';

export const SearchResultPage = ({ }) => {
    const resultRef = useRef(null);
    const resultContainer = useRef(null);
    const searchQuery = useRef(null);
    const resultTotal = useRef(null);

    const showSearchResult = useCallback(() => {
        resultContainer.current.classList.remove('translate-y-[100vh]')
        resultContainer.current.classList.add('translate-y-0')
    })

    const hideSearchResult = useCallback(() => {
        resultContainer.current.classList.add('translate-y-[100vh]')
        resultContainer.current.classList.remove('translate-y-0')
    })

    const prepSearchPage = useCallback((query, total) => {
        resultRef.current.innerHTML = ""
        searchQuery.current.textContent = query;
        resultTotal.current.textContent = total;
    })

    StateManager.set('prepSearchPage', prepSearchPage)
    StateManager.set('showSearchResult', showSearchResult)

    useEffect(() => {
        document.addEventListener('showSearchResult', showSearchResult)
        document.addEventListener('hideSearchResult', hideSearchResult)
        return () => {
            document.removeEventListener('showSearchResult', showSearchResult)
            document.removeEventListener('hideSearchResult', hideSearchResult)
        }
    })

    return (
        <div ref={resultContainer} id="search-result-container" className="fixed inset-0 flex items-center justify-center p-4 bg-black/20 backdrop-brightness-100 translate-y-[100vh] z-50 transition-all duration-500">
            <div className="bg-[#1d0066] dark:bg-[#0e0e2c] rounded-lg border border-[#4800ff] dark:border-purple-600 shadow-lg max-w-full lg:max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-500 font-reader shadow-lg shadow-primary-950">
                {/* Header */}
                <div className="flex justify-between items-center p-3 bg-[#1d0066] dark:bg-[#0e0e2c] border-b border-[#4800ff]/80 dark:border-[#8a2be2]/70">
                    <h2 className="text-xl font-mono font-semibold text-white">Search Result:<span className="text-[#5555ff]">?</span><span ref={searchQuery} id="search-query" className="max-w-[30%] rounded-md text-[#5555ff] underline overflow-x-hidden text-sm truncate"></span></h2>
                    <p ref={resultTotal} className="font-bold text-white">Total: <span id="result-total" className="font-semibold text-[#0097d3]"></span></p>
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
                    className="p-6 overflow-y-auto bg-[#160041] dark:bg-slate-950 space-y-4 flex-1 text-gray-100 text-sm sm:text-base">
                    <p className="text-lg text-center text-[#5555ff] font-semibold">No Results</p>
                    {/* Dynamic content inserted here */}
                </div>
                {/* Footer */}
                <div className="p-2 border-t bg-[#1d0066] dark:bg-[#0e0e2c] border-[#4800fd] dark:border-[#4800fd] text-right">
                    <button
                        id="closeModalBtn2"
                        onClick={hideSearchResult}
                        className="px-4 py-2 bg-[#5555ff] dark:bg-[#28287f] hover:bg-[#3333a2] text-white rounded transition-all duration-300 hover:scale-[1.02] hover:translate-y-[3px] in-expo out-expo">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export const ResultCard = ({ result, highlightedContent, count, link_data }) => {
    const part_id_map = {
        0: 'foreword',
        1: 'central-and-superuniverse',
        2: 'local-universe',
        3: 'history-of-urantia',
        4: 'life-and-teachings-of-jesus'
    }

    console.log("Count", count)

    const openSearchContent = useCallback(() => {

        console.log(`Find: ${link_data.part_id}-${link_data.paper_id}-${link_data.section_number}`)

        //STEP1: Prepare part content
        document.getElementById(part_id_map[link_data.part_id])?.click()

        loadingspinner.show('Loading section, please wait...')

        //STEP3: find and click right section
        waitForElement(`[result-tag="${link_data.part_id}-${link_data.paper_id}-${link_data.section_number}"]`, (e) => {
            e.click()
            loadingspinner.close();
        })
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
