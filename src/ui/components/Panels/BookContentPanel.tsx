import { useCallback, useEffect, useRef } from 'react';
import { useTheme } from '../Themes/useThemeHeadless';
import { waitForElement } from '../../../common/syscore/dom_utils';
import { StateManager } from '../../../common/syscore/StatesManager';
import { ContentLoader_ins } from './content_loader';

export const BookContentPanel = ({ }) => {
    const panel = useRef < HTMLDivElement | null > (null);
    const forewordRef = useRef < HTMLLIElement | null > (null);

    const { isDark, setTheme } = useTheme();

    // ---- slide state -----------------------------------------------------

    const showPanel = useCallback(() => {
        panel.current?.classList.remove('-translate-x-full', 'xl:-translate-x-full');
        panel.current?.classList.add('-translate-x-0', 'xl:translate-x-0');
    }, []);

    const hidePanel = useCallback(() => {
        panel.current?.classList.add('-translate-x-full', 'xl:-translate-x-full');
        panel.current?.classList.remove('-translate-x-0', 'xl:translate-x-0');
    }, []);

    /**
     * Focus-mode handler: when the user enters focus mode, hide the panel;
     * when they exit, show it again.
     */
    const ToggleBookContentPanel = useCallback(() => {
        const focused = StateManager.get('focusMode');
        focused ? showPanel() : hidePanel();
    }, [showPanel, hidePanel]);

    /**
     * Explicit open/close dispatcher. Kept in StateManager under the original
     * `BookPanelToggle` key so existing call sites keep working.
     */
    const panelToggleHandler = useCallback(() => {
        const isPanelOpen =
            window.innerWidth < 1280
                ? panel.current?.classList.contains('-translate-x-0')
                : panel.current?.classList.contains('xl:translate-x-0');
        isPanelOpen ? hidePanel() : showPanel();
    }, [showPanel, hidePanel]);

    StateManager.set('BookPanelToggle', panelToggleHandler);

    // ---- lifecycle & listeners ------------------------------------------

    useEffect(() => {
        setTimeout(() => {
            ContentLoader_ins.setForeword(true);
            waitForElement('#paper-container > :first-child', (el: HTMLElement) => {
                (el as HTMLElement).click();
            });
        }, 100);

        document.addEventListener('focusMode', ToggleBookContentPanel);
        document.addEventListener('toggle-left-panel', panelToggleHandler);
        document.addEventListener('hide-book-content-panel', hidePanel);

        return () => {
            document.removeEventListener('focusMode', ToggleBookContentPanel);
            document.removeEventListener('toggle-left-panel', panelToggleHandler);
            document.removeEventListener('hide-book-content-panel', hidePanel);
        };
    }, [ToggleBookContentPanel, panelToggleHandler, hidePanel]);

    // ---- swipe gestures (mobile only) -----------------------------------

    useEffect(() => {
        const isMobile = () => window.innerWidth < 1280;

        let startX = 0;
        let startY = 0;
        let tracking = false;
        let opening = false;   // swipe initiated from screen edge to open
        let closing = false;   // swipe initiated on the panel to close
        const EDGE_ZONE = 24;          // px from left edge to trigger open
        const OPEN_THRESHOLD = 60;     // px of rightward drag to open
        const CLOSE_THRESHOLD = -60;   // px of leftward drag to close

        const onTouchStart = (e: TouchEvent) => {
            if (!isMobile() || e.touches.length !== 1) return;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;

            const panelEl = panel.current;
            const panelOpen = panelEl?.classList.contains('-translate-x-0') ?? false;

            if (!panelOpen && startX <= EDGE_ZONE) {
                opening = true;
                tracking = true;
            } else if (panelOpen && panelEl && panelEl.contains(e.target as Node)) {
                closing = true;
                tracking = true;
            }
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!tracking) return;
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;

            // Ignore mostly-vertical gestures so page scroll isn't hijacked.
            if (Math.abs(dy) > Math.abs(dx) + 10) {
                tracking = false;
                opening = false;
                closing = false;
                return;
            }

            const panelEl = panel.current;
            if (!panelEl) return;

            if (opening && dx > 0) {
                // Live-drag: reveal the panel by translating it toward 0.
                panelEl.style.transform = `translateX(${Math.min(dx - panelEl.offsetWidth, 0)}px)`;
            } else if (closing && dx < 0) {
                panelEl.style.transform = `translateX(${Math.max(dx, -panelEl.offsetWidth)}px)`;
            }
        };

        const onTouchEnd = (e: TouchEvent) => {
            if (!tracking) {
                opening = false;
                closing = false;
                return;
            }
            const touch = e.changedTouches[0];
            const dx = touch.clientX - startX;

            // Clear the inline transform so the class-based state takes over.
            if (panel.current) panel.current.style.transform = '';

            if (opening && dx >= OPEN_THRESHOLD) {
                showPanel();
            } else if (closing && dx <= CLOSE_THRESHOLD) {
                hidePanel();
            }

            tracking = false;
            opening = false;
            closing = false;
        };

        document.addEventListener('touchstart', onTouchStart, { passive: true });
        document.addEventListener('touchmove', onTouchMove, { passive: true });
        document.addEventListener('touchend', onTouchEnd, { passive: true });
        document.addEventListener('touchcancel', onTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
            document.removeEventListener('touchcancel', onTouchEnd);
        };
    }, [showPanel, hidePanel]);

    // ---- render ---------------------------------------------------------

    const rowBase =
        'group flex items-center gap-2 px-3 sm:px-1 py-2 rounded-md mx-2 sm:mx-0.5 my-0.5 ' +
        'text-indigo-50 dark:text-gray-200 cursor-pointer ' +
        'hover:bg-indigo-800/70 dark:hover:bg-[#00445f]/70 ' +
        'active:bg-indigo-700/80 dark:active:bg-[#003d52] ' +
        'transition-colors duration-200';

    const rowIcon = 'transition-transform duration-300 ease-out group-hover:translate-x-1';

    return (
        <>
            {/* Narrow visual affordance so users know the panel can be swiped open. */}
            <div
                aria-hidden="true"
                className="xl:hidden fixed left-0 top-1/2 -translate-y-1/2 w-[3px] h-16 rounded-r-full bg-indigo-500/40 dark:bg-[#00b7cf]/30 pointer-events-none z-30"
            />

            <div
                ref={panel}
                id="sidepane"
                className="fixed z-40 left-0 w-[300px] sm:w-[290px] bg-gradient-to-br from-indigo-900 via-indigo-950 to-indigo-950 dark:from-[#001f2b] dark:via-[#001f2b] dark:to-[#002733] h-[90dvh] sm:h-[93vh] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] transform transition-transform duration-300 ease-out -translate-x-full xl:translate-x-0 select-none rounded-r-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-700/70 dark:border-[#00455e]">
                    <h1 className="text-white dark:text-gray-200 text-xl font-semibold tracking-wide ml-1">
                        Urantia Book
                    </h1>

                    {/* Close button — mobile only, gives an obvious exit besides swipe. */}
                    <button
                        onClick={hidePanel}
                        aria-label="Close panel"
                        className="xl:hidden p-1.5 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-800/70 dark:hover:bg-[#00445f]/70 transition-colors duration-200"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 6l12 12M6 18L18 6" />
                        </svg>
                    </button>
                </div>

                {/* Navigation list */}
                <section
                    className="h-fit max-h-[72%] overflow-y-auto scrollbar-custom mx-2 sm:mx-1 mt-2 rounded-lg bg-indigo-950/40 dark:bg-[#002b36]"
                >
                    <ul className="py-1">
                        <div onClick={() => ContentLoader_ins.setForeword()} className={rowBase}>
                            <li ref={forewordRef} id="foreword" className={rowIcon}>📖 Foreword</li>
                        </div>
                        <div onClick={() => ContentLoader_ins.setSuperUniverse()} className={rowBase}>
                            <li id="central-and-superuniverse" className={rowIcon}>
                                <span className="bg-pink-600/0 rounded-full px-0.5">🌀</span>&nbsp; The Central and Superuniverses
                            </li>
                        </div>
                        <div onClick={() => ContentLoader_ins.setLocalUniverse()} className={rowBase}>
                            <li id="local-universe" className={rowIcon}>🌍 The Local Universe</li>
                        </div>
                        <div onClick={() => ContentLoader_ins.setHistoryOfUrantia()} className={rowBase}>
                            <li id="history-of-urantia" className={rowIcon}>📜 The History of Urantia</li>
                        </div>
                        <div onClick={() => ContentLoader_ins.setJesusTeachings()} className={rowBase}>
                            <li id="life-and-teachings-of-jesus" className={rowIcon}>✝️ The Life and Teachings of Jesus</li>
                        </div>
                        <div onClick={() => ContentLoader_ins.loadFavourites()} className={rowBase}>
                            <li id="favourite" className={rowIcon}>⭐ Favourite</li>
                        </div>
                        <div onClick={() => ContentLoader_ins.loadBookmarks()} className={rowBase}>
                            <li id="bookmark" className={rowIcon}>🔖 Bookmarks</li>
                        </div>
                        <div
                            onClick={() => document.dispatchEvent(new CustomEvent('show-notes'))}
                            className={rowBase}
                        >
                            <li id="notes" className={rowIcon}>📔 Notes</li>
                        </div>
                    </ul>
                </section>

                {/* Theme toggle pill */}
                <div className="absolute left-0 bottom-16 sm:bottom-6 flex items-center justify-center w-full px-3">
                    <div className="flex items-center justify-between select-none bg-indigo-800/60 dark:bg-[#002a39] border border-indigo-700/60 dark:border-[#00455e] rounded-full px-3 py-2 w-full">
                        <span className="text-xs text-indigo-200 font-medium block">Theme</span>

                        <label className="relative inline-block w-12 h-6 cursor-pointer select-none mx-auto md:mx-0">
                            <input
                                onChange={() => setTheme(isDark ? 'light' : 'dark')}
                                checked={isDark}
                                type="checkbox"
                                id="theme-toggle"
                                className="bookpanel-themtoggle peer hidden"
                            />
                            <span className="absolute inset-0 bg-indigo-500 peer-checked:bg-teal-500 transition-colors duration-300 rounded-full" />
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-6" />
                        </label>

                        <span className="text-xs text-indigo-200 font-medium hidden md:block">Light/Dark</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export const ContentEmpty = ({ info }: { info: string }) => {
    return (
        <h2 className="text-center font-semibold text-gray-900 dark:text-white underline">
            {info}
        </h2>
    );
};
