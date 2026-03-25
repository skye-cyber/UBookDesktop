/// <reference path="../../types/preload.d.ts" />
/// <reference path="../../main/types.ts" />
/// <reference path="../../main/types/utils/ttsValidation.d.ts" />
import type { ValidationResult } from '../../main/utils/type';
import type { TTSConfig } from '../../main/types';
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Alert,
    CircularProgress,
    Box,
    Typography,
    Chip,
    IconButton,
    //     Tooltip,
    Collapse,
    Paper
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
    Warning as WarningIcon,
    Error as ErrorIcon,
    CheckCircle as CheckCircleIcon,
    Help as HelpIcon,
    Close as CloseIcon,
    Save as SaveIcon,
    Terminal as TerminalIcon
} from '@mui/icons-material';


interface TTSConfigManagerProps {
    open: boolean;
    onClose: () => void;
    initialConfig?: Partial<TTSConfig>;
    onSave: (config: TTSConfig) => Promise<void>;
    ubookConfigApi: any;
}

export const TTSConfigManager: React.FC<TTSConfigManagerProps> = ({
    open,
    onClose,
//     initialConfig,
    onSave,
    ubookConfigApi
}) => {
    const [config, setConfig] = useState<Partial<TTSConfig>>({
        inputType: 'text',
        maxTextLength: 1000,
        outputFormat: 'wav'
    });
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    // Command placeholders help
    const commandPlaceholders = [
        { placeholder: 'file', description: 'Path to input file' },
        { placeholder: 'text', description: 'Text to convert' },
        { placeholder: 'output', description: 'Output file path' }
    ];


    // Validate on config change
    useEffect(() => {
        const validate = async () => {
            if (config.engine && config.command) {
                const result = await window.ubook.TTSValidator.validateTTS(config, {
                    checkExecutable: true,
                    checkHelpFlag: false,
                    timeout: 3000
                });
                setValidationResult(result);
                console.log(config)
            }
        };
        validate();
    }, [config.engine, config.command, config.inputType]);

    const handleTestCommand = async () => {
        setTesting(true);
        setTestResult(null);

        try {
            const result = await window.ubook.TTSValidator.validateTTS(config, {
                checkExecutable: true,
                checkHelpFlag: true,
                timeout: 10000
            });

            if (result.isValid) {
                setTestResult({
                    success: true,
                    message: 'Command validation passed! Ready to use.'
                });
            } else {
                console.log(config)
                setTestResult({
                    success: false,
                    message: `Validation failed: ${result.errors.join(', ')}`
                });
            }
            setValidationResult(result);
        } catch (error: any) {
            setTestResult({
                success: false,
                message: `Test failed: ${error.message}`
            });
        } finally {
            setTesting(false);
        }
    };

    const handleSave = async () => {
        if (!validationResult?.isValid) {
            // Re-validate with full checks before saving
            const fullValidation = await window.ubook.TTSValidator.validateTTS(config, {
                checkExecutable: true,
                checkHelpFlag: true,
                timeout: 5000
            });

            if (!fullValidation.isValid) {
                setValidationResult(fullValidation);
                return;
            }
        }

        setSaving(true);
        try {
            // Call ubook.configApi to save
            await window.ubook.config.updateTTS(config)
            await onSave(config as TTSConfig);
            onClose();
        } catch (error: any) {
            console.log(error)
            setTestResult({
                success: false,
                message: `Save failed: ${error.message}`
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    minHeight: '60vh',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 100%)',
                    //                     backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                },
            }}
        >
            {/* Header with gradient accent */}
            <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <TerminalIcon sx={{ fontSize: 18, color: 'white' }} />
                        </Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            TTS Engine Configuration
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={onClose}
                        size="small"
                        sx={{
                            bgcolor: 'action.hover',
                            '&:hover': { bgcolor: 'action.selected' }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ px: 3, py: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Basic Configuration Section */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                color: 'text.secondary',
                            }}
                        >
                            Basic Configuration
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                label="Engine Name"
                                value={config.engine || ''}
                                onChange={(e) => setConfig({ ...config, engine: e.target.value })}
                                helperText="The executable name or path (e.g., 'espeak', '/usr/bin/espeak')"
                                error={validationResult?.errors.some(e => e.includes('engine'))}
                                fullWidth
                                required
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                        },
                                    },
                                }}
                            />

                            <TextField
                                label="Command Template eg espeak '{text}' -o '{output}'"
                                value={config.command || ''}
                                onChange={(e) => setConfig({ ...config, command: e.target.value })}
                                onKeyDown={(e) => {
                                    // Allow space key to work normally
                                    if (e.key === ' ') {
                                        e.stopPropagation();
                                    }
                                }}
                                helperText={
                                    <Typography
                                        component="p"
                                        variant="caption"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: 0.5,
                                            mt: 0.5,
                                        }}
                                    >
                                        <span>Use placeholders: </span>
                                        {commandPlaceholders.map(({ placeholder, description }) => (
                                            <Chip
                                                component="span"
                                                key={placeholder}
                                                label={placeholder}
                                                size="small"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setConfig({
                                                        ...config,
                                                        command: (config.command || '') + ` ${placeholder}`
                                                    });
                                                }}
                                                title={description}
                                                sx={{
                                                    borderRadius: '6px',
                                                    fontWeight: 500,
                                                    fontSize: '0.7rem',
                                                    height: '24px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    bgcolor: 'action.selected',
                                                    '&:hover': {
                                                        bgcolor: 'primary.main',
                                                        color: 'primary.contrastText',
                                                        transform: 'translateY(-1px)',
                                                    },
                                                }}
                                            />
                                        ))}
                                    </Typography>
                                }
                                error={validationResult?.errors.some(e => e.includes('command'))}
                                fullWidth
                                multiline
                                rows={2}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        fontFamily: 'monospace',
                                    },
                                    '& .MuiFormHelperText-root': {
                                        marginTop: '8px',
                                    },
                                }}
                            />

                            <FormControl fullWidth required>
                                <InputLabel>Input Type</InputLabel>
                                <Select
                                    value={config.inputType}
                                    label="Input Type"
                                    defaultValue='text'
                                    onChange={(e) => setConfig({ ...config, inputType: e.target.value as 'text' | 'file' })}
                                    sx={{ borderRadius: '12px' }}
                                >
                                    <MenuItem value="text">
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <TextFieldsIcon fontSize="small" />
                                            <span>Text Input</span>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="file">
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <InsertDriveFileIcon fontSize="small" />
                                            <span>File Input</span>
                                        </Box>
                                    </MenuItem>
                                </Select>
                                <FormHelperText>
                                    {config.inputType === 'text'
                                        ? 'Command will receive text directly via stdin or argument'
                                        : 'Command will receive a file path to read from'}
                                </FormHelperText>
                            </FormControl>

                            <TextField
                                label="Output Format"
                                value={config.outputFormat || 'wav'}
                                defaultValue="wav"
                                onChange={(e) => setConfig({ ...config, outputFormat: e.target.value })}
                                helperText="File extension or format (e.g., 'wav', 'mp3', 'ogg')"
                                fullWidth
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Advanced Configuration Section */}
                    <Box>
                        <Button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            startIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            variant="text"
                            size="small"
                            sx={{
                                mb: 1,
                                color: 'text.secondary',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            Advanced Options
                        </Button>

                        <Collapse in={showAdvanced}>
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 2.5,
                                    borderRadius: '16px',
                                    bgcolor: 'action.hover',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <TextField
                                        label="Fallback Command"
                                        value={config.fallbackCommand || ''}
                                        onChange={(e) => setConfig({ ...config, fallbackCommand: e.target.value })}
                                        helperText="Command to use if primary fails (optional)"
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                            },
                                        }}
                                    />

                                    <TextField
                                        label="Max Text Length"
                                        type="number"
                                        value={config.maxTextLength || 1000}
                                        onChange={(e) => setConfig({ ...config, maxTextLength: parseInt(e.target.value) })}
                                        helperText="Maximum characters allowed for text input"
                                        fullWidth
                                        InputProps={{
                                            inputProps: { min: 1, max: 100000 },
                                            sx: { borderRadius: '12px' }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Collapse>
                    </Box>

                    {/* Validation Results with Elegant Cards */}
                    {validationResult && (
                        <Box sx={{ mt: 1 }}>
                            {validationResult.errors.map((error, idx) => (
                                <Alert
                                    key={idx}
                                    severity="error"
                                    icon={<ErrorIcon />}
                                    sx={{
                                        mb: 1.5,
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: 'error.main',
                                        bgcolor: 'error.dark',
                                        color: 'error.contrastText',
                                    }}
                                >
                                    {error}
                                </Alert>
                            ))}
                            {validationResult.warnings.map((warning, idx) => (
                                <Alert
                                    key={idx}
                                    severity="warning"
                                    icon={<WarningIcon />}
                                    sx={{
                                        mb: 1.5,
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: 'warning.main',
                                    }}
                                >
                                    {warning}
                                </Alert>
                            ))}
                            {validationResult.isValid && validationResult.warnings.length === 0 && (
                                <Alert
                                    severity="success"
                                    icon={<CheckCircleIcon sx={{fill:"white"}}/>}
                                    sx={{
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: 'success.main',
                                        bgcolor: 'success.dark',
                                        color: 'white'
                                    }}
                                >
                                    ✓ Configuration is valid and ready to use!
                                </Alert>
                            )}
                        </Box>
                    )}

                    {/* Test Result with Status Indicator */}
                    {testResult && (
                        <Alert
                            severity={testResult.success ? 'success' : 'error'}
                            sx={{
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: testResult.success ? 'success.main' : 'error.main',
                            }}
                        >
                            <Box display="flex" alignItems="center" gap={1}>
                                {testResult.success ? (
                                    <PlayCircleIcon fontSize="small" />
                                ) : (
                                    <ErrorOutlineIcon fontSize="small" />
                                )}
                                <span>{testResult.message}</span>
                            </Box>
                        </Alert>
                    )}

                    {/* Command Preview with Code Block */}
                    {config.command && (
                        <Box sx={{ mt: 1 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    mb: 1,
                                    display: 'block',
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontSize: '0.7rem',
                                }}
                            >
                                Command Preview
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    bgcolor: 'background.default',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    fontFamily: 'monospace',
                                    fontSize: '0.85rem',
                                }}
                            >
                                <Box component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                    {config.command}
                                </Box>
                                <Box
                                    sx={{
                                        mt: 1.5,
                                        pt: 1.5,
                                        borderTop: '1px solid',
                                        borderTopColor: 'divider',
                                        fontSize: '0.75rem',
                                        color: 'text.secondary',
                                    }}
                                >
                                    <span>Example: </span>
                                    <code>
                                        {config.command
                                            .replace('file', '/path/to/file.txt')
                                            .replace('text', 'Hello World')
                                            .replace('output', '/path/to/output.wav')}
                                    </code>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
                <Button
                    onClick={onClose}
                    disabled={saving}
                    sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        px: 2,
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleTestCommand}
                    disabled={testing || !config.engine || !config.command}
                    startIcon={testing ? <CircularProgress size={18} /> : <PlayCircleIcon />}
                    variant="outlined"
                    sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        px: 2,
                    }}
                >
                    Test Command
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={saving || !validationResult?.isValid}
                    startIcon={saving ? <CircularProgress size={18} /> : <SaveIcon />}
                    sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        color: 'white',
                        px: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a0 100%)',
                        },
                    }}
                >
                    Save Configuration
                </Button>
            </DialogActions>
        </Dialog>
    );
};
