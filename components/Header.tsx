import React from "react";
import { ChatSession, UserProfile } from "../types";
import { TONE_DATA } from "../utils/constants";

interface HeaderProps {
  onOpenSidebar: () => void;
  activeSession: ChatSession | null;
  profile: UserProfile;
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  activeSession,
  profile,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="h-16 md:h-20 glass-header px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 text-slate-500 hover:bg-white/50 rounded-xl transition-colors relative z-50"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="flex flex-col">
          <h2 className="font-bold text-slate-800 text-sm md:text-lg truncate max-w-[200px] md:max-w-md tracking-tight">
            {activeSession?.title || "Trang Companion"}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {TONE_DATA[profile.preferredTone]?.label || "Người yêu"} Mode
            </span>
          </div>
        </div>
      </div>
      {/* Dark Mode Toggle */}
      <button
        onClick={onToggleTheme}
        className="p-2.5 rounded-xl bg-white/50 hover:bg-white/80 text-slate-600 transition-all duration-300 shadow-sm"
        title={isDark ? "Chế độ sáng" : "Chế độ tối"}
      >
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-amber-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
    </header>
  );
};

export default Header;
