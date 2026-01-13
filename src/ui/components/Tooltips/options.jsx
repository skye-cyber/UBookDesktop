import { useRef } from 'react';
import { ContentLoader_ins } from '../Panels/BookContentPanel';
import { menuaction } from './Helpers/action';
import {
    ThemeSubmenu,
    FontSubmenu,
    HightlightSubmenu,
    SelectionSubmenu
} from './SubMenu/submenu';

export const SelectionOption = ({ autohide, selectoption }) => {
    const submenuref = useRef(null)

    return (
        <div
            ref={selectoption}
            onMouseEnter={() => {
                autohide()
                submenuref.current.classList.remove('hidden')
            }}
            className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer relative font-mono select-none" data-action="fontSize">
            <svg className="h-7 w-7 fill-gray-400 dark:fill-white mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M72 96C49.9 96 32 113.9 32 136L32 192C32 209.7 46.3 224 64 224C81.7 224 96 209.7 96 192L96 160L160 160L160 480L128 480C110.3 480 96 494.3 96 512C96 529.7 110.3 544 128 544L256 544C273.7 544 288 529.7 288 512C288 494.3 273.7 480 256 480L224 480L224 160L288 160L288 192C288 209.7 302.3 224 320 224C337.7 224 352 209.7 352 192L352 136C352 113.9 334.1 96 312 96L72 96zM470.6 425.4C458.1 412.9 437.8 412.9 425.3 425.4C412.8 437.9 412.8 458.2 425.3 470.7L489.3 534.7C501.8 547.2 522.1 547.2 534.6 534.7L598.6 470.7C611.1 458.2 611.1 437.9 598.6 425.4C586.1 412.9 565.8 412.9 553.3 425.4L543.9 434.8L543.9 205.3L553.3 214.7C565.8 227.2 586.1 227.2 598.6 214.7C611.1 202.2 611.1 181.9 598.6 169.4L534.6 105.4C528.6 99.4 520.5 96 512 96C503.5 96 495.4 99.4 489.4 105.4L425.4 169.4C412.9 181.9 412.9 202.2 425.4 214.7C437.9 227.2 458.2 227.2 470.7 214.7L480.1 205.3L480.1 434.8L470.7 425.4z" /></svg>
            <span className="flex justify-between items-center w-full">Selection
                <svg className="h-5 w-5 fill-gray-400 dark:fill-gray-50 -rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" /></svg>
            </span>

            {/* Font Size Submenu */}
            <SelectionSubmenu submenuref={submenuref} autohide={autohide} />
            <div className="border-t border-gray-700 my-1"></div>

        </div>
    )
}

export const NoteOption = ({ }) => {
    return (
        <div onClick={()=> document.dispatchEvent(new CustomEvent('OpenNotesComposer'))} className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" data-action="notes">
            <svg className="h-5 w-5 mr-3 fill-gray-400 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M160 544C124.7 544 96 515.3 96 480L96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 373.5C544 390.5 537.3 406.8 525.3 418.8L418.7 525.3C406.7 537.3 390.4 544 373.4 544L160 544zM485.5 368L392 368C378.7 368 368 378.7 368 392L368 485.5L485.5 368z" /></svg>
            <span>Custom Notes</span>
        </div>
    )
}
export const DictionaryOption = ({ }) => {
    return (
        <div onClick={()=>menuaction.dictionaryLookup()} className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" data-action="dictionary">
            <svg className="h-5 w-5 mr-3 fill-gray-400 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 576L192 576C139 576 96 533 96 480L96 160C96 107 139 64 192 64L496 64C522.5 64 544 85.5 544 112L544 400C544 420.9 530.6 438.7 512 445.3L512 512C529.7 512 544 526.3 544 544C544 561.7 529.7 576 512 576L480 576zM192 448C174.3 448 160 462.3 160 480C160 497.7 174.3 512 192 512L448 512L448 448L192 448zM224 216C224 229.3 234.7 240 248 240L424 240C437.3 240 448 229.3 448 216C448 202.7 437.3 192 424 192L248 192C234.7 192 224 202.7 224 216zM248 288C234.7 288 224 298.7 224 312C224 325.3 234.7 336 248 336L424 336C437.3 336 448 325.3 448 312C448 298.7 437.3 288 424 288L248 288z" /></svg>
            <span>Lookup Dictionary</span>
        </div>
    )
}
export const PrintOption = ({ autohide }) => {
    return (
        <div onMouseEnter={() => autohide()} className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" data-action="print">
            <svg className="h-5 w-5 mr-3 fill-gray-400 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M128 128C128 92.7 156.7 64 192 64L405.5 64C422.5 64 438.8 70.7 450.8 82.7L493.3 125.2C505.3 137.2 512 153.5 512 170.5L512 208L128 208L128 128zM64 320C64 284.7 92.7 256 128 256L512 256C547.3 256 576 284.7 576 320L576 416C576 433.7 561.7 448 544 448L512 448L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 448L96 448C78.3 448 64 433.7 64 416L64 320zM192 480L192 512L448 512L448 416L192 416L192 480zM520 336C520 322.7 509.3 312 496 312C482.7 312 472 322.7 472 336C472 349.3 482.7 360 496 360C509.3 360 520 349.3 520 336z" /></svg>
            <span>Print Page</span>
            <span className="ml-auto text-xs text-gray-400">Ctrl+P</span>
        </div>
    )
}

export const BoorkmarkDisplayOption = ({ autohide }) => {
    return (
        <div
            onMouseLeave={() => autohide()}
            onClick={() => ContentLoader_ins.loadBookmarks()}
            className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" data-action="viewBookmarks">
            <svg className="h-5 w-5 mr-3 fill-gray-400 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z" /></svg>
            <span>View Bookmarks</span>
        </div>
    )
}
export const ThemeOption = ({ autohide }) => {
    const submenuref = useRef(null)

    return (
        <div
            onMouseEnter={() => {
                autohide()
                submenuref.current.classList.remove('hidden')
            }}
            className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer relative select-none" data-action="theme">
            <svg className="h-5 w-5 mr-3 fill-gray-400 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M576 320C576 320.9 576 321.8 576 322.7C575.6 359.2 542.4 384 505.9 384L408 384C381.5 384 360 405.5 360 432C360 435.4 360.4 438.7 361 441.9C363.1 452.1 367.5 461.9 371.8 471.8C377.9 485.6 383.9 499.3 383.9 513.8C383.9 545.6 362.3 574.5 330.5 575.8C327 575.9 323.5 576 319.9 576C178.5 576 63.9 461.4 63.9 320C63.9 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320zM192 352C192 334.3 177.7 320 160 320C142.3 320 128 334.3 128 352C128 369.7 142.3 384 160 384C177.7 384 192 369.7 192 352zM192 256C209.7 256 224 241.7 224 224C224 206.3 209.7 192 192 192C174.3 192 160 206.3 160 224C160 241.7 174.3 256 192 256zM352 160C352 142.3 337.7 128 320 128C302.3 128 288 142.3 288 160C288 177.7 302.3 192 320 192C337.7 192 352 177.7 352 160zM448 256C465.7 256 480 241.7 480 224C480 206.3 465.7 192 448 192C430.3 192 416 206.3 416 224C416 241.7 430.3 256 448 256z" /></svg>
            <span className="flex justify-between items-center w-full">Reading Theme
                <svg className="h-5 w-5 fill-gray-400 dark:fill-gray-50 -rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" /></svg>
            </span>

            {/* Theme Submenu */}
            <ThemeSubmenu submenuref={submenuref} />

        </div>
    )
}

export const FontOption = ({ autohide }) => {
    const submenuref = useRef(null)

    return (
        <div
            onMouseEnter={() => {
                autohide()
                submenuref.current.classList.remove('hidden')
            }}
            className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer relative font-mono select-none" data-action="fontSize">
            <svg className="h-7 w-7 fill-gray-400 dark:fill-white mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M72 96C49.9 96 32 113.9 32 136L32 192C32 209.7 46.3 224 64 224C81.7 224 96 209.7 96 192L96 160L160 160L160 480L128 480C110.3 480 96 494.3 96 512C96 529.7 110.3 544 128 544L256 544C273.7 544 288 529.7 288 512C288 494.3 273.7 480 256 480L224 480L224 160L288 160L288 192C288 209.7 302.3 224 320 224C337.7 224 352 209.7 352 192L352 136C352 113.9 334.1 96 312 96L72 96zM470.6 425.4C458.1 412.9 437.8 412.9 425.3 425.4C412.8 437.9 412.8 458.2 425.3 470.7L489.3 534.7C501.8 547.2 522.1 547.2 534.6 534.7L598.6 470.7C611.1 458.2 611.1 437.9 598.6 425.4C586.1 412.9 565.8 412.9 553.3 425.4L543.9 434.8L543.9 205.3L553.3 214.7C565.8 227.2 586.1 227.2 598.6 214.7C611.1 202.2 611.1 181.9 598.6 169.4L534.6 105.4C528.6 99.4 520.5 96 512 96C503.5 96 495.4 99.4 489.4 105.4L425.4 169.4C412.9 181.9 412.9 202.2 425.4 214.7C437.9 227.2 458.2 227.2 470.7 214.7L480.1 205.3L480.1 434.8L470.7 425.4z" /></svg>
            <span className="flex justify-between items-center w-full">Font Size
                <svg className="h-5 w-5 fill-gray-400 dark:fill-gray-50 -rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" /></svg>
            </span>

            {/* Font Size Submenu */}
            <FontSubmenu submenuref={submenuref} />
        </div>
    )
}

export const HighlightOption = ({ }) => {
    const submenuref = useRef(null)

    return (
        <div
            onMouseEnter={() => submenuref.current.classList.remove('hidden')}
            className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer relative select-none" data-action="highlight">
            <svg className="h-7 w-7 fill-gray-400 dark:fill-gray-50 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M347 379L505.4 163.9L476.1 134.6L261 293L347 379zM160 384L160 384L160 312.3C160 297 167.2 282.7 179.5 273.7L452.6 72.4C460 66.9 469 64 478.2 64C489.6 64 500.5 68.5 508.6 76.6L563.4 131.4C571.5 139.5 576 150.4 576 161.9C576 171.1 573.1 180.1 567.6 187.5L366.4 460.5C357.4 472.8 343 480 327.8 480L256.1 480L230.7 505.4C218.2 517.9 197.9 517.9 185.4 505.4L134.7 454.7C122.2 442.2 122.2 421.9 134.7 409.4L160 384zM39 530.3L90.7 478.6L161.3 549.2L141.6 568.9C137.1 573.4 131 575.9 124.6 575.9L56 576C42.7 576 32 565.3 32 552L32 547.3C32 540.9 34.5 534.8 39 530.3z" /></svg>
            <span className="flex justify-between items-center w-full">Highlight
                <svg className="h-5 w-5 fill-gray-400 dark:fill-gray-50 -rotate-90" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" /></svg>
            </span>

            {/* Highlight Submenu */}
            <HightlightSubmenu submenuref={submenuref} />
        </div>
    )
}
export const SelectAllOption = ({ }) => {
    return (
        <div
            onClick={() => menuaction.selectAll()}
            className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" data-action="selectAll">
            <svg className="h-7 w-7 fill-gray-400 dark:fill-gray-50 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M64 183.4C44.9 172.4 32 151.7 32 128C32 92.7 60.7 64 96 64C119.7 64 140.4 76.9 151.4 96L488.5 96C499.6 76.9 520.2 64 543.9 64C579.2 64 607.9 92.7 607.9 128C607.9 151.7 595 172.4 575.9 183.4L575.9 456.5C595 467.6 607.9 488.2 607.9 511.9C607.9 547.2 579.2 575.9 543.9 575.9C520.2 575.9 499.5 563 488.5 543.9L151.4 543.9C140.3 563 119.7 575.9 96 575.9C60.7 575.9 32 547.2 32 511.9C32 488.2 44.9 467.5 64 456.5L64 183.4zM512 183.4C502.3 177.8 494.2 169.7 488.6 160L151.4 160C145.8 169.7 137.7 177.8 128 183.4L128 456.5C137.7 462.1 145.8 470.2 151.4 479.9L488.5 479.9C494.1 470.2 502.2 462.1 511.9 456.5L511.9 183.4zM176 240C176 222.3 190.3 208 208 208L320 208C337.7 208 352 222.3 352 240L352 304C352 321.7 337.7 336 320 336L208 336C190.3 336 176 321.7 176 304L176 240zM288 384L320 384C364.2 384 400 348.2 400 304L432 304C449.7 304 464 318.3 464 336L464 400C464 417.7 449.7 432 432 432L320 432C302.3 432 288 417.7 288 400L288 384z" /></svg>
            <span>Select All</span>
            <span className="ml-auto text-xs text-gray-400">Ctrl+A</span>
        </div>
    )
}
export const SearchOption = ({ }) => {
    return (
        <div onClick={()=>menuaction.search()} className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" data-action="search">
            <svg className="h-7 w-7 fill-gray-400 dark:fill-gray-50 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M310.6 194.3L243.4 222.5L243.4 107.2L188.7 297.5L243.4 273.3L243.4 403.6L310.6 194.3zM227.4 97.6L226.1 102.3L210.9 155.2C170.6 170.7 142 209.8 142 255.5C142 307.8 176.3 351.4 225.4 361L225.4 414.6C147.5 404.1 90 336.4 90 255.6C90 175.1 149.8 108.4 227.4 97.6zM538.8 544.8C527.6 556 515.7 557.1 510.2 555.3C504.8 553.5 483.1 535.4 449.8 510.9C416.5 486.3 416.2 475.2 406.8 454.2C397.4 433.3 376.4 411.6 349.3 401.8L339.6 387.1C314.9 404 286.6 414 258.3 415.8L260.4 409.2L276.3 359.7C322.8 347.8 357.2 305.7 357.2 255.5C357.2 201 318.8 153.4 261.2 148.4L261.2 96.3C344.4 101.4 410 170.8 410 255.6C410 289.2 398.8 320.3 381 346L395.6 355.6C405.4 382.7 427.1 403.6 448 413C468.9 422.4 480.2 422.7 504.8 456C529.4 489.2 547.5 510.9 549.3 516.3C551.1 521.7 550 533.6 538.8 544.8zM528.9 526.9C528.9 522.5 525.3 518.9 520.9 518.9C516.5 518.9 512.9 522.5 512.9 526.9C512.9 531.3 516.5 534.9 520.9 534.9C525.3 534.9 528.9 531.3 528.9 526.9z" /></svg>
            <span>Search</span>
            <span className="ml-auto text-xs text-gray-400">Ctrl+F</span>
        </div>
    )
}

export const AddBookmark = ({ }) => {
    return (
        <div className="context-item flex items-center px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" data-action="bookmark">
            <svg className="h-5 w-5 mr-3 fill-gray-400 dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z" /></svg>
            <span>Add Bookmark</span>
            <span className="ml-auto text-xs text-gray-400">Ctrl+B</span>
        </div>
    )
}
