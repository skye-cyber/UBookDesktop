import { useCallback, useEffect, useRef } from 'react';
import { useTheme } from '../Themes/useThemeHeadless';
import { StateManager } from '../../../common/syscore/StatesManager';

export const Header = ({ }) => {
    let searchContainer = useRef(null)
    const searchInput = useRef(null)

    const { isDark, setTheme } = useTheme();

    useEffect(() => {
        if (!searchInput) return
        StateManager.set('searchInput', searchInput.current)
    })

    const ToggleBookContentPanel = useCallback(() => {
        document.dispatchEvent(new CustomEvent('toggle-left-panel'))
    })

    //     const ToggleSearchBar = useCallback(() => {
    //         if (!searchContainer) searchContainer = document.getElementById('search-container')
    //
    //         searchContainer.current.classList.toggle('opacity-0');
    //         searchContainer.current.classList.toggle('opacity-100');
    //         searchContainer.current.classList.toggle('pointer-events-none');
    //     })

    const ShowSearchResult = useCallback(() => {
        document.dispatchEvent(new CustomEvent('showSearchResult'))
    })

    //     const openSearchPref = useCallback(() => {
    //         document.dispatchEvent(new CustomEvent('open-search-settings'))
    //     })

    const OpenSettings = useCallback(() => {
        document.dispatchEvent(new CustomEvent('open-settings'))
    })

    //     const CloseSettings = useCallback(() => {
    //         document.dispatchEvent(new CustomEvent('open-settings'))
    //     })

    /**
     * Clears the interface of all distracting ui for distraction free reading
     */
    const focusModeToggle = useCallback(() => {
        const focused = StateManager.get('focusMode')

        document.dispatchEvent(new CustomEvent('focusMode'))

        StateManager.get('readerTopPanelToggle')()
        StateManager.set('focusMode', !focused)
    })

    const handle_enterKey = useCallback((e) => {
        if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) StateManager.get('applysearch')()
    })

    useEffect(() => {
        searchInput.current.addEventListener('keyup', handle_enterKey)
        StateManager.subscribe('theme', setTheme)
        return () => {
            StateManager.unsubscribe('theme', setTheme)
            searchInput.current.removeEventListener('keyup', handle_enterKey)
        }
    })

    return (
        <header className="flex items-center px-4 bg-indigo-800 dark:bg-[#00657c] dark:border-y dark:border-t-0 dark:border-b-[#006d91] backdrop-blur-lg shadow-sm dark:border-b dark:border-slate-200/60 dark:border-slate-700/60 z-[40] transition-all duration-500">
            {/* Left Section: Hamburger Menu */}
            <section className="relative flex items-center select-none">
                <button onClick={ToggleBookContentPanel} id="book-content-panel" className="flex flex-col justify-center items-center h-10 w-10 rounded-lg bg-[#160041] dark:bg-[#004754] dark:hover:bg-[#002d34] hover:bg-[#270075] transition-all duration-300 focus:outline-none focus:ring-none hover:scale-[90%] ease-in-out">
                    <span className="w-5 h-0.5 bg-white dark:bg-slate-200 mb-1.5 rounded-full transition-all duration-300"></span>
                    <span className="w-5 h-0.5 bg-white dark:bg-slate-200 mb-1.5 rounded-full transition-all duration-300"></span>
                    <span className="w-5 h-0.5 bg-white dark:bg-slate-200 rounded-full transition-all duration-300"></span>
                </button>
            </section>

            {/* Center Section: Search Bar */}
            <div ref={searchContainer} id="search-bar-container" className="relative flex-1 p-1 mx-4 md:mx-[10vw] lg:mx-[20vw] transition-all duration-500 w-full">
                <div className="relative">
                    <input ref={searchInput} id="searchInput" type="text" autoFocus placeholder="Search..." className="w-full pl-10 pr-12 py-3 bg-indigo-950/40 dark:bg-[#004351] rounded-xl text-white placeholder-gray-100/90 dark:placeholder-primary-100 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 border border-indigo-950 dark:border-[#00d4ff] transition-all duration-300 selection:bg-[#55ffff]/20" />

                    {/* Search Icon */}
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-white">
                        <svg className="h-5 w-5 fill-slate-100 dark:fill-current text-white dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
                        </svg>
                    </div>

                    {/* Submit Search Button */}
                    <button onClick={() => StateManager.get('applysearch')()} id="submit-search" title="submit-search" aria-label="submit-search" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-all duration-300 focus:ring-none hover:scale-[90%] ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="h-5 w-5 fill-current text-white dark:text-slate-200">
                            <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex items-center space-x-3">
                {/* Search Preferences Button */}
                <button onClick={OpenSettings} title="Open Search Preferences" aria-label="Open Search Preferences focus:outline-none"
                    className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-600 dark:bg-[#004754] dark:hover:bg-[#002d34] text-white shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 ease-in-out focus:outline-none ring-none focus:ring-none hover:scale-[90%]">
                    <svg className="h-5 w-5 fill-current text-white dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 128C78.3 128 64 142.3 64 160C64 177.7 78.3 192 96 192L182.7 192C195 220.3 223.2 240 256 240C288.8 240 317 220.3 329.3 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L329.3 128C317 99.7 288.8 80 256 80C223.2 80 195 99.7 182.7 128L96 128zM96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L342.7 352C355 380.3 383.2 400 416 400C448.8 400 477 380.3 489.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L489.3 288C477 259.7 448.8 240 416 240C383.2 240 355 259.7 342.7 288L96 288zM96 448C78.3 448 64 462.3 64 480C64 497.7 78.3 512 96 512L150.7 512C163 540.3 191.2 560 224 560C256.8 560 285 540.3 297.3 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L297.3 448C285 419.7 256.8 400 224 400C191.2 400 163 419.7 150.7 448L96 448z" /></svg>
                </button>

                {/* Theme Toggle (Optional) */}
                <button
                    id="top-theme-toggle"
                    title="switch theme"
                    aria-label='switch theme'
                    onClick={() => setTheme(isDark ? 'light' : 'dark')} className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-500 dark:bg-[#004754] hover:bg-primary-700 dark:hover:bg-[#002d34] text-slate-700 dark:text-slate-300 transition-all duration-300 focus:outline-none hover:scale-[90%] ease-in-out">
                    <svg className="dark:hidden h-5 w-5 fill-white dark:fill-current text-white dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C388.8 576 451.3 548.8 497.3 504.6C504.6 497.6 506.7 486.7 502.6 477.5C498.5 468.3 488.9 462.6 478.8 463.4C473.9 463.8 469 464 464 464C362.4 464 280 381.6 280 280C280 207.9 321.5 145.4 382.1 115.2C391.2 110.7 396.4 100.9 395.2 90.8C394 80.7 386.6 72.5 376.7 70.3C358.4 66.2 339.4 64 320 64z" />
                    </svg>
                    <svg className="hidden dark:block h-5 w-5 fill-current text-white dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M210.2 53.9C217.6 50.8 226 51.7 232.7 56.1L320.5 114.3L408.3 56.1C415 51.7 423.4 50.9 430.8 53.9C438.2 56.9 443.4 63.5 445 71.3L465.9 174.5L569.1 195.4C576.9 197 583.5 202.4 586.5 209.7C589.5 217 588.7 225.5 584.3 232.2L526.1 320L584.3 407.8C588.7 414.5 589.5 422.9 586.5 430.3C583.5 437.7 576.9 443.1 569.1 444.6L465.8 465.4L445 568.7C443.4 576.5 438 583.1 430.7 586.1C423.4 589.1 414.9 588.3 408.2 583.9L320.4 525.7L232.6 583.9C225.9 588.3 217.5 589.1 210.1 586.1C202.7 583.1 197.3 576.5 195.8 568.7L175 465.4L71.7 444.5C63.9 442.9 57.3 437.5 54.3 430.2C51.3 422.9 52.1 414.4 56.5 407.7L114.7 320L56.5 232.2C52.1 225.5 51.3 217.1 54.3 209.7C57.3 202.3 63.9 196.9 71.7 195.4L175 174.6L195.9 71.3C197.5 63.5 202.9 56.9 210.2 53.9zM239.6 320C239.6 275.6 275.6 239.6 320 239.6C364.4 239.6 400.4 275.6 400.4 320C400.4 364.4 364.4 400.4 320 400.4C275.6 400.4 239.6 364.4 239.6 320zM448.4 320C448.4 249.1 390.9 191.6 320 191.6C249.1 191.6 191.6 249.1 191.6 320C191.6 390.9 249.1 448.4 320 448.4C390.9 448.4 448.4 390.9 448.4 320z" />
                    </svg>
                </button>

                {/* More Options Button */}
                <button
                    onClick={ShowSearchResult}
                    title='search toggle'
                    aria-label='search toggle'
                    id="search-toggle"
                    className="flex space-x-1 justify-center items-center h-10 w-10 rounded-xl bg-primary-500 dark:bg-[#003c47] hover:bg-primary-600 dark:hover:bg-[#002d34] text-white dark:text-slate-300 transition-all duration-300 focus:outline-none hover:scale-[90%] ease-in-out">
                    <div className='block -mb-1'>
                        <p className='bg-white py-2 px-[0.6px] rounded-md -mb-2'></p>
                        <div className='rotate-90 mt-[2px]'>
                            <p className='bg-white py-[2.5px] px-[0.7px] rounded-md -rotate-45'></p>
                            <p className='bg-white py-[2.5px] px-[0.7px] rounded-md rotate-45'></p>
                        </div>
                    </div>
                    <div className='block space-y-[3.2px]'>
                        <p className='bg-white w-fit py-[1.3px] px-3 rounded-md'></p>
                        <p className='bg-white w-fit py-[1.3px] px-2 rounded-md'></p>
                        <p className='bg-white w-fit py-[1.3px] px-2 rounded-md'></p>
                        <p className='bg-white w-fit py-[1.3px] px-3 rounded-md'></p>
                    </div>
                </button>

                {/* Clear interface (focus mode) new*/}
                <button onClick={focusModeToggle} className='max-sm:hidden flex space-x-1 justify-center items-center h-10 w-10 bg-primary-500 dark:bg-[#004754] dark:hover:bg-[#002d34]  hover:bg-primary-600 hover:scale-[90%] ease-in-out p-1.5 rounded-xl text-white transition-all duration-300 focus:outline-none'>
                    <svg className='h-6 w-6' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 7V4h3"></path>
                        <path d="M20 7V4h-3"></path>
                        <path d="M4 17v3h3"></path>
                        <path d="M20 17v3h-3"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </div>
        </header >
    );
};
