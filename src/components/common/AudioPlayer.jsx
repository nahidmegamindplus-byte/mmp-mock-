import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, AlertCircle } from 'lucide-react';

export default function AudioPlayer({ audioSrc, transcript, partTitle = 'Part 1', autoPlay = false, isExam = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [useSpeechFallback, setUseSpeechFallback] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    // Reset state when audioSrc changes
    setIsPlaying(false);
    setCurrentTime(0);
  }, [audioSrc]);

  const togglePlay = () => {
    if (useSpeechFallback) {
      if ('speechSynthesis' in window) {
        if (isPlaying) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
        } else {
          const text = transcript || `This is IELTS Listening ${partTitle}. You will hear a number of different recordings and you will have to answer questions on what you hear. Listen carefully and write your answers on the question sheet.`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.95;
          utterance.lang = 'en-GB';
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        }
      }
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn('Audio element playback error, switching to synthesis fallback:', e);
        setUseSpeechFallback(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 180);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-3.5 shadow-md border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onError={() => setUseSpeechFallback(true)}
        />
      )}

      {/* Title & Status */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 ${
            isPlaying ? 'bg-megamind-500 hover:bg-megamind-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-megamind-400 border border-slate-700'
          }`}
          aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div className="min-w-[120px]">
          <p className="text-xs font-bold tracking-tight text-white">{partTitle}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-[10px] text-slate-400 font-medium">
              {isPlaying ? 'Playing Audio' : 'Ready to Play'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Waveform */}
      <div className="flex-1 w-full flex items-center gap-3">
        <span className="text-xs font-mono text-slate-400 min-w-[36px]">
          {formatTime(currentTime)}
        </span>

        <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden relative">
          <div
            className="bg-megamind-500 h-full rounded-full transition-all duration-150"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : (isPlaying ? 50 : 0)}%` }}
          />
        </div>

        <span className="text-xs font-mono text-slate-400 min-w-[36px]">
          {duration > 0 ? formatTime(duration) : '03:00'}
        </span>
      </div>

      {/* Equalizer Wave Bars Simulation */}
      <div className="hidden lg:flex items-center gap-1 h-5 px-2">
        {[40, 70, 95, 60, 80, 45, 85].map((height, i) => (
          <div
            key={i}
            className={`w-1 bg-megamind-400 rounded-full transition-all duration-200 ${
              isPlaying ? 'animate-bounce' : 'opacity-30'
            }`}
            style={{
              height: isPlaying ? `${height}%` : '20%',
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-slate-400 hover:text-white p-1"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-megamind-500"
          aria-label="Volume Slider"
        />
      </div>
    </div>
  );
}
