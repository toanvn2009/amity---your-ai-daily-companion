import React, { useState, useRef, useEffect } from "react";

// Royalty-free music from Pixabay
const TRACKS = [
  {
    id: 1,
    name: "Lofi Study",
    emoji: "☕",
    url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
  },
  {
    id: 2,
    name: "Piano Rain",
    emoji: "🎹",
    url: "https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73467.mp3",
  },
  {
    id: 3,
    name: "Soft Morning",
    emoji: "🌅",
    url: "https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3",
  },
  {
    id: 4,
    name: "Night Reflection",
    emoji: "🌙",
    url: "https://cdn.pixabay.com/audio/2022/02/10/audio_fc06b72a6a.mp3",
  },
];

const AmbientPlayer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // Load saved state
    const saved = localStorage.getItem("amity_ambient_music");
    if (saved) {
      const { trackId, vol } = JSON.parse(saved);
      const savedTrack = TRACKS.find((t) => t.id === trackId);
      if (savedTrack) {
        setCurrentTrack(savedTrack);
        audioRef.current.src = savedTrack.url;
      }
      setVolume(vol);
      audioRef.current.volume = vol;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "amity_ambient_music",
      JSON.stringify({ trackId: currentTrack.id, vol: volume }),
    );
  }, [currentTrack, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (audioRef.current.src !== currentTrack.url) {
      setIsLoading(true);
      const wasPlaying = isPlaying;

      audioRef.current.src = currentTrack.url;
      audioRef.current.load();

      audioRef.current.oncanplay = () => {
        setIsLoading(false);
        if (wasPlaying) {
          audioRef.current?.play().catch(() => setIsPlaying(false));
        }
      };
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Audio play failed:", err);
        });
    }
  };

  const selectTrack = (track: (typeof TRACKS)[0]) => {
    if (currentTrack.id === track.id) return;
    setCurrentTrack(track);
    // Playback state will be handled by the useEffect above
  };

  return (
    <div className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-[80]">
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="absolute bottom-16 left-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-xl p-4 w-60 animate-in slide-in-from-bottom duration-300">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
            🎵 Nhạc nhẹ thư giãn
          </h3>

          {/* Track Selection */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => selectTrack(track)}
                className={`flex flex-col items-center p-3 rounded-xl text-xs transition-all relative overflow-hidden ${
                  currentTrack.id === track.id
                    ? "bg-indigo-500 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {/* Visual indicator */}
                {currentTrack.id === track.id && isPlaying && (
                  <div className="absolute inset-0 flex items-end justify-center gap-0.5 opacity-20 pb-1">
                    <span className="w-1 bg-white animate-[bounce_1s_infinite]"></span>
                    <span className="w-1 bg-white animate-[bounce_1.2s_infinite] h-3"></span>
                    <span className="w-1 bg-white animate-[bounce_0.8s_infinite] h-2"></span>
                  </div>
                )}

                <span className="text-xl mb-1 z-10">{track.emoji}</span>
                <span className="font-medium truncate w-full text-center z-10">
                  {track.name}
                </span>
              </button>
            ))}
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg">
            <span className="text-slate-400 text-xs">
              {volume === 0 ? "🔇" : "🔈"}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-slate-400 text-xs">🔊</span>
          </div>
        </div>
      )}

      {/* Main Button */}
      <div className="relative group">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
            isPlaying
              ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-300/50"
              : "bg-white/90 dark:bg-slate-700/90 text-slate-600 dark:text-slate-300 backdrop-blur-sm"
          }`}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-6 w-6 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <span
              className={`text-2xl transition-transform duration-500 ${isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`}
            >
              {isPlaying ? "💿" : "🎵"}
            </span>
          )}
        </button>

        {/* Play/Pause Overlay */}
        {isExpanded && !isLoading && (
          <button
            onClick={togglePlay}
            className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
              isPlaying ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
            }`}
          >
            <span className="text-[10px]">{isPlaying ? "⏸" : "▶"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AmbientPlayer;
