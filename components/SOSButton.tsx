import React, { useState, useEffect } from "react";

interface SOSButtonProps {
  onQuickChat?: (message: string) => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onQuickChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [breathPhase, setBreathPhase] = useState<
    "inhale" | "hold" | "exhale" | "idle"
  >("idle");
  const [countdown, setCountdown] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  // 4-7-8 Breathing technique
  useEffect(() => {
    if (!isBreathing) return;

    const phases = [
      { phase: "inhale" as const, duration: 4 },
      { phase: "hold" as const, duration: 7 },
      { phase: "exhale" as const, duration: 8 },
    ];

    let currentPhaseIndex = 0;
    let currentCount = phases[0].duration;

    setBreathPhase(phases[0].phase);
    setCountdown(currentCount);

    const interval = setInterval(() => {
      currentCount--;
      setCountdown(currentCount);

      if (currentCount <= 0) {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        currentCount = phases[currentPhaseIndex].duration;
        setBreathPhase(phases[currentPhaseIndex].phase);
        setCountdown(currentCount);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing]);

  const handleQuickChat = () => {
    if (onQuickChat) {
      onQuickChat("Em cần được dỗ dành ngay bây giờ... Em đang rất stress 😢");
    }
    setIsOpen(false);
  };

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathPhase("inhale");
    setCountdown(4);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathPhase("idle");
    setCountdown(0);
  };

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[80] w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full shadow-lg shadow-rose-200 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        title="SOS Stress - Cần giúp đỡ ngay"
      >
        <span className="text-2xl">🆘</span>
      </button>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => {
              setIsOpen(false);
              stopBreathing();
            }}
          />
          <div className="relative bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
            {/* Close button */}
            <button
              onClick={() => {
                setIsOpen(false);
                stopBreathing();
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
              <span className="text-5xl mb-3 block">🫂</span>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Mình ở đây với bạn
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Hít thở sâu, mọi thứ sẽ ổn thôi
              </p>
            </div>

            {/* Breathing Exercise */}
            <div className="relative flex flex-col items-center mb-6">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${
                  breathPhase === "inhale"
                    ? "scale-125 bg-gradient-to-br from-sky-400 to-indigo-500"
                    : breathPhase === "hold"
                      ? "scale-125 bg-gradient-to-br from-violet-400 to-purple-500"
                      : breathPhase === "exhale"
                        ? "scale-75 bg-gradient-to-br from-rose-400 to-pink-500"
                        : "scale-100 bg-gradient-to-br from-slate-300 to-slate-400"
                }`}
              >
                <div className="text-center text-white">
                  {isBreathing ? (
                    <>
                      <div className="text-3xl font-bold">{countdown}</div>
                      <div className="text-xs uppercase tracking-wider">
                        {breathPhase === "inhale" && "Hít vào"}
                        {breathPhase === "hold" && "Giữ"}
                        {breathPhase === "exhale" && "Thở ra"}
                      </div>
                    </>
                  ) : (
                    <span className="text-4xl">🧘</span>
                  )}
                </div>
              </div>

              <button
                onClick={isBreathing ? stopBreathing : startBreathing}
                className={`mt-4 px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                  isBreathing
                    ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 shadow-md"
                }`}
              >
                {isBreathing ? "Dừng lại" : "Bắt đầu hít thở 4-7-8"}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleQuickChat}
                className="flex flex-col items-center p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                <span className="text-2xl mb-1">💬</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Chat ngay
                </span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  stopBreathing();
                }}
                className="flex flex-col items-center p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                <span className="text-2xl mb-1">✅</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Đã ổn hơn
                </span>
              </button>
            </div>

            {/* Affirmation */}
            <p className="text-center text-sm text-slate-400 mt-6 italic">
              "Bạn đang làm rất tốt. Hãy từ từ thôi nào 💕"
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
