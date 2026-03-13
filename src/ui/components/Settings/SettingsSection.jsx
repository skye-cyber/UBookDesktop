export const SettingsSection = ({ title, icon, children, className = '' }) => (
    <div className={`mb-8 last:mb-0 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {title}
            </h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);


