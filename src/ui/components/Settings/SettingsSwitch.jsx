export const SettingsSwitch = ({ label, description, checked, onChange, disabled = false }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
        <div className="flex-1">
            <span className="font-medium text-slate-800 dark:text-slate-100">{label}</span>
            {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
            )}
        </div>
        <label className="relative inline-flex items-center cursor-pointer ml-4">
            <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
        </label>
    </div>
);
