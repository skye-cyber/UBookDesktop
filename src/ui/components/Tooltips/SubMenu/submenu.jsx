
export const ThemeSubmenu = ({ submenuref }) => {
    return (
        <div
            ref={submenuref}
            onMouseLeave={(e) => e.target.classList.add('hidden')}
            id="ltheme"
            className="sub-context-menu bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 absolute left-full top-0 ml-1 rounded-lg shadow-xl py-2 min-w-[160px] transform -translate-x-1 transition-all duration-200 border dark:border-gray-700 hidden">
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="themeLight">
                <span>Light</span>
            </div>
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="themeSepia">
                <span>Sepia</span>
            </div>
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="themeDark">
                <span>Dark</span>
            </div>
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="themeNight">
                <span>Night Mode</span>
            </div>
        </div>
    )
}

export const FontSubmenu = ({ submenuref }) => {
    return (
        <div
            ref={submenuref}
            onMouseLeave={(e) => e.currentTarget.classList.add('hidden')}
            className="sub-context-menu hidden bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 absolute left-full top-0 ml-1 rounded-lg shadow-xl py-2 min-w-[160px] transform -translate-x-1 transition-all duration-200 border dark:border-gray-700 select-none">
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="fontSmall">
                <span>Small</span>
            </div>
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="fontMedium">
                <span>Medium</span>
            </div>
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="fontLarge">
                <span>Large</span>
            </div>
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="fontXLarge">
                <span>Extra Large</span>
            </div>
        </div>)
}

export const HightlightSubmenu = ({ submenuref }) => {
    return (
        <div
            ref={submenuref}
            onMouseLeave={(e) => e.currentTarget.classList.add('hidden')}
            className="sub-context-menu absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-xl py-2 min-w-[160px] transform -translate-x-1 transition-all duration-200 dark:border border-gray-700 hidden select-none">
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="highlightYellow">
                <div className="w-4 h-4 bg-yellow-300 rounded mr-3"></div>
                <span>Yellow</span>
            </div>
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="highlightGreen">
                <div className="w-4 h-4 bg-green-300 rounded mr-3"></div>
                <span>Green</span>
            </div>
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" data-action="highlightBlue">
                <div className="w-4 h-4 bg-blue-300 rounded mr-3"></div>
                <span>Blue</span>
            </div>
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="highlightPink">
                <div className="w-4 h-4 bg-pink-300 rounded mr-3"></div>
                <span>Pink</span>
            </div>
            <div className="border-t border-gray-700 my-1"></div>
            <div className="sub-context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer select-none" data-action="removeHighlight">
                <svg className="h-7 w-7 fill-gray-400 dark:fill-gray-50 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M210.5 480L333.5 480L398.8 414.7L225.3 241.2L98.6 367.9L210.6 479.9zM256 544L210.5 544C193.5 544 177.2 537.3 165.2 525.3L49 409C38.1 398.1 32 383.4 32 368C32 352.6 38.1 337.9 49 327L295 81C305.9 70.1 320.6 64 336 64C351.4 64 366.1 70.1 377 81L559 263C569.9 273.9 576 288.6 576 304C576 319.4 569.9 334.1 559 345L424 480L544 480C561.7 480 576 494.3 576 512C576 529.7 561.7 544 544 544L256 544z" /></svg>
                <span className="text-sm">Remove Highlight</span>
            </div>
        </div>
    )
}

export const T = ({ }) => {
    return (<></>)
}
