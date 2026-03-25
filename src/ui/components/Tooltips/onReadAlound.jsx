import { useCallback, useEffect, useRef, useState } from 'react';
import { TTSLoaderUI } from '../StatusUI/ttsaction';
import { appState } from '../../State/appState';
import { StateManager } from '../../../common/syscore/StatesManager';
import { modalmanager } from '../../../common/Status/Manager';

export const PlayerTooltip = ({ }) => {
    const playertooltip = useRef(null)
    const iconPlay = useRef(null)
    const iconPause = useRef(null)
    const iconStop = useRef(null)
    const statusLabel = useRef(null)

    const [isPlaying, SetIsPlaying] = useState(false)

    const ReadInnitializer = useCallback(async (readall = false) => {
        try {
            // Hide modal to reset state if playing
            if (isPlaying) onStop()

            const heading = StateManager.get('readerSection').querySelector('h1').textContent

            // Default to selected text
            let text =
                (
                    readall
                        ? StateManager.get('readerSection')?.textContent.replace(heading, '')
                        : appState.selectedText?.trim()
                )
                || appState.selectedText?.trim()

            if (!text) return modalmanager.showMessage("Couldn't obtain text", 'warn')

            // Replace paragraph labels with text to aid tts model
            const labels = text.match(/[0-9]:[0-9].[0-9]*\s*?⇒/g) || []

            labels.forEach((label) => {
                const paragraphNumber = label
                    .replace('⇒', '')
                    .split('.')
                    .slice(-1)
                    .toLocaleString()
                    .trim()
                    .trim()

                text = text.replace(label, `Paragraph ${paragraphNumber}: `).toLowerCase()
            })

            text = text.replace('⇒', '')

            StateManager.get('showTTSLoader')()

            const audio_file = await window.ubook.tts.generate(text)
            if (audio_file) {
                StateManager.get('hideTTSLoader')();

                //start playing
                await window.ubook.player.play(audio_file)

                displayPlayerTool();
                SetIsPlaying(true);
            }
        } catch (err) {
            console.log(err || err.title || err.name || err.slice(0, 100))
        } finally {
            StateManager.get('hideTTSLoader')()
        }
    })

    const displayPlayerTool = useCallback(() => {
        playertooltip.current.classList.remove('translate-x-[110%]')
        playertooltip.current.classList.add('translate-x-0')
    })

    const hidePlayerTool = useCallback(() => {
        playertooltip.current.classList.remove('translate-x-0')
        playertooltip.current.classList.add('translate-x-[110%]')
    })

    const onPlayPause = useCallback(() => {
        if (!isPlaying) {
            const status = window.ubook.player.resume();

            if (status === 'resumed') {
                SetIsPlaying(true);
            }
        } else {
            const status = window.ubook.player.pause();

            if (status === "paused") {
                SetIsPlaying(false);
            }
        }
    })

    const onStop = useCallback(() => {
        setTimeout(() => {
            SetIsPlaying(false);

            const status = window.ubook.player.stop();

            status === "stopped" ? hidePlayerTool() : '';
        }, 100)
    })

    const onPlayFinished = useCallback(() => {
        // when finished, automatically reset
        SetIsPlaying(false);
        hidePlayerTool();
    })

    const seekForward = useCallback(() => {
        let play_status = isPlaying

        if (isPlaying) {
            // Pause first
            const status = window.ubook.player.pause();

            if (status === "paused") {
                SetIsPlaying(false);
                play_status = false
            }
        }

        const newOffset = window.ubook.player.fastForward(5); // 5 seconds

        if (!play_status && newOffset) {
            SetIsPlaying(true)
        }
    })

    const seekBackward = useCallback(() => {
        let play_status = isPlaying

        if (isPlaying) {
            // Pause first
            const status = window.ubook.player.pause();

            if (status === "paused") {
                //statusLabel.current.textContent = 'Paused';
                SetIsPlaying(false);
                play_status = false
                //updatePlayerIcon();
            }
        }

        const newOffset = window.ubook.player.rewind(5); // 5 seconds

        if (!play_status && newOffset) {
            SetIsPlaying(true)
        }
    })

    StateManager.set('ReadInnitializer', ReadInnitializer)
    StateManager.set('onPlayPause', onPlayPause)

    //StateManager.set('displayPlayerTool', displayPlayerTool)
    //StateManager.set('hidePlayerTool', hidePlayerTool)

    useEffect(() => {
        document.addEventListener('play-finished', onPlayFinished)

        return () => {
            document.removeEventListener('play-finished', onPlayFinished)
        }
    })

    return (
        <>
            <div
                ref={playertooltip}
                id="player-tooltip"
                className="fixed bottom-2 right-4 z-50 p-3 bg-gradient-to-br from-white/40 via-white/60 to-white/40 dark:from-gray-800/40 dark:via-gray-800/60 dark:to-gray-800/40 backdrop-blur-sm rounded-xl shadow-centered-lg shadow-gray-950 flex items-center space-x-3 transition-transform transform hover:scale-105 translate-x-[110%] transition-all duration-700">

                {/* Seek Backward */}
                <button onClick={seekBackward} id="btn-backward"
                    className="p-2 bg-gradient-to-tr from-fuchsia-400 to-pink-500 rounded-full text-white hover:shadow-md hover:saturate-200 transition duration-500"
                    title="Rewind 5s" aria-label="Rewind 5 seconds">
                    <svg className="h-4 w-4 fill-gray-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M236.3 107.1C247.9 96 265 92.9 279.7 99.2C294.4 105.5 304 120 304 136L304 272.3L476.3 107.2C487.9 96 505 92.9 519.7 99.2C534.4 105.5 544 120 544 136L544 504C544 520 534.4 534.5 519.7 540.8C505 547.1 487.9 544 476.3 532.9L304 367.7L304 504C304 520 294.4 534.5 279.7 540.8C265 547.1 247.9 544 236.3 532.9L44.3 348.9C36.5 341.3 32 330.9 32 320C32 309.1 36.5 298.7 44.3 291.1L236.3 107.1z" /></svg>
                </button>

                {/* Play/Pause Button */}
                <button
                    onClick={onPlayPause}
                    id="btn-play-pause"
                    title="Play/Pause"
                    className="bg-sky-600 flex items-center justify-center hover:bg-sky-300 focus:outline-none text-white font-bold p-2.5 rounded-full transition-colors duration-700" aria-label="Play">
                    {/* Play Icon */}
                    <svg ref={iconPlay} id="icon-play" className={`${isPlaying ? 'hidden' : ''} w-5 h-5`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"></path>
                    </svg>
                    {/* Terminate Icon */}
                    <div ref={iconPause} id="icon-paused" className={`${!isPlaying ? 'hidden' : ''} px-1 py-0.5 grid grid-cols-2 gap-1 items-center justify-center text-white font-bold rounded-full transition-colors duration-700`}>
                        <p className="bg-white px-[2px] h-4"></p>
                        <p className="bg-white px-[2px] h-4"></p>
                    </div>
                </button>

                {/* Seek Forward */}
                <button onClick={seekForward} id="btn-forward"
                    className="p-2 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-full text-white hover:shadow-md hover:saturate-200 transition duration-500"
                    title="Forward 10s" aria-label="Forward 10 seconds">
                    <svg className="h-4 w-4 fill-gray-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M83.8 541.6C95.8 546.6 109.5 543.8 118.7 534.7L288 365.3L288 512C288 524.9 295.8 536.6 307.8 541.6C319.8 546.6 333.5 543.8 342.7 534.7L512 365.3L512 512C512 529.7 526.3 544 544 544C561.7 544 576 529.7 576 512L576 128C576 110.3 561.7 96 544 96C526.3 96 512 110.3 512 128L512 274.7L342.6 105.3C333.4 96.1 319.7 93.4 307.7 98.4C295.7 103.4 288 115.1 288 128L288 274.7L118.6 105.4C109.4 96.2 95.7 93.5 83.7 98.5C71.7 103.5 64 115.1 64 128L64 512C64 524.9 71.8 536.6 83.8 541.6z" /></svg>
                </button>

                {/* Stop Button */}
                <button
                    onClick={onStop}
                    ref={iconStop}
                    id="btn-stop"
                    title="Terminate Audio"
                    className="p-2 bg-gradient-to-tr from-red-400 to-red-600 rounded-full text-white hover:shadow-md hover:saturate-200 transition duration-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                </button>

                <div
                    ref={statusLabel}
                    id="player-status"
                    className="flex-1 text-sm text-gray-700 dark:text-gray-300 select-none">
                    {isPlaying ? 'Playing' : 'Stopped'}
                </div>
            </div>
            <TTSLoaderUI />
        </>
    )
}
