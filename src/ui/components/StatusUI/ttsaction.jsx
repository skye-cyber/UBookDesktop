import { useCallback, useRef } from 'react';
import { StateManager } from '../../../common/syscore/StatesManager';

export const TTSLoaderUI = ({ }) => {
    const loader = useRef(null)

    const showTTSLoader = useCallback(() => {
        loader.current.classList.remove('-translate-y-full', 'opacity-0')
        loader.current.classList.add('translate-y-0', 'opacity-100')
    })
    const hideTTSLoader = useCallback(() => {
        loader.current.classList.remove('translate-y-0', 'opacity-100')
        loader.current.classList.add('-translate-y-full', 'opacity-0')

    })

    StateManager.set('showTTSLoader', showTTSLoader)
    StateManager.set('hideTTSLoader', hideTTSLoader)

    return (
        <div ref={loader} id="tts-loading-ui"
            className="fixed top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 pointer-events-none bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-6 py-3 rounded-b-xl shadow-lg flex items-center gap-4 transition-transform transition-opacity duration-300 ease-out z-50 select-none">
            <svg className="w-6 h-6 animate-spin-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span id="tts-load-text" className="font-normal text-lg">Loading...</span>
        </div>
    )
}
