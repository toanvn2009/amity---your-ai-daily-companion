import React, { useState, useEffect, useRef, useMemo } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import QuickActions from "./components/QuickActions";
import {
  Message,
  UserProfile,
  ToneType,
  MoodType,
  ChatSession,
  Attachment,
} from "./types";
import { getGeminiResponse } from "./services/gemini";
import MemoryManager from "./components/MemoryManager";
import MoodChart from "./components/MoodChart";
import { TONE_DATA } from "./utils/constants";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import SOSButton from "./components/SOSButton";
import DailyCheckin, { useDailyCheckin } from "./components/DailyCheckin";
import AmbientPlayer from "./components/AmbientPlayer";
import WeeklyReport from "./components/WeeklyReport";

const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  anxious: "😰",
  tired: "😫",
  excited: "🤩",
};

const AppContent: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("amity_sessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return localStorage.getItem("amity_active_session_id");
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("amity_user_profile");
    return saved
      ? JSON.parse(saved)
      : {
          goals: [],
          habits: [
            { id: "1", name: "Đọc sách 30p", streak: 5 },
            { id: "2", name: "Tập thể dục", streak: 12 },
          ],
          moodHistory: [],
          preferredTone: "sweet",
          memories: [],
        };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const {
    shouldShow: showDailyCheckin,
    markCheckinDone,
    close: closeDailyCheckin,
  } = useDailyCheckin();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || null,
    [sessions, activeSessionId],
  );

  const handleUpdateMemories = (newMemories: string[]) => {
    setProfile((prev) => ({ ...prev, memories: newMemories }));
  };

  useEffect(() => {
    if (sessions.length === 0) {
      const firstSession: ChatSession = {
        id: "session-" + Date.now(),
        title: "Cuộc trò chuyện mới",
        messages: [
          {
            id: "welcome-" + Date.now(),
            role: "assistant",
            content:
              "Người thương ơi, mình lại gặp nhau rồi! Kể em nghe hôm nay của anh thế nào đi nào? 🥰",
            timestamp: Date.now(),
          },
        ],
        lastModified: Date.now(),
      };
      setSessions([firstSession]);
      setActiveSessionId(firstSession.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("amity_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (activeSessionId)
      localStorage.setItem("amity_active_session_id", activeSessionId);
  }, [activeSessionId]);

  useEffect(() => {
    localStorage.setItem("amity_user_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isLoading]);

  const handleSendMessage = async (
    content: string,
    attachments?: Attachment[],
  ) => {
    if (
      (!content.trim() && (!attachments || attachments.length === 0)) ||
      isLoading ||
      !activeSessionId
    )
      return;

    const userMsg: Message = {
      id: Date.now() + "-u",
      role: "user",
      content,
      attachments,
      timestamp: Date.now(),
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const isFirstUserMsg = !s.messages.some((m) => m.role === "user");
          let newTitle = s.title;
          if (isFirstUserMsg) {
            if (content) {
              newTitle =
                content.length > 25
                  ? content.substring(0, 25) + "..."
                  : content;
            } else if (attachments && attachments.length > 0) {
              newTitle = "Đã gửi " + attachments.length + " ảnh";
            }
          }

          return {
            ...s,
            title: newTitle,
            messages: [...s.messages, userMsg],
            lastModified: Date.now(),
          };
        }
        return s;
      }),
    );

    setIsLoading(true);
    try {
      const currentMessages = activeSession
        ? [...activeSession.messages, userMsg]
        : [userMsg];
      const { text, extractedMemory } = await getGeminiResponse(
        currentMessages,
        profile,
      );

      if (extractedMemory && !profile.memories.includes(extractedMemory)) {
        setProfile((prev) => ({
          ...prev,
          memories: [extractedMemory, ...prev.memories].slice(0, 200), // Giới hạn 200 trí nhớ
        }));
      }

      const assistantMsg: Message = {
        id: Date.now() + "-a",
        role: "assistant",
        content: text,
        timestamp: Date.now(),
        tone: profile.preferredTone,
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, assistantMsg],
              lastModified: Date.now(),
            };
          }
          return s;
        }),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: "session-" + Date.now(),
      title: "Cuộc trò chuyện mới",
      messages: [
        {
          id: "welcome-" + Date.now(),
          role: "assistant",
          content:
            "Người thương ơi, mình lại gặp nhau rồi! Kể em nghe hôm nay của anh thế nào đi nào? 🥰",
          timestamp: Date.now(),
        },
      ],
      lastModified: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter((s) => s.id !== id);
    setSessions(newSessions);
    if (activeSessionId === id) {
      setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  const removeMemory = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      memories: prev.memories.filter((_, i) => i !== index),
    }));
  };

  const handleExportData = () => {
    try {
      const data = {
        sessions: JSON.parse(localStorage.getItem("amity_sessions") || "[]"),
        profile: JSON.parse(localStorage.getItem("amity_user_profile") || "{}"),
        activeSessionId: localStorage.getItem("amity_active_session_id"),
        version: "2.0",
        exportDate: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `amity_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Lỗi khi xuất dữ liệu: " + error);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.sessions && data.profile) {
          if (
            confirm(
              "Hành động này sẽ ghi đè toàn bộ dữ liệu hiện tại. Bạn có chắc chắn muốn tiếp tục?",
            )
          ) {
            localStorage.setItem(
              "amity_sessions",
              JSON.stringify(data.sessions),
            );
            localStorage.setItem(
              "amity_user_profile",
              JSON.stringify(data.profile),
            );
            if (data.activeSessionId) {
              localStorage.setItem(
                "amity_active_session_id",
                data.activeSessionId,
              );
            }
            window.location.reload();
          }
        } else {
          alert("File JSON không hợp lệ hoặc thiếu dữ liệu Amity.");
        }
      } catch (err) {
        alert("Lỗi khi đọc file: " + err);
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = "";
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 300);
  };

  const scrollToTop = () => {
    chatScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex h-screen animated-bg overflow-hidden relative font-sans text-slate-800">
      <MemoryManager
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        memories={profile.memories}
        onUpdateMemories={handleUpdateMemories}
      />

      {/* SOS Stress Button & Ambient Player - Desktop Only (Mobile moved to menu) */}
      <div className="hidden md:block">
        <SOSButton onQuickChat={handleSendMessage} />
        <AmbientPlayer />
      </div>

      {/* Daily Check-in */}
      {showDailyCheckin && (
        <DailyCheckin
          onMoodSelect={(mood) => {
            setProfile((prev) => ({
              ...prev,
              moodHistory: [
                ...prev.moodHistory,
                { id: Date.now().toString(), mood, timestamp: Date.now() },
              ],
            }));
            markCheckinDone();
          }}
          onClose={closeDailyCheckin}
        />
      )}

      {/* Weekly Report */}
      {isReportOpen && (
        <WeeklyReport
          moodHistory={profile.moodHistory}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      {isMoodOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMoodOpen(false)}
          />
          <div className="bg-white/90 glass-panel w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsMoodOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <MoodChart data={profile.moodHistory} />
          </div>
        </div>
      )}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-[70] w-72 glass-panel transition-transform duration-500 ease-out transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full bg-white/30">
          <div className="p-6 border-b border-white/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg cursor-pointer"
                onClick={() => setIsMoodOpen(true)}
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
                    onClick={() => setIsMoodOpen(true)}
                    className="text-[10px] text-indigo-500 font-bold hover:underline text-left"
                  >
                    Biểu đồ 📊
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="text-[10px] text-violet-500 font-bold hover:underline text-left"
                  >
                    Báo cáo tuần 📅
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
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
              onClick={startNewChat}
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
                    onClick={() => {
                      setActiveSessionId(session.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`group flex items-center justify-between p-2.5 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-300 ${activeSessionId === session.id ? "bg-white shadow-sm text-indigo-600 border border-indigo-50" : "text-slate-600 hover:bg-white/50 hover:text-indigo-500"}`}
                  >
                    <span className="truncate flex-1 pr-2 opacity-90">
                      {session.title}
                    </span>
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
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
                  onClick={() => setIsMemoryOpen(true)}
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
                        onClick={() => removeMemory(idx)}
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

            {/* Persona Section Removed - Only Sweet is allowed */}
            <section className="md:hidden">
              <h2 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                Tiện ích
                <div className="h-px bg-indigo-100 flex-1"></div>
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    handleSendMessage(
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
                  onClick={handleExportData}
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
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
              </div>
            </section>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10 h-full">
        <header className="h-16 md:h-20 glass-header px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
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
            onClick={toggleTheme}
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
                  clipRule="evenodd"
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

        <div
          ref={chatScrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-0 py-4 md:p-8 custom-scrollbar"
        >
          <div className="w-full max-w-3xl mx-auto space-y-4 md:space-y-6 pb-4">
            {activeSession?.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 px-4 md:px-0 animate-in fade-in duration-500">
                <div className="h-9 w-9 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                  A
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-white/50 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="glass-header border-t-0 border-t border-white/40 p-0 md:p-4 md:pb-6 safe-area-bottom">
          <div className="hidden md:block">
            <QuickActions onAction={handleSendMessage} />
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>

        {/* Back to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 md:bottom-28 md:right-10 p-2 md:p-3 bg-white/80 backdrop-blur-md border border-indigo-100 rounded-full shadow-lg text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-4 z-[50]"
            title="Cuộn lên đầu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
