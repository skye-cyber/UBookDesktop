import type { TTSConfig } from "../types";

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface TTSValidationOptions {
    checkExecutable?: boolean;
    checkHelpFlag?: boolean;
    timeout?: number;
}

export interface TTSValidator {
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
