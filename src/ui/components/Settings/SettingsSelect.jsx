export const SettingsSelect = ({ label, description, value, onChange, options }) => (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
        <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            {label}
        </label>
        {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{description}</p>
        )}
        <div className="relative">
            <select
                defaultValue={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
);
