import React from 'react';

export const SearchResultPage = ({ }) => {
    return (
        <div id="search-modal" className="fixed inset-0 flex items-center justify-center p-4 backdrop-brightness-50 translate-y-[100vh] z-50 transition-all duration-500">
            <div className="bg-[#1d0066] dark:bg-[#0e0e2c] rounded-lg border border-[#4800ff] dark:border-purple-600 shadow-lg max-w-full lg:max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-colors duration-500 font-reader shadow-lg shadow-primary-950">
                {/* Header */}
                <div className="flex justify-between items-center p-3 bg-[#1d0066] dark:bg-[#0e0e2c] border-b border-[#4800ff]/80 dark:border-[#8a2be2]/70">
                    <h2 className="text-xl font-mono font-semibold text-white">Search Result:<span className="text-[#5555ff]">?</span><span id="search-query" className="max-w-[30%] rounded-md text-[#5555ff] underline overflow-x-hidden text-ellipsis"></span></h2>
                    <p className="font-bold text-white">Total: <span id="result-total" className="font-semibold text-[#0097d3]"></span></p>
                    <button id="closeModalBtn" aria-label="Close modal" className="text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 transition text-2xl font-bold leading-none">&times;</button>
                </div>
                {/* Content scrollable */}
                <div id="SearchModalContent" className="p-6 overflow-y-auto bg-[#160041] dark:bg-slate-950 space-y-4 flex-1 text-gray-100 text-sm sm:text-base">
                    <p className="text-lg text-center text-[#5555ff] font-semibold">No Results</p>
                    {/* Dynamic content inserted here */}
                </div>
                {/* Footer */}
                <div className="p-2 border-t bg-[#1d0066] dark:bg-[#0e0e2c] border-[#4800fd] dark:border-[#4800fd] text-right">
                    <button id="closeModalBtn2" className="px-4 py-2 bg-[#5555ff] dark:bg-[#28287f] hover:bg-[#3333a2] text-white rounded transition-all duration-300 hover:scale-[1.02] hover:translate-y-[3px] in-expo out-expo">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
