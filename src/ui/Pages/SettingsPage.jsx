import { useState, useEffect, useRef } from 'react';
import { loadingspinner } from '../components/StatusUI/Helpers/loader';
import { settingsManager } from '../../common/syscore/SettingsManager';
import { SettingsSection, SettingsSwitch, SettingsSelect, SettingsSlider, SettingsInput } from '../components/Settings/index';
import { ChangeFontName } from '../components/Reader/font_manager';
import { appState } from '../State/appState';

export const SettingsPage = () => {
    const [settings, setSettings] = useState(settingsManager.getAll());
    const [activeTab, setActiveTab] = useState('appearance');
    const [isVisible, setIsVisible] = useState(false);
    const [isModified, setIsDirty] = useState(false);

    const containerRef = useRef(null);
    const backdropRef = useRef(null);

    // Subscribe to settings changes
    useEffect(() => {
        const unsubscribe = settingsManager.subscribe(newSettings => {
            setSettings(newSettings);
        });
        return unsubscribe;
    }, []);

    // Event listeners for opening/closing
    useEffect(() => {
        const openSettings = () => setIsVisible(true);
        const closeSettings = () => {
            if (isModified) {
                if (confirm('You have unsaved changes. Discard them?')) {
                    setIsVisible(false);
                    setIsDirty(false);
                }
            } else {
                setIsVisible(false);
            }
        };

        document.addEventListener('open-settings', openSettings);
        document.addEventListener('close-settings', closeSettings);
        document.addEventListener('escape-key-down', closeSettings);

        return () => {
            document.removeEventListener('open-settings', openSettings);
            document.removeEventListener('close-settings', closeSettings);
            document.removeEventListener('escape-key-down', closeSettings);
        };
    }, [isModified]);

    // Animation classes
    useEffect(() => {
        if (isVisible) {
            backdropRef.current?.classList.remove('hidden');
            containerRef.current?.classList.remove('hidden');
            setTimeout(() => {
                containerRef.current?.classList.add('translate-y-0');
                containerRef.current?.classList.remove('translate-y-[100vh]');
            }, 10);
        } else {
            containerRef.current?.classList.add('translate-y-[100vh]');
            containerRef.current?.classList.remove('translate-y-0');
            setTimeout(() => {
                backdropRef.current?.classList.add('hidden');
                containerRef.current?.classList.add('hidden');
            }, 300);
        }
    }, [isVisible]);

    // Update a setting
    const updateSetting = async (category, key, value) => {
        await settingsManager.set(category, key, value);
        setIsDirty(true);
    };

    // Save all changes
    const saveChanges = async () => {
        const spinner = await loadingspinner.open('Saving settings...');
        try {
            await settingsManager.saveSettings();
            setIsDirty(false);
            // Optional: show success message
        } finally {
            loadingspinner.close();
        }
    };

    // Reset to defaults
    const resetToDefaults = async () => {
        if (confirm('Reset all settings to default values?')) {
            const spinner = await loadingspinner.open('Resetting settings...');
            try {
                await settingsManager.resetToDefaults();
                setIsDirty(false);
            } finally {
                loadingspinner.close();
            }
        }
    };

    // Export settings
    const exportSettings = async () => {
        const data = JSON.stringify(settings, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ubook-settings-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Import settings
    const importSettings = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    // Merge with current settings
                    for (const category in imported) {
                        await settingsManager.update(category, imported[category]);
                    }
                    setIsDirty(false);
                } catch (err) {
                    alert('Invalid settings file');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // Tab configuration
    const tabs = [
        { id: 'appearance', label: 'Appearance', icon: '🎨' },
        { id: 'search', label: 'Search', icon: '🔍' },
        { id: 'reader', label: 'Reader', icon: '📖' },
        { id: 'audio', label: 'Audio', icon: '🔊' },
        { id: 'privacy', label: 'Privacy', icon: '🔒' },
        //         { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' }
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="fixed inset-0 z-[41] bg-black/50 backdrop-brightness-sm hidden transition-all duration-300"
                onClick={() => setIsVisible(false)}
            ></div>

            {/* Settings Panel */}
            <div
                ref={containerRef}
                className="fixed inset-1 left-1/2 -translate-x-1/2 top-1/7 bottom-auto right-auto m-auto w-[90vw] max-w-full md:max-w-4xl h-full max-h-screen bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden hidden translate-y-[100vh] transition-all duration-300 z-[60]"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 relative">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 text-3xl text-white/80 hover:text-white transition-all duration-300 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20"
                    >
                        &times;
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">Settings</h2>
                            <p className="text-primary-100 mt-1">Customize your UBook experience</p>
                        </div>
                    </div>

                    {/* Unsaved indicator */}
                    {isModified && (
                        <div className="absolute bottom-4 right-6 text-yellow-300 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                            Modified
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 px-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === tab.id
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <span>{tab.icon}</span>
                                {tab.label}
                            </span>
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 pb-16 overflow-y-auto h-[calc(100%-180px)] scrollbar-custom">
                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <SettingsSection
                            title="Appearance"
                            icon={<span className="text-xl">🎨</span>}
                        >
                            <SettingsSelect
                                label="Theme"
                                description="Choose your preferred color scheme"
                                value={settings.appearance.theme}
                                onChange={(val) => updateSetting('appearance', 'theme', val)}
                                options={[
                                    { value: 'light', label: 'Light' },
                                    { value: 'dark', label: 'Dark' },
                                    { value: 'system', label: 'Follow System' }
                                ]}
                            />

                            <div className='relative'>
                                <div className='absolute inset-0 z-10 cursor-not-allowed'></div>
                                <SettingsSelect
                                    label="Font Family"
                                    description="Default font for the interface"
                                    value={settings.appearance.fontFamily}
                                    onChange={(val) => updateSetting('appearance', 'fontFamily', val)}
                                    options={[
                                        { value: 'sans', label: 'Sans-serif (Inter)' },
                                        { value: 'serif', label: 'Serif (Source Serif)' },
                                        { value: 'reader', label: 'Reader Optimized' },
                                        { value: 'mono', label: 'Monospace' }
                                    ]}
                                />
                            </div>

                            <SettingsSlider
                                label="Font Size"
                                description="Base font size in pixels"
                                value={settings.appearance.fontSize}
                                min={10}
                                max={24}
                                step={1}
                                onChange={(val) => updateSetting('appearance', 'fontSize', val)}
                            />

                            <SettingsSwitch
                                label="Compact Mode"
                                description="Reduce spacing for more content"
                                disabled={true}
                                checked={settings.appearance.focusMode}
                                onChange={(val) => updateSetting('appearance', 'focusMode', val)}
                            />

                            <SettingsSwitch
                                label="Reduced Motion"
                                description="Minimize animations"
                                disabled={true}
                                checked={settings.appearance.reducedMotion}
                                onChange={(val) => updateSetting('appearance', 'reducedMotion', val)}
                            />
                        </SettingsSection>
                    )}

                    {/* Search Tab (integrates your existing functionality) */}
                    {activeTab === 'search' && (
                        <SettingsSection
                            title="Search Preferences"
                            icon={<span className="text-xl">🔍</span>}
                        >
                            <SettingsSelect
                                label="Default Search Mode"
                                description="Choose how searches are performed by default"
                                value={settings.search.defaultMode}
                                onChange={(val) => updateSetting('search', 'defaultMode', val)}
                                options={[
                                    { value: 'text', label: 'Full Text Search' },
                                    { value: 'titles', label: 'Section Titles Only' }
                                ]}
                            />

                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                                <label className="block mb-3 font-medium text-slate-700 dark:text-slate-200">
                                    Default Search Parts
                                </label>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5].map(part => (
                                        <div key={part} className="flex items-center gap-3">
                                            <label className="relative inline-flex items-center cursor-pointer ml-2">
                                                <input
                                                    type="checkbox"
                                                    id={`default-part-${part}`}
                                                    defaultChecked={settings.search.defaultParts.includes(part)}
                                                    onChange={(e) => {
                                                        const newParts = e.target.checked
                                                            ? [...settings.search.defaultParts, part]
                                                            : settings.search.defaultParts.filter(p => p !== part);
                                                        updateSetting('search', 'defaultParts', newParts);
                                                    }}
                                                    className="hidden rounded border-slate-300 text-primary-600 focus:ring-primary-500 sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                                            </label>
                                            <label htmlFor={`default-part-${part}`} className="text-sm text-gray-700 dark:text-white">
                                                Part {part}: {['Foreword', 'Central Universe', 'Local Universe', 'Urantia History', 'Jesus'][part - 1]}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <SettingsSwitch
                                label="Case Sensitive"
                                description="Match exact letter casing"
                                checked={settings.search.caseSensitive}
                                onChange={(val) => updateSetting('search', 'caseSensitive', val)}
                            />

                            <SettingsSwitch
                                label="Whole Words Only"
                                description="Match complete words only"
                                checked={settings.search.wholeWords}
                                onChange={(val) => updateSetting('search', 'wholeWords', val)}
                            />

                            <SettingsSwitch
                                label="Save Search History"
                                description="Remember your recent searches"
                                checked={settings.search.saveHistory}
                                onChange={(val) => updateSetting('search', 'saveHistory', val)}
                            />

                            <SettingsSlider
                                label="History Size"
                                description="Number of searches to remember"
                                value={settings.search.historySize}
                                min={10}
                                max={200}
                                step={10}
                                onChange={(val) => updateSetting('search', 'historySize', val)}
                                disabled={!settings.search.saveHistory}
                            />
                        </SettingsSection>
                    )}

                    {/* Reader Tab */}
                    {activeTab === 'reader' && (
                        <SettingsSection
                            title="Reader Settings"
                            icon={<span className="text-xl">📖</span>}
                        >
                            <SettingsSelect
                                label="Font Name"
                                description="Font for reading content"
                                value={settings.reader.fontName}
                                onChange={(e) => updateSetting('reader', 'fontName', e)}
                                options={appState.reader.Fonts}
                            />

                            <SettingsSlider
                                label="Font Size"
                                description="Reading text size"
                                value={settings.reader.fontSize}
                                min={16}
                                max={36}
                                step={1}
                                onChange={(val) => updateSetting('reader', 'fontSize', val)}
                            />

                            <SettingsSlider
                                label="Line Height"
                                description="Space between lines"
                                value={settings.reader.lineHeight}
                                min={2.0}
                                max={5.0}
                                step={0.1}
                                onChange={(val) => updateSetting('reader', 'lineHeight', val)}
                            />

                            <div className='relative'>
                                <div className='absolute inset-0 cursor-not-allowed'></div>
                                <SettingsSlider
                                    label="Max Width"
                                    description="Maximum content width (px)"
                                    disabled={true}
                                    value={settings.reader.maxWidth}
                                    min={400}
                                    max={1200}
                                    step={50}
                                    onChange={(val) => updateSetting('reader', 'maxWidth', val)}
                                />
                            </div>

                            <SettingsSwitch
                                label="Justify Text"
                                description="Align text evenly"
                                checked={settings.reader.justifyText}
                                disabled={true}
                                onChange={(val) => updateSetting('reader', 'justifyText', val)}
                            />

                            <div className='relative'>
                                <div className='absolute inset-0 cursor-not-allowed'></div>
                                <SettingsSlider
                                    label="Auto-scroll Speed"
                                    description="0 = disabled"
                                    value={settings.reader.autoScrollSpeed}
                                    min={0}
                                    max={10}
                                    step={0.5}
                                    onChange={(val) => updateSetting('reader', 'autoScrollSpeed', val)}
                                />
                            </div>
                        </SettingsSection>
                    )}

                    {/* Audio Tab */}
                    {activeTab === 'audio' && (
                        <SettingsSection
                            title="Audio Settings"
                            icon={<span className="text-xl">🔊</span>}
                        >
                            <SettingsSelect
                                label="Voice"
                                description="Text-to-speech voice"
                                value={settings.audio.voice}
                                onChange={(val) => updateSetting('audio', 'voice', val)}
                                options={[
                                    { value: 'default', label: 'System Default' },
                                    { value: 'ttskit3', label: 'TTSKit3' },
                                    { value: 'picowave', label: 'PicoWave' }
                                ]}
                            />

                            <SettingsSlider
                                label="Speech Speed"
                                description="Reading speed"
                                value={settings.audio.speed}
                                min={0.5}
                                max={2.0}
                                step={0.1}
                                onChange={(val) => updateSetting('audio', 'speed', val)}
                            />

                            <SettingsSlider
                                label="Pitch"
                                description="Voice pitch"
                                value={settings.audio.pitch}
                                min={0.5}
                                max={2.0}
                                step={0.1}
                                onChange={(val) => updateSetting('audio', 'pitch', val)}
                            />

                            <SettingsSwitch
                                label="Auto-play"
                                description="Automatically play audio when available"
                                checked={settings.audio.autoPlay}
                                onChange={(val) => updateSetting('audio', 'autoPlay', val)}
                            />
                        </SettingsSection>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <SettingsSection
                            title="Privacy & Data"
                            icon={<span className="text-xl">🔒</span>}
                        >
                            <SettingsSwitch
                                label="Analytics"
                                disabled={true}
                                description="Help improve UBook by sending anonymous usage data"
                                checked={settings.privacy.analytics}
                                onChange={(val) => updateSetting('privacy', 'analytics', val)}
                            />

                            <SettingsSwitch
                                label="Crash Reports"
                                disabled={true}
                                description="Automatically send crash reports"
                                checked={settings.privacy.crashReports}
                                onChange={(val) => updateSetting('privacy', 'crashReports', val)}
                            />

                            <SettingsSwitch
                                label="Auto-save Notes"
                                disabled={true}
                                description="Automatically save notes as you type"
                                checked={settings.privacy.autoSaveNotes}
                                onChange={(val) => updateSetting('privacy', 'autoSaveNotes', val)}
                            />

                            <div className="mt-6 pt-4 text-gray-700 dark:text-gray-200 border-t border-slate-200 dark:border-slate-700">
                                <h4 className="font-medium mb-3">Data Management</h4>
                                <div className="flex gap-3">
                                    <button
                                        onClick={exportSettings}
                                        className="px-4 py-2 text-gray-700 dark:text-white bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        Export Settings
                                    </button>
                                    <button
                                        onClick={importSettings}
                                        className="px-4 py-2 text-gray-700 dark:text-white bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        Import Settings
                                    </button>
                                </div>
                            </div>
                        </SettingsSection>
                    )}

                    {/* Shortcuts Tab */}
                    {activeTab === 'shortcuts' && (
                        <SettingsSection
                            title="Keyboard Shortcuts"
                            icon={<span className="text-xl">⌨️</span>}
                        >
                            {Object.entries(settings.shortcuts).map(([key, value]) => (
                                <SettingsInput
                                    key={key}
                                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    value={value}
                                    onChange={(val) => updateSetting('shortcuts', key, val)}
                                    placeholder="Press keys..."
                                />
                            ))}
                            <p className="text-xs text-slate-500 mt-2">
                                Click on a shortcut and press the desired key combination
                            </p>
                        </SettingsSection>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                    <div className="flex gap-3">
                        <button
                            onClick={resetToDefaults}
                            className="px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Reset to Defaults
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="px-6 py-2 text-gray-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveChanges}
                            disabled={!isModified}
                            className={`px-6 py-2 rounded-lg text-white font-medium transition-all bg-gradient-to-r ${isModified
                                ? 'from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-md'
                                : 'bg-slate-200 dark:bg-slate-600 cursor-not-allowed'
                                }`}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
