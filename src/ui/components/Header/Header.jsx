import React, { useCallback, useEffect, useRef } from 'react';
import { useTheme } from '../Themes/useThemeHeadless';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';

export const Header = ({ }) => {
    let searchContainer = useRef(null)
    const searchInput = useRef(null)

    const { isDark, toggleTheme, setTheme } = useTheme();

    useEffect(() => {
        if (!searchInput) return
        StateManager.set('searchInput', searchInput.current)
    })

    const ToggleBookContentPanel = useCallback(() => {
        document.dispatchEvent(new CustomEvent('toggle-left-panel'))
    })

    const ToggleSearchBar = useCallback(() => {
        if (!searchContainer) searchContainer = document.getElementById('search-container')

        searchContainer.current.classList.toggle('opacity-0');
        searchContainer.current.classList.toggle('opacity-100');
        searchContainer.current.classList.toggle('pointer-events-none');
    })

    const ShowSearchResult = useCallback(() => {
        document.dispatchEvent(new CustomEvent('showSearchResult'))
    })

    const openSearchPref = useCallback(() => {
        document.dispatchEvent(new CustomEvent('open-search-settings'))
    })

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
        return () => {
            searchInput.current.removeEventListener('keyup', handle_enterKey)
        }
    })

    return (
        <header className="flex items-center px-4 bg-indigo-800 dark:bg-[#00657c] dark:border-y dark:border-t-0 dark:border-b-[#006d91] backdrop-blur-lg shadow-sm dark:border-b dark:border-slate-200/60 dark:border-slate-700/60 z-[40] transition-all duration-500">
            {/* Left Section: Hamburger Menu */}
            <section className="relative flex items-center select-none">
                <button onClick={ToggleBookContentPanel} id="book-content-panel" className="flex flex-col justify-center items-center h-10 w-10 rounded-lg bg-[#160041] dark:bg-sky-500 hover:bg-[#270075] dark:hover:bg-sky-700 transition-colors duration-300 focus:outline-none focus:ring-none focus:ring-primary-500">
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
                    <button onClick={() => StateManager.get('applysearch')()} id="submit-search" title="submit-search" aria-label="submit-search" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="h-5 w-5 fill-current text-white dark:text-slate-200">
                            <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
                        </svg>
                    </button>


                    {/* Expand Search Button DEPRECATED */}
                    <span id="expand-search" className="hidden search-expand absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 rounded-lg bg-transparent hover:bg-slate-200 dark:hover:bg-[#00caf7] cursor-pointer transition-colors duration-300 hover:scale-[1.05]" onClick={ShowSearchResult} title="show previous section search results" aria-label="show previous section search results group">
                        <svg className="w-5 h-5 stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11 8V14M8 11H14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex items-center space-x-3">
                {/* Search Preferences Button */}
                <button onClick={openSearchPref} title="Open Search Preferences" aria-label="Open Search Preferences focus:outline-none"
                    className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 ease-in-out focus:outline-none ring-none focus:ring-none">
                    <svg className="h-5 w-5 fill-current text-white dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 128C78.3 128 64 142.3 64 160C64 177.7 78.3 192 96 192L182.7 192C195 220.3 223.2 240 256 240C288.8 240 317 220.3 329.3 192L544 192C561.7 192 576 177.7 576 160C576 142.3 561.7 128 544 128L329.3 128C317 99.7 288.8 80 256 80C223.2 80 195 99.7 182.7 128L96 128zM96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L342.7 352C355 380.3 383.2 400 416 400C448.8 400 477 380.3 489.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L489.3 288C477 259.7 448.8 240 416 240C383.2 240 355 259.7 342.7 288L96 288zM96 448C78.3 448 64 462.3 64 480C64 497.7 78.3 512 96 512L150.7 512C163 540.3 191.2 560 224 560C256.8 560 285 540.3 297.3 512L544 512C561.7 512 576 497.7 576 480C576 462.3 561.7 448 544 448L297.3 448C285 419.7 256.8 400 224 400C191.2 400 163 419.7 150.7 448L96 448z" /></svg>
                </button>

                {/* Theme Toggle (Optional) */}
                <button
                    id="top-theme-toggle"
                    title="switch theme"
                    aria-label='switch theme'
                    onClick={() => setTheme(isDark ? 'light' : 'dark')} className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-500 dark:bg-[#004754] hover:bg-primary-700 dark:hover:bg-[#002d34] text-slate-700 dark:text-slate-300 transition-colors duration-300 focus:outline-none">
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
                    className="flex space-x-1 justify-center items-center h-10 w-10 rounded-xl bg-primary-500 dark:bg-[#003c47] hover:bg-primary-600 dark:hover:bg-[#002d34] text-white dark:text-slate-300 transition-colors duration-300 focus:outline-none">
                    <div className='block -mb-1'>
                        <p className='bg-white py-2 px-[0.6px] rounded-md -mb-2'></p>
                        <div className='rotate-90 mt-[2px]'>
                            <p className='bg-white py-[2.5px] px-[0.7px] rounded-md -rotate-45'></p>
                            <p className='bg-white py-[2.5px] px-[0.7px] rounded-md rotate-45'></p>
                        </div>
                    </div>
                    <div className='block space-y-0.5'>
                        <p className='bg-white w-fit py-[1.4px] px-[12px] rounded-md'></p>
                        <p className='bg-white w-fit py-[1.5px] px-2 rounded-md'></p>
                        <p className='bg-white w-fit py-[1.5px] px-2 rounded-md'></p>
                        <p className='bg-white w-fit py-[1.8px] px-3 rounded-md'></p>
                    </div>
                </button>

                {/* clear interface */}
                <svg onClick={focusModeToggle} title="clear interface" aria-label="clear interface" className="hidden h-[38px] w-[38px] fill-primary-300 dark:fill-white cursor-pointer focus:outline-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM160 224L160 480L288 480L288 224L160 224zM480 224L352 224L352 480L480 480L480 224z" /></svg>
                <button onClick={focusModeToggle}>
                    <svg className="icon max-md:hidden h-[28px] w-[28px] fill-primary-300 dark:fill-white cursor-pointer" title="clear interface" aria-label="clear interface" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" data-rtl-flip="" ><path d="M6.83496 3.99992C6.38353 4.00411 6.01421 4.0122 5.69824 4.03801C5.31232 4.06954 5.03904 4.12266 4.82227 4.20012L4.62207 4.28606C4.18264 4.50996 3.81498 4.85035 3.55859 5.26848L3.45605 5.45207C3.33013 5.69922 3.25006 6.01354 3.20801 6.52824C3.16533 7.05065 3.16504 7.71885 3.16504 8.66301V11.3271C3.16504 12.2712 3.16533 12.9394 3.20801 13.4618C3.25006 13.9766 3.33013 14.2909 3.45605 14.538L3.55859 14.7216C3.81498 15.1397 4.18266 15.4801 4.62207 15.704L4.82227 15.79C5.03904 15.8674 5.31234 15.9205 5.69824 15.9521C6.01398 15.9779 6.383 15.986 6.83398 15.9902L6.83496 3.99992ZM18.165 11.3271C18.165 12.2493 18.1653 12.9811 18.1172 13.5702C18.0745 14.0924 17.9916 14.5472 17.8125 14.9648L17.7295 15.1415C17.394 15.8 16.8834 16.3511 16.2568 16.7353L15.9814 16.8896C15.5157 17.1268 15.0069 17.2285 14.4102 17.2773C13.821 17.3254 13.0893 17.3251 12.167 17.3251H7.83301C6.91071 17.3251 6.17898 17.3254 5.58984 17.2773C5.06757 17.2346 4.61294 17.1508 4.19531 16.9716L4.01855 16.8896C3.36014 16.5541 2.80898 16.0434 2.4248 15.4169L2.27051 15.1415C2.03328 14.6758 1.93158 14.167 1.88281 13.5702C1.83468 12.9811 1.83496 12.2493 1.83496 11.3271V8.66301C1.83496 7.74072 1.83468 7.00898 1.88281 6.41985C1.93157 5.82309 2.03329 5.31432 2.27051 4.84856L2.4248 4.57317C2.80898 3.94666 3.36012 3.436 4.01855 3.10051L4.19531 3.0175C4.61285 2.83843 5.06771 2.75548 5.58984 2.71281C6.17898 2.66468 6.91071 2.66496 7.83301 2.66496H12.167C13.0893 2.66496 13.821 2.66468 14.4102 2.71281C15.0069 2.76157 15.5157 2.86329 15.9814 3.10051L16.2568 3.25481C16.8833 3.63898 17.394 4.19012 17.7295 4.84856L17.8125 5.02531C17.9916 5.44285 18.0745 5.89771 18.1172 6.41985C18.1653 7.00898 18.165 7.74072 18.165 8.66301V11.3271ZM8.16406 15.995H12.167C13.1112 15.995 13.7794 15.9947 14.3018 15.9521C14.8164 15.91 15.1308 15.8299 15.3779 15.704L15.5615 15.6015C15.9797 15.3451 16.32 14.9774 16.5439 14.538L16.6299 14.3378C16.7074 14.121 16.7605 13.8478 16.792 13.4618C16.8347 12.9394 16.835 12.2712 16.835 11.3271V8.66301C16.835 7.71885 16.8347 7.05065 16.792 6.52824C16.7605 6.14232 16.7073 5.86904 16.6299 5.65227L16.5439 5.45207C16.32 5.01264 15.9796 4.64498 15.5615 4.3886L15.3779 4.28606C15.1308 4.16013 14.8165 4.08006 14.3018 4.03801C13.7794 3.99533 13.1112 3.99504 12.167 3.99504H8.16406C8.16407 3.99667 8.16504 3.99829 8.16504 3.99992L8.16406 15.995Z"></path>
                    </svg>
                </button>
            </div>
        </header >
    );
};
