import { appState } from '../../State/appState';
import { StateManager } from '../../../common/syscore/StatesManager';
import { waitForElement } from '../../../common/syscore/dom_utils';

/**
 * Manages the reader's font size, tracking the current value on the instance
 * instead of re-reading it from `getComputedStyle` on every change.
 *
 * Why: on Android's WebView, `getComputedStyle(el).fontSize` can return a
 * value in `pt`, `em`, or a fractional `px` string (e.g. "12pt", "1.05em",
 * "15.99px"). `parseInt` on those strings produces a much smaller number
 * than intended, which caused the A+ button to *shrink* text on mobile
 * while working correctly on desktop Chromium (which always returns `px`).
 *
 * By caching the size on the instance and only seeding from computed styles
 * once, the arithmetic is platform-independent.
 */
export class FontSizeManager {
    private readable: HTMLElement | null = null;
    private currentFontSize: number = FontSizeManager.DEFAULT;
    private initialFontSize: number = FontSizeManager.DEFAULT;

    /** Bounds for the reader font size, in px. */
    private static readonly MIN = 10;
    private static readonly MAX = 40;
    private static readonly DEFAULT = 16;

    /** Whether we've already attached the pinch-to-zoom listeners. */
    private pinchAttached = false;

    constructor() {
        this.init();
    }

    init(): void {
        waitForElement('#reader-content', (el: HTMLElement) => {
            this.readable = el;

            // Seed once from the DOM. Use parseFloat, not parseInt, so
            // fractional computed values aren't truncated in the wrong
            // direction.
            const computed = parseFloat(getComputedStyle(el).fontSize);
            const seeded = Number.isFinite(computed) && computed > 0
            ? computed
            : FontSizeManager.DEFAULT;

            this.currentFontSize = seeded;
            this.initialFontSize = seeded;

            appState.reader.fontSize = this.currentFontSize;

            this.attachPinchToFontIfMobile();
        });
    }

    /**
     * Change the font size by a delta, or set it to an absolute value when
     * `size` is provided.
     *
     * @param delta  Amount to add (negative to shrink). Ignored when `size` is set.
     * @param size   Absolute size in px. When provided, `delta` is ignored.
     */
    changeFontSize(delta: number = 1, size: number | null = null): void {
        if (!this.readable) return;

        if (typeof size === 'number') {
            this.currentFontSize = size;
        } else {
            // Use the tracked value — do NOT re-read from getComputedStyle.
            this.currentFontSize += delta;
        }

        this.currentFontSize = this.clamp(this.currentFontSize);
        this.apply();
    }

    resetFontSize(): void {
        if (!this.readable) return;
        this.currentFontSize = this.initialFontSize;
        this.apply();
    }

    /** Read the currently tracked size (px). */
    getCurrentSize(): number {
        return this.currentFontSize;
    }

    /** Set an absolute size, clamped to the allowed range. */
    setFontSize(size: number): void {
        if (!this.readable) return;
        this.currentFontSize = this.clamp(size);
        this.apply();
    }

    // ---- internals -------------------------------------------------------

    private clamp(size: number): number {
        return Math.max(FontSizeManager.MIN, Math.min(FontSizeManager.MAX, size));
    }

    private apply(): void {
        if (!this.readable) return;
        this.readable.style.fontSize = `${this.currentFontSize}px`;
        appState.reader.fontSize = this.currentFontSize;
    }

    /**
     * Attach pinch-to-zoom on touch devices, translating the scale factor
     * into font-size changes. No-op on desktop and on devices without
     * multi-touch support.
     */
    private attachPinchToFontIfMobile(): void {
        if (this.pinchAttached) return;
        if (!this.readable) return;
        if (!('ontouchstart' in window) || navigator.maxTouchPoints < 2) return;

        const readable = this.readable;
        let startDistance = 0;
        let startFontSize = 0;

        const distance = (touches: TouchList): number => {
            const [a, b] = [touches[0], touches[1]];
            return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        };

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length !== 2) return;
            startDistance = distance(e.touches);
            startFontSize = this.currentFontSize;
            e.preventDefault();
        };

        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length !== 2 || !startDistance) return;
            const scale = distance(e.touches) / startDistance;
            const next = Math.round(startFontSize * scale);
            this.currentFontSize = this.clamp(next);
            this.apply();
            e.preventDefault();
        };

        const onTouchEnd = () => {
            startDistance = 0;
        };

        readable.addEventListener('touchstart', onTouchStart, { passive: false });
        readable.addEventListener('touchmove', onTouchMove, { passive: false });
        readable.addEventListener('touchend', onTouchEnd);
        readable.addEventListener('touchcancel', onTouchEnd);

        this.pinchAttached = true;
    }
}

export function ChangeFontName(fontname: string): boolean {
    if (!fontname) return false;

    const readable = StateManager.get('readerSection');
    if (!readable) return false;

    const textuals = readable.querySelectorAll('#textual');
    if (!textuals || textuals.length === 0) return false;

    textuals.forEach((textual: Element) => {
        textual.classList.remove(`font-${appState.reader.fontName}`);
        textual.classList.add(`font-${fontname}`);
    });

    appState.reader.fontName = fontname;
    return true;
}

export const FontSizeManager_ins = new FontSizeManager();
