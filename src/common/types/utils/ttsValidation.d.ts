import type { TTSConfig } from '../types';
import type { ValidationResult, TTSValidationOptions } from './type';
export declare const TTSValidator: {
    DANGEROUS_PATTERNS: RegExp[];
    ALLOWED_FLAGS: RegExp;
    MAX_COMMAND_LENGTH: number;
    validateTTS: (ttsConfig: Partial<TTSConfig>, options?: TTSValidationOptions) => Promise<ValidationResult>;
    validateCommandSafety: (command: string) => ValidationResult;
    validateEngineName: (engine: string) => ValidationResult;
    checkExecutableExists: (executable: string) => Promise<{
        exists: boolean;
        warning?: string;
    }>;
    testCommandWithHelp: (command: string, timeout: number | undefined) => Promise<{
        success: boolean;
        error?: string;
    }>;
};
//# sourceMappingURL=ttsValidation.d.ts.map