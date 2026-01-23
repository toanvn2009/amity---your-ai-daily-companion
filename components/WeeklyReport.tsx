import React, { useMemo } from "react";
import { MoodRecord, MoodType } from "../types";
import { format, subDays, isAfter } from "date-fns";
import { vi } from "date-fns/locale";

interface WeeklyReportProps {
  moodHistory: MoodRecord[];
  onClose: () => void;
}

const MOOD_LABELS: Record<
  MoodType,
  { emoji: string; label: string; color: string }
> = {
  happy: { emoji: "😊", label: "Vui vẻ", color: "bg-yellow-400" },
  excited: { emoji: "🤩", label: "Hào hứng", color: "bg-orange-400" },
  neutral: { emoji: "😐", label: "Bình thường", color: "bg-slate-400" },
  tired: { emoji: "😫", label: "Mệt mỏi", color: "bg-blue-400" },
  sad: { emoji: "😢", label: "Buồn", color: "bg-indigo-400" },
  anxious: { emoji: "😰", label: "Lo lắng", color: "bg-rose-400" },
};

const WeeklyReport: React.FC<WeeklyReportProps> = ({
  moodHistory,
  onClose,
}) => {
  const weeklyData = useMemo(() => {
    const weekAgo = subDays(new Date(), 7);
    return moodHistory.filter((m) => isAfter(new Date(m.timestamp), weekAgo));
  }, [moodHistory]);

  const moodCounts = useMemo(() => {
    const counts: Record<MoodType, number> = {
      happy: 0,
      excited: 0,
      neutral: 0,
      tired: 0,
      sad: 0,
      anxious: 0,
    };
    weeklyData.forEach((m) => counts[m.mood]++);
    return counts;
  }, [weeklyData]);

  const dominantMood = useMemo(() => {
    const sorted = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[1] > 0 ? (sorted[0][0] as MoodType) : null;
  }, [moodCounts]);

  const totalMoods = weeklyData.length;

  const getInsight = () => {
    if (totalMoods === 0) {
      return "Chưa có dữ liệu tuần này. Hãy chia sẻ cảm xúc mỗi ngày nhé! 💕";
    }
    if (dominantMood === "happy" || dominantMood === "excited") {
      return "Tuần này bạn thật tích cực! Hãy giữ vững năng lượng này nhé! 🌟";
    }
    if (dominantMood === "sad" || dominantMood === "anxious") {
      return "Tuần này hơi khó khăn nhỉ? Mình luôn ở đây bên bạn. Đừng quên nghỉ ngơi! 💪";
    }
    if (dominantMood === "tired") {
      return "Bạn có vẻ mệt mỏi. Hãy dành thời gian chăm sóc bản thân nhé! 🫂";
    }
    return "Tuần này khá ổn định. Tiếp tục theo dõi cảm xúc để hiểu bản thân hơn! ✨";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/50"
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

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 block">📊</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Báo cáo tuần
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {format(subDays(new Date(), 7), "dd/MM", { locale: vi })} -{" "}
            {format(new Date(), "dd/MM", { locale: vi })}
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Tổng check-in
            </span>
            <span className="text-2xl font-bold text-indigo-600">
              {totalMoods}
            </span>
          </div>

          {dominantMood && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Cảm xúc chủ đạo:</span>
              <span className="text-lg">{MOOD_LABELS[dominantMood].emoji}</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {MOOD_LABELS[dominantMood].label}
              </span>
            </div>
          )}
        </div>

        {/* Mood Distribution */}
        {totalMoods > 0 && (
          <div className="bg-white dark:bg-slate-700 rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
              Phân bố cảm xúc
            </h3>
            <div className="space-y-2">
              {Object.entries(moodCounts)
                .filter(([, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([mood, count]) => {
                  const moodInfo = MOOD_LABELS[mood as MoodType];
                  const percentage = (count / totalMoods) * 100;
                  return (
                    <div key={mood} className="flex items-center gap-2">
                      <span className="w-6 text-center">{moodInfo.emoji}</span>
                      <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${moodInfo.color} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-sm mb-1">Insight từ Amity</h3>
              <p className="text-sm opacity-90">{getInsight()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
