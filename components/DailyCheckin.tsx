import React, { useState, useEffect } from "react";
import { MoodType } from "../types";

interface DailyCheckinProps {
  onMoodSelect: (mood: MoodType) => void;
  onClose: () => void;
}

const MOOD_OPTIONS: { mood: MoodType; emoji: string; label: string }[] = [
  { mood: "happy", emoji: "😊", label: "Vui vẻ" },
  { mood: "excited", emoji: "🤩", label: "Hào hứng" },
  { mood: "neutral", emoji: "😐", label: "Bình thường" },
  { mood: "tired", emoji: "😫", label: "Mệt mỏi" },
  { mood: "sad", emoji: "😢", label: "Buồn" },
  { mood: "anxious", emoji: "😰", label: "Lo lắng" },
];

const DailyCheckin: React.FC<DailyCheckinProps> = ({
  onMoodSelect,
  onClose,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleMoodClick = (mood: MoodType) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
    setShowThankYou(true);

    // Auto close after 1.5 seconds
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {!showThankYou ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">🌸</span>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Chào buổi sáng!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Hôm nay bạn cảm thấy thế nào?
              </p>
            </div>

            {/* Mood Grid */}
            <div className="grid grid-cols-3 gap-3">
              {MOOD_OPTIONS.map(({ mood, emoji, label }) => (
                <button
                  key={mood}
                  onClick={() => handleMoodClick(mood)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                    selectedMood === mood
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200"
                      : "bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-600 shadow-sm"
                  }`}
                >
                  <span className="text-3xl mb-1">{emoji}</span>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* Skip */}
            <button
              onClick={onClose}
              className="w-full mt-4 text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Để sau nhé
            </button>
          </>
        ) : (
          /* Thank You State */
          <div className="text-center py-6">
            <span className="text-5xl mb-3 block animate-bounce">💕</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Cảm ơn bạn!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Mình đã ghi nhận cảm xúc của bạn rồi
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook to check if should show daily checkin
export const useDailyCheckin = () => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const lastCheckin = localStorage.getItem("amity_last_checkin");
    const today = new Date().toDateString();

    if (lastCheckin !== today) {
      // Show after 1 second delay for better UX
      const timer = setTimeout(() => setShouldShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const markCheckinDone = () => {
    localStorage.setItem("amity_last_checkin", new Date().toDateString());
    setShouldShow(false);
  };

  return { shouldShow, markCheckinDone, close: () => setShouldShow(false) };
};

export default DailyCheckin;
