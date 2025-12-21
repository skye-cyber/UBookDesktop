import React, { useCallback, useEffect, useRef } from 'react';

export class colorPicker {
    static setHighlightColor() {
        //
    }
}

export const ColorPicker = ({ }) => {
    const pickerContainer = useRef(null);

    const showColorPicker = useCallback(() => {
        pickerContainer.current.classList.remove('hidden')
    })
    const hideColorPicker = useCallback(() => {
        pickerContainer.current.classList.add('hidden')
    })

    useEffect(() => {
        document.addEventListener('showColorPicker', showColorPicker)
        document.addEventListener('hideColorPicker', hideColorPicker)
        return () => {
            document.removeEventListener('showColorPicker', showColorPicker)
            document.removeEventListener('hideColorPicker', hideColorPicker)
        }
    })

    return (
        <div ref={pickerContainer} id="color-picker"
            className="absolute hidden top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded-lg shadow-lg z-50 flex gap-2">
            <div onClick={colorPicker.setHighlightColor('yellow')}
                className="size-6 bg-yellow-400 dark:bg-yellow-700 rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
            <div onClick={colorPicker.setHighlightColor('blue')}
                className="size-6 bg-blue-400 dark:bg-blue-700 rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
            <div onClick={colorPicker.setHighlightColor('pink')}
                className="size-6 bg-pink-400 dark:bg-pink-700 rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
            <div onClick={colorPicker.setHighlightColor('green')}
                className="size-6 bg-green-400 dark:bg-green-500 rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
    )
}
