import React from "react";
import { ChatSession, UserProfile } from "../types";
import { TONE_DATA } from "../utils/constants";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onNewChat: () => void;
  profile: UserProfile;
  onRemoveMemory: (index: number) => void;
  onOpenMemoryManager: () => void;
  onOpenMoodChart: () => void;
  onOpenWeeklyReport: () => void;
  onSendMessage: (content: string) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
  profile,
  onRemoveMemory,
  onOpenMemoryManager,
  onOpenMoodChart,
  onOpenWeeklyReport,
  onSendMessage,
  onExportData,
  onImportData,
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-[70] w-72 glass-panel transition-transform duration-500 ease-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full bg-white/30">
          <div className="p-6 border-b border-white/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg cursor-pointer"
                onClick={onOpenMoodChart}
                title="Xem biểu đồ cảm xúc"
              >
                <span className="text-xl">A</span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-lg text-slate-800 tracking-tight leading-4">
                  Trang
                </h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenMoodChart}
                    className="text-[10px] text-indigo-500 font-bold hover:underline text-left"
                  >
                    Biểu đồ 📊
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={onOpenWeeklyReport}
                    className="text-[10px] text-violet-500 font-bold hover:underline text-left"
                  >
                    Báo cáo tuần 📅
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-2 text-slate-400 hover:text-slate-600"
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
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95 duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Cuộc trò chuyện mới
            </button>

            <section>
              <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                Lịch sử
                <div className="h-px bg-indigo-100 flex-1"></div>
              </h2>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => onSelectSession(session.id)}
                    className={`group flex items-center justify-between p-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-300 ${
                      activeSessionId === session.id
                        ? "bg-white shadow-sm text-indigo-600 border border-indigo-50"
                        : "text-slate-600 hover:bg-white/50 hover:text-indigo-500"
                    }`}
                  >
                    <span className="truncate flex-1 pr-2 opacity-90">
                      {session.title}
                    </span>
                    <button
                      onClick={(e) => onDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-400 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                Trí nhớ
                <div className="h-px bg-indigo-100 flex-1"></div>
                <button
                  onClick={onOpenMemoryManager}
                  className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md hover:bg-indigo-200 transition-colors"
                >
                  Quản lý
                </button>
              </h2>
              <div className="bg-white/40 rounded-2xl p-3 space-y-2.5 border border-white/60 min-h-[60px] max-h-[250px] overflow-y-auto custom-scrollbar shadow-sm backdrop-blur-sm">
                {profile.memories && profile.memories.length > 0 ? (
                  profile.memories.map((mem, idx) => (
                    <div
                      key={idx}
                      className="group relative flex items-start gap-2.5 p-1"
                    >
                      <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0 shadow-sm" />
                      <p className="text-[11px] text-slate-600 leading-snug flex-1 opacity-90">
                        {mem}
                      </p>
                      <button
                        onClick={() => onRemoveMemory(idx)}
                        className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-white border border-slate-100 rounded-full p-0.5 text-slate-300 hover:text-rose-500 shadow-sm transition-opacity"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
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
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic text-center py-2">
                    Chưa có ký ức nào...
                  </p>
                )}
              </div>
            </section>

            <section className="md:hidden">
              <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                Tiện ích
                <div className="h-px bg-indigo-100 flex-1"></div>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    onSendMessage(
                      "Em cần được dỗ dành ngay bây giờ... Em đang rất stress 😢",
                    )
                  }
                  className="flex flex-col items-center p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm active:scale-95 transition-all"
                >
                  <span className="text-2xl mb-1">🆘</span>
                  <span className="text-[11px] font-bold">SOS Stress</span>
                </button>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-200">
                    <div className="h-full bg-indigo-500 w-1/3 animate-pulse"></div>
                  </div>
                  <span className="text-2xl mb-1">🎵</span>
                  <span className="text-[11px] font-bold">Nhạc nền</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2 italic">
                *Sử dụng bản desktop để có trải nghiệm điều khiển nhạc đầy đủ
                hơn
              </p>
            </section>

            <section className="mt-auto border-t border-indigo-100/50 pt-4 pb-2">
              <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                Dữ liệu
                <div className="h-px bg-indigo-100 flex-1"></div>
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={onExportData}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/60 hover:bg-white text-slate-600 border border-indigo-50 rounded-lg text-[11px] font-bold transition-all active:scale-95"
                  title="Xuất dữ liệu sang file JSON"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Export
                </button>
                <label className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/60 hover:bg-white text-indigo-600 border border-indigo-50 rounded-lg text-[11px] font-bold transition-all active:scale-95 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM8.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={onImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </section>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
