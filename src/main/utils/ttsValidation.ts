import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import which from 'which';
import type { TTSConfig } from '../types';
import type { ValidationResult, TTSValidationOptions } from './type';


const execPromise = promisify(exec);



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
        options: TTSValidationOptions = { checkExecutable: true, checkHelpFlag: true, timeout: 5000 }
    ): Promise<ValidationResult> => {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Basic validation
        if (!ttsConfig.engine?.trim()) {
            errors.push('Engine name is required');
        }
        if (!ttsConfig.command?.trim()) {
            errors.push('Command is required');
        }
        if (!ttsConfig.inputType) {
            errors.push('Input type is required');
        }
        if (!ttsConfig.outputFormat) {
            errors.push('Output format is required');
        }

        // Early return if basic validation fails
        if (errors.length > 0) {
            return { isValid: false, errors, warnings };
        }

        // Validate command safety
        const commandValidation = TTSValidator.validateCommandSafety(ttsConfig.command!);
        errors.push(...commandValidation.errors);
        warnings.push(...commandValidation.warnings);

        // Validate engine name
        const engineValidation = TTSValidator.validateEngineName(ttsConfig.engine!);
        errors.push(...engineValidation.errors);

        // Validate input type consistency
        if (ttsConfig.inputType === 'file' && !ttsConfig.command?.includes('file')) {
            warnings.push('File input type specified but command does not contain "file" placeholder');
        }
        if (ttsConfig.inputType === 'text' && !ttsConfig.command?.includes('text')) {
            warnings.push('Text input type specified but command does not contain "text" placeholder');
        }

        // Validate max text length
        if (ttsConfig.maxTextLength && (ttsConfig.maxTextLength < 1 || ttsConfig.maxTextLength > 100000)) {
            errors.push('Max text length must be between 1 and 100,000 characters');
        }

        // Check if executable exists (if requested)
        if (options.checkExecutable && ttsConfig.engine) {
            const existenceCheck = await TTSValidator.checkExecutableExists(ttsConfig.engine);
            if (!existenceCheck.exists) {
                errors.push(`Engine executable "${ttsConfig.engine}" not found in PATH or as absolute path`);
            }
            if (existenceCheck.warning) {
                warnings.push(existenceCheck.warning);
            }
        }

        // Test command with help flag (if requested)
        if (options.checkHelpFlag && ttsConfig.command && errors.length === 0) {
            const helpTest = await TTSValidator.testCommandWithHelp(ttsConfig.command, options.timeout);
            if (!helpTest.success) {
                warnings.push(`Command help test failed: ${helpTest.error}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    },

    validateCommandSafety: (command: string): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check for dangerous patterns
        for (const pattern of TTSValidator.DANGEROUS_PATTERNS) {
            if (pattern.test(command)) {
                errors.push(`Command contains potentially dangerous pattern: ${pattern.toString()}`);
            }
        }

        // Check command length
        if (command.length > TTSValidator.MAX_COMMAND_LENGTH) {
            warnings.push(`Command exceeds ${TTSValidator.MAX_COMMAND_LENGTH} characters`);
        }

        // Validate command format
        const commandParts = command.split(' ');
        const baseCommand = commandParts[0];

        if (!TTSValidator.ALLOWED_FLAGS.test(baseCommand)) {
            errors.push(`Invalid characters in command name: ${baseCommand}`);
        }

        // Check for environment variable injection
        if (command.includes('$') && !command.includes('${')) {
            warnings.push('Command contains $ which might be environment variable injection');
        }

        // Check for multiple commands
        const hasMultipleCommands = /[;&|]/.test(command);
        if (hasMultipleCommands) {
            errors.push('Command contains multiple commands (;&|) which is not allowed');
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

        // if (engine.includes('/') || engine.includes('\\')) {
        //     errors.push('Engine name should not contain path separators');
        // }

        return { isValid: errors.length === 0, errors, warnings: [] };
    },

    checkExecutableExists: async (executable: string): Promise<{ exists: boolean; warning?: string }> => {
        try {
            // Check if it's an absolute path
            if (fs.existsSync(executable)) {
                const stats = await fs.promises.stat(executable);
                if (!stats.isFile()) {
                    return { exists: false, warning: 'Path exists but is not a file' };
                }
                if ((stats.mode & 0o111) === 0) {
                    return { exists: false, warning: 'File is not executable' };
                }
                return { exists: true };
            }

            // Check in PATH
            const pathCheck = await which(executable).catch(() => null);
            if (pathCheck) {
                return { exists: true };
            }

            return { exists: false };
        } catch (error) {
            return { exists: false };
        }
    },

    testCommandWithHelp: async (command: string, timeout: number | undefined): Promise<{ success: boolean; error?: string }> => {
        try {
            // Replace placeholders with safe test values
            let testCommand = command
            .replace('{file}', '/tmp/test.txt')
            .replace('{text}', 'test')
            .replace('{output}', '/tmp/output.wav');

            // Add help flag if not already present
            if (!testCommand.includes('-h') && !testCommand.includes('--help')) {
                testCommand += ' -h';
            }

            await execPromise(testCommand, { timeout }); ///, shell: false });
            return { success: true };
        } catch (error: any) {
            // Help command often returns non-zero exit code, so we check stderr
            if (error.stderr?.includes('usage') || error.stderr?.includes('help')) {
                return { success: true };
            }
            return { success: false, error: error.message };
        }
    }
};
