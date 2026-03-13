export const SettingsInput = ({ label, description, value, onChange, type = 'text', placeholder }) => (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
        <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
            {label}
        </label>
        {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{description}</p>
        )}
        <input
            type={type}
            defaultValue={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
    </div>
);
