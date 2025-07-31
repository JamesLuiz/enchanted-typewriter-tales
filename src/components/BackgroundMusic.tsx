import { useEffect, useRef } from 'react';

interface BackgroundMusicProps {
  isPlaying: boolean;
  volume?: number;
}

export const BackgroundMusic = ({ isPlaying, volume = 0.3 }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
      src="https://assets.mixkit.co/music/preview/mixkit-forest-treasure-138.mp3"
    />
  );
};