import { convertFileSrc } from '@tauri-apps/api/core';

let audioContext: AudioContext | undefined;
let audioBuffer: AudioBuffer | undefined;
let sourceNode: AudioBufferSourceNode | undefined;
let pauseTime = 0;
let startTime = 0;
let isManualStop = false;
let currentOffset = 0;

function playFrom(offset = 0): void {
  if (!audioBuffer || !audioContext) return;
  if (sourceNode) {
    try { sourceNode.stop(); } catch {}
    sourceNode.disconnect();
  }
  sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.connect(audioContext.destination);
  startTime = audioContext.currentTime - offset;
  currentOffset = offset;

  sourceNode.onended = () => {
    if (!isManualStop) {
      setTimeout(() => document.dispatchEvent(new Event('play-finished')), 0);
    } else {
      isManualStop = false;
    }
  };
  sourceNode.start(0, offset);
}

export const playerApi = {
  play: async (filePath: string | null = null): Promise<boolean> => {
    if (!filePath) return false;
    try {
      if (!audioContext) audioContext = new AudioContext();
      // Tauri: turn a local path into a webview-loadable URL.
      const url = convertFileSrc(filePath);
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      if (arrayBuffer.byteLength === 0) throw new Error('Empty audio buffer');
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      playFrom(0);
      return true;
    } catch (err) {
      console.error('Playback error:', err);
      return false;
    }
  },
  pause: (): string => {
    if (sourceNode && audioContext) {
      isManualStop = true;
      sourceNode.stop();
      pauseTime = audioContext.currentTime - startTime;
      sourceNode = undefined;
    }
    return 'paused';
  },
  resume: (time: number | null = null): string => {
    pauseTime = time !== null ? time : pauseTime;
    if (audioBuffer && pauseTime) {
      playFrom(pauseTime);
      pauseTime = 0;
      return 'resumed';
    }
    return 'Nothing to resume';
  },
  stop: (): string => {
    isManualStop = true;
    if (sourceNode) {
      sourceNode.stop();
      sourceNode = undefined;
    }
    audioBuffer = undefined;
    pauseTime = 0;
    currentOffset = 0;
    return 'stopped';
  },
  seek: (seconds: number): string => {
    if (!audioBuffer) return 'No audio loaded';
    const offset = Math.min(Math.max(0, seconds), audioBuffer.duration);
    playFrom(offset);
    return `Seeked to ${offset.toFixed(2)}s`;
  },
  fastForward: (seconds = 5): string => {
    if (!audioBuffer) return 'No audio loaded';
    let next = currentOffset + seconds;
    if (next >= audioBuffer.duration) next = audioBuffer.duration - 0.1;
    playFrom(next);
    return next.toFixed(2);
  },
  rewind: (seconds = 5): string => {
    if (!audioBuffer) return 'No audio loaded';
    let next = currentOffset - seconds;
    if (next < 0) next = 0;
    playFrom(next);
    return next.toFixed(2);
  },
  getDuration: (): number => audioBuffer?.duration || 0,
  getCurrentTime: (): number => currentOffset,
  isPlaying: (): boolean => sourceNode !== undefined && !isManualStop,
};
