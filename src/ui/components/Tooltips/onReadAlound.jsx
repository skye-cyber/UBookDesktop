import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StateManager } from '../../../renderer/js/syscore/StatesManager';

export const PlayerTooltip = ({ }) => {
    const playertooltip = useRef(null)
    const iconPlay = useRef(null)
    const iconPause = useRef(null)
    const iconStop = useRef(null)
    const statusLabel = useRef(null)
    const speedDown = useRef(null)
    const speedUp = useRef(null)
    const speedDisplay = useRef(null)
    const [currentSpeed, SetCurrentSpeed] = useState(1.0)

    const [isPlaying, SetIsPlaying] = useState(false)

    const displayPlayerTool = useCallback(() => {
        playertooltip.current.classList.remove('translate-x-[110%]')
        playertooltip.current.classList.add('translate-x-0')
    })

    const hidePlayerTool = useCallback(() => {
        playertooltip.current.classList.remove('translate-x-0')
        playertooltip.current.classList.add('translate-x-[110%]')
    })

    const updatePlayerIcon = useCallback(() => {
        if (isPlaying) {
            iconPlay.current.classList.add('hidden');
            iconPause.current.classList.remove('hidden');
        } else {
            iconPlay.current.classList.remove('hidden');
            iconPause.current.classList.add('hidden');
        }
    })

    /**
     * DEPRECATED Pending Removal
     */
    const HandleSpeed = useCallback((direction) => {
        // calculate Speed
        let speed = currentSpeed

        if (direction === 'up') {
            speed = (speed + 0.1 <= 2) ? speed + 0.1 : 2;
        } else if (direction === 'down') {
            speed = (speed - 0.1 >= 0.5) ? speed - 0.1 : 1;
        }

        speed = speed.toFixed(1)

        //window.ubook.player.setSpeed(parseFloat(speed));

        SetCurrentSpeed(speed)

        return speed
    })

    const onPlayPause = useCallback(async () => {
        if (!isPlaying) {
            const status = 'resumed' //await window.ubook.player.resume();

            if (status === 'resumed') {
                //statusLabel.current.textContent = 'Playing...';
                SetIsPlaying(true);
                //updatePlayerIcon();
            }
        } else {
            const status = 'paused' //await window.ubook.player.pause();

            if (status === "paused") {
                //statusLabel.current.textContent = 'Paused';
                SetIsPlaying(false);
                //updatePlayerIcon();
            }
        }
    })

    const onStop = useCallback(async () => {
        //statusLabel.current.textContent = 'Stopped';

        setTimeout(async () => {
            SetIsPlaying(false);
            //updatePlayerIcon();

            const status = "stopped" //await window.ubook.player.stop();
            status === "stopped" ? hidePlayerTool() : '';
        }, 500)
    })

    const onPlayFinished = useCallback(() => {
        // when finished, automatically reset
        console.log("Finished playing")
        SetIsPlaying(false);

        // update button/icon to reflect stopped state
        //updatePlayerIcon();

        // update status
        //statusLabel.current.textContent = 'Finished';
        hidePlayerTool();
    })

    const seekForward = useCallback(async () => {
        let play_status = isPlaying

        if (isPlaying) {
            // Pause first
            const status = await window.ubook.player.pause();

            if (status === "paused") {
                //statusLabel.current.textContent = 'Paused';
                SetIsPlaying(false);
                play_status = false
                //updatePlayerIcon();
            }
        }

        const newOffset = window.ubook.player.fastForward(5); // 5 seconds

        if (!play_status && newOffset) {
            SetIsPlaying(true)
            //statusLabel.current.textContent = 'Playing...';
            //updatePlayerIcon()
        }
    })

    const seekBackward = useCallback(async () => {
        let play_status = isPlaying

        if (isPlaying) {
            // Pause first
            const status = await window.ubook.player.pause();

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
            //statusLabel.current.textContent = 'Playing...';
            //updatePlayerIcon()
        }
    })

    StateManager.set('displayPlayerTool', displayPlayerTool)
    StateManager.set('hidePlayerTool', hidePlayerTool)

    useEffect(() => {
        document.addEventListener('play-finished', onPlayFinished)

        return () => {
            document.removeEventListener('play-finished', onPlayFinished)
        }
    })

    return (
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

            <div className="hidden  items-center space-x-1 bg-gray-300 dark:bg-zinc-700 rounded-lg px-2 py-1" title="Fast-Foward 5s" aria-label="Fast-Foward 5 seconds">
                <button
                    ref={speedDown}
                    onClick={() => HandleSpeed("down")}
                    id="btn-speed-down"
                    className="px-2 py-0.5 text-sm font-bold rounded-full bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 text-white transition duration-300"
                    title="Slower">-</button>
                <span
                    ref={speedDisplay}
                    id="playback-speed"
                    className="text-xs font-semibold text-gray-800 dark:text-gray-200 select-none">{currentSpeed}x</span>
                <button
                    ref={speedUp}
                    onClick={() => HandleSpeed("up")}
                    id="btn-speed-up"
                    className="px-2 py-0.5 text-sm font-bold rounded-full bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 text-white transition duration-300"
                    title="Faster">+</button>
            </div>

            <div
                ref={statusLabel}
                id="player-status"
                className="flex-1 text-sm text-gray-700 dark:text-gray-300 select-none">
                {isPlaying ? 'Playing' : 'Stopped'}
            </div>
        </div>
    )
}
