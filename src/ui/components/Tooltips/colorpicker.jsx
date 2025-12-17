import React from 'react';

export const ColorPicker = ({ }) => {
    return (
        <div id="color-picker"
            className="absolute hidden top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded-lg shadow-lg z-50 flex gap-2">
            <div onClick="setHighlightColor('yellow')"
                className="size-6 bg-yellow-400 dark:bg-yellow-700 rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
            <div onClick="setHighlightColor('blue')"
                className="size-6 bg-blue-400 dark:bg-blue-700 rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
            <div onClick="setHighlightColor('pink')"
                className="size-6 bg-pink-400 dark:bg-pink-700 rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
            <div onClick="setHighlightColor('green')"
                className="size-6 bg-green-400 dark:bg-green-500 rounded-full cursor-pointer hover:scale-110 transition-transform"></div>
        </div>
    )
}
