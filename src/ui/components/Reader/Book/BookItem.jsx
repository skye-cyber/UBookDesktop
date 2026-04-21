/// <reference path="../../../../types/preload.d.ts" />

import { useCallback, useEffect, useRef, useState } from 'react';
import { ContentHelper } from './utils';
import { reactPortalBridge } from '../../../../common/react-portal-bridge';
import { modalmanager } from '../../../../common/Status/Manager';
import { StateManager } from '../../../../common/syscore/StatesManager';

/**
 * Create item and handle favouriting and bookmarking
    * @param {HTMLElement} node - Node containing the favourite SVG icon.
    * @param {Object} part - Part data.
    * @param {Object} paper - Paper data.
    * @param {Object} section - Section data.
    * @param {Object} title - Part name/title.
 */
export const BookItem = ({ part, paper, section, title, tag, struct }) => {
    const favsvg = useRef(null)
    const bookmarksvg = useRef(null)
    const sectionRef = useRef(null)
    const [isfav, setfav] = useState(false)
    const [isbookmarked, setbookmarked] = useState(false)


    // console.log(part, paper, section,title,tag)
    const setup = async () => {
        setfav(await ContentHelper.isFavourited(struct))
        setbookmarked(await ContentHelper.isBookmarked(struct))
    }

    useEffect(() => {
        setup()
    }, [isfav, isbookmarked])

    const highLightFav = useCallback((op) => {
        try {
            if (!favsvg.current || !favsvg.current.classList) return;

            if (!op) return ['fill-white', 'dark:fill-pink-200', 'fill-pink-600'].forEach(cls => favsvg.current.classList.toggle(cls));

            // Add bookmark
            if (op === 'add') {
                favsvg.current.classList.add('fill-pink-600');
                favsvg.current.classList.remove('fill-white', 'dark:fill-pink-200');
                //remove bookmark
            } else if (op === 'remove') {
                favsvg.current.classList.add('fill-white', 'dark:fill-pink-200');
                favsvg.current.classList.remove('fill-pink-600');
            }
        } catch (err) {
            console.error('Error in highLightFav:', err);
        }
    })

    const highLightBookmark = useCallback((op) => {
        try {
            if (!bookmarksvg.current || !bookmarksvg.current.classList) return;
            if (!op) return ['fill-none', 'fill-blue-600'].forEach(cls => bookmarksvg.current.classList.toggle(cls));

            // Add bookmark
            if (op === 'add') {
                bookmarksvg.current.classList.remove('fill-none');
                bookmarksvg.current.classList.add('fill-blue-600');
                //remove bookmark
            } else if (op === 'remove') {
                bookmarksvg.current.classList.add('fill-none');
                bookmarksvg.current.classList.remove('fill-blue-600');
            }
        } catch (err) {
            console.error('Error in highLightBookmark:', err);
        }
    })

    const OpenSectionContent = useCallback(() => {
        document.dispatchEvent(new CustomEvent('clear-reader-section'))
        reactPortalBridge.showComponentInTarget('Readable', 'reader-content', { section: section }, 'readable_content')
        ContentHelper.scrollToTop(StateManager.get('readerSection'))

        document.dispatchEvent(new CustomEvent('hide-item-selector'))
        //document.dispatchEvent(new CustomEvent('hide-book-content-panel'))
        StateManager.set('active_section', sectionRef.current)
    })

    /**
     * Handles toggling of favourite state and displays appropriate toast.
     * @async
     */
    const FavouriteItem = useCallback(async () => {
        const structure = ContentHelper.createStructure(section, paper, part);

        const status = await window.ubook.favourites.toggle(structure);
        if (status.success) {
            //highLightFav(status.task);
            setfav(status.task === 'add')

            status.task === 'add'
                ? modalmanager.showMessage('Item Favourited 💝', 'info')
                : modalmanager.showMessage('Item Unfavourited 💔', 'info')
        }
    })

    /**
     * Handles toggling of bookmark state and displays appropriate toast.
     * @async
     */
    const BookmarkItem = useCallback(async () => {
        const structure = ContentHelper.createStructure(section, paper, part);
        const status = await window.ubook.bookmarks.toggle(structure);
        if (status.success) {
            //highLightBookmark(status.task);
            setbookmarked(status.task === 'add')

            if (status.task === 'add') {
                modalmanager.showMessage('Item Bookmarked 📑', 'info')
            } else {
                modalmanager.showMessage('Item Unbookmarked', 'info')
            }
        }
    })

    return (
        <li
            data-tag={tag}
            data-title={title}
            ref={sectionRef}
            onClick={(e) => {
                if (![bookmarksvg.current.parentElement, favsvg.current.parentElement].some(el => el.contains(e.target) || el === e.target)) {
                    e.preventDefault()
                    OpenSectionContent()
                }
            }
            }
            className='flex items-center justify-between gap-4 py-3 hover:bg-gray-200 dark:hover:bg-slate-900 hover:rounded-md transition-colors duration-0'>
            <button onClick={BookmarkItem} id="bookmark" className="rounded-full p-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-500 hover:text-blue-700 transition focus:outline-none">
                <svg ref={bookmarksvg} xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${isbookmarked ? 'fill-blue-600' : 'fill-none'} stroke-blue-500`} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5v14l7-5 7 5V5H5z" />
                </svg>
            </button>
            <div className="flex-1 cursor-pointer text-left">
                <div className="block">
                    <p data-content={paper.paper_id} className="flex-1 cursor-pointer text-left font-medium text-gray-800 dark:text-white">{title}</p>
                    <p className="text-sm text-gray-500 dark:gray-100">{(paper.paper_id !== 0) ? `Paper ${paper.paper_id}` : 'Foreword'}</p>
                </div>
            </div>
            <button onClick={FavouriteItem} id="favourite" className="rounded-full p-1.5 hover:bg-pink-300 dark:hover:bg-pink-900 text-pink-100 hover:text-pink-700 transition-colors duration-300 ease-in-out focus:outline-none">
                <svg ref={favsvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-7 h-7 ${isfav ? 'fill-pink-600' : `fill-white dark:fill-pink-200`} stroke-pink-600`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </li>
    )
}
