export declare const playerApi: {
    play: (filePath?: string | null) => Promise<boolean>;
    pause: () => string;
    resume: (time?: number | null) => string;
    stop: () => string;
    seek: (seconds: number) => string;
    fastForward: (seconds?: number) => string;
    rewind: (seconds?: number) => string;
    getDuration: () => number;
    getCurrentTime: () => number;
    isPlaying: () => boolean;
};
//# sourceMappingURL=player.d.ts.map