import { invoke } from '@tauri-apps/api/core';
import type { TTSConfig } from '../types';
import type { ValidationResult, TTSValidationOptions } from './type';

interface ExecutableCheck {
    exists: boolean;
    warning?: string | null;
}

interface HelpTestResult {
    success: boolean;
    error?: string | null;
}

export const TTSValidator = {
    DANGEROUS_PATTERNS: [
        /[;&|`$]/,
        /\.\./,
        /\brm\b/,
        /\bdel\b/,
        /\bformat\b/,
        /\bcurl\b.*\|/i,
        /\bwget\b.*\|/i,
    ],

    ALLOWED_FLAGS: /^[a-zA-Z0-9_\-./]+$/,
    MAX_COMMAND_LENGTH: 255,

    validateTTS: async (
        ttsConfig: Partial<TTSConfig>,
        options: TTSValidationOptions = {
            checkExecutable: true,
            checkHelpFlag: true,
            timeout: 5000,
        },
    ): Promise<ValidationResult> => {
        const errors: string[] = [];
        const warnings: string[] = [];

        // --- Basic validation (unchanged) ---
        if (!ttsConfig.engine?.trim()) errors.push('Engine name is required');
        if (!ttsConfig.command?.trim()) errors.push('Command is required');
        if (!ttsConfig.inputType) errors.push('Input type is required');
        if (!ttsConfig.outputFormat) errors.push('Output format is required');

        if (errors.length > 0) return { isValid: false, errors, warnings };

        // --- Command safety (unchanged) ---
        const commandValidation = TTSValidator.validateCommandSafety(ttsConfig.command!);
        errors.push(...commandValidation.errors);
        warnings.push(...commandValidation.warnings);

        // --- Engine name (unchanged) ---
        const engineValidation = TTSValidator.validateEngineName(ttsConfig.engine!);
        errors.push(...engineValidation.errors);

        // --- Input type consistency (unchanged) ---
        if (ttsConfig.inputType === 'file' && !ttsConfig.command?.includes('file')) {
            warnings.push(
                'File input type specified but command does not contain "file" placeholder',
            );
        }
        if (ttsConfig.inputType === 'text' && !ttsConfig.command?.includes('text')) {
            warnings.push(
                'Text input type specified but command does not contain "text" placeholder',
            );
        }

        // --- Max text length (unchanged) ---
        if (
            ttsConfig.maxTextLength &&
            (ttsConfig.maxTextLength < 1 || ttsConfig.maxTextLength > 100000)
        ) {
            errors.push('Max text length must be between 1 and 100,000 characters');
        }

        // --- Executable existence check (moved to Rust) ---
        if (options.checkExecutable && ttsConfig.engine) {
            const existenceCheck = await TTSValidator.checkExecutableExists(
                ttsConfig.engine,
            );
            if (!existenceCheck.exists) {
                errors.push(
                    `Engine executable "${ttsConfig.engine}" not found in PATH or as absolute path`,
                );
            }
            if (existenceCheck.warning) warnings.push(existenceCheck.warning);
        }

        // --- Help-flag test (moved to Rust) ---
        if (options.checkHelpFlag && ttsConfig.command && errors.length === 0) {
            const helpTest = await TTSValidator.testCommandWithHelp(
                ttsConfig.command,
                options.timeout,
            );
            if (!helpTest.success) {
                warnings.push(`Command help test failed: ${helpTest.error}`);
            }
        }

        return { isValid: errors.length === 0, errors, warnings };
    },

    validateCommandSafety: (command: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];

        for (const pattern of TTSValidator.DANGEROUS_PATTERNS) {
            if (pattern.test(command)) {
                errors.push(
                    `Command contains potentially dangerous pattern: ${pattern.toString()}`,
                );
            }
        }

        if (command.length > TTSValidator.MAX_COMMAND_LENGTH) {
            warnings.push(
                `Command exceeds ${TTSValidator.MAX_COMMAND_LENGTH} characters`,
            );
        }

        const commandParts = command.split(' ');
        const baseCommand = commandParts[0];

        if (!TTSValidator.ALLOWED_FLAGS.test(baseCommand)) {
            errors.push(`Invalid characters in command name: ${baseCommand}`);
        }

        if (command.includes('$') && !command.includes('${')) {
            warnings.push(
                'Command contains $ which might be environment variable injection',
            );
        }

        const hasMultipleCommands = /[;&|]/.test(command);
        if (hasMultipleCommands) {
            errors.push(
                'Command contains multiple commands (;&|) which is not allowed',
            );
        }

        return { isValid: errors.length === 0, errors, warnings };
    },

    validateEngineName: (engine: string): ValidationResult => {
        const errors: string[] = [];

        if (!TTSValidator.ALLOWED_FLAGS.test(engine)) {
            errors.push(`Invalid characters in engine name: ${engine}`);
        }

        if (engine.split(' ').length > 1) {
            errors.push('Engine name should be a single word without spaces');
        }

        return { isValid: errors.length === 0, errors, warnings: [] };
    },

    // ---- Migrated: calls Rust instead of Node's fs + which ---------------

    checkExecutableExists: async (
        executable: string,
    ): Promise<{ exists: boolean; warning?: string }> => {
        try {
            const res = await invoke<ExecutableCheck>('check_executable_exists', {
                executable,
            });
            return {
                exists: res.exists,
                warning: res.warning ?? undefined,
            };
        } catch {
            return { exists: false };
        }
    },

    testCommandWithHelp: async (
        command: string,
        timeout: number | undefined,
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await invoke<HelpTestResult>('test_command_with_help', {
                command,
                timeoutMs: timeout ?? 5000,
            });
            return {
                success: res.success,
                error: res.error ?? undefined,
            };
        } catch (err) {
            return { success: false, error: String(err) };
        }
    },
};
