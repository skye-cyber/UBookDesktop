import { useRef } from "react";

export const SettingsSlider = ({ label, description, value, min, max, step, onChange }) => {
    const labelRef = useRef(null)
    return (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-slate-700 dark:text-slate-200">
                    {label}
                </label>
                <span ref={labelRef} className="text-sm font-mono text-gray-700 dark:text-white font-semibold bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                    {value}
                </span>
            </div>
            {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{description}</p>
            )}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                defaultValue={value}
                onChange={(e) => {
                    onChange(parseFloat(e.target.value))
                    labelRef.current.textContent = e.target.value
                }}
                className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer dark:bg-slate-600 focus:outline-none"
            />
        </div>
    )
};
