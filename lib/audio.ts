let audioInstance: HTMLAudioElement | null = null;

export function getAudioPlayer(): HTMLAudioElement {
  if (!audioInstance) {
    audioInstance = new Audio();
  }
  return audioInstance;
}

export function playAudio(src: string): Promise<void> {
  const audio = getAudioPlayer();
  audio.src = src;
  audio.currentTime = 0;
  return audio.play();
}

export function seekTo(time: number): void {
  const audio = getAudioPlayer();
  audio.currentTime = time;
}
