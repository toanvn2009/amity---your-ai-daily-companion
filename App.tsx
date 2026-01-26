import React, { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import QuickActions from "./components/QuickActions";
import { Message, UserProfile, ChatSession, Attachment } from "./types";
import { getGeminiResponse } from "./services/gemini";
import MemoryManager from "./components/MemoryManager";
import MoodChart from "./components/MoodChart";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import SOSButton from "./components/SOSButton";
import DailyCheckin, { useDailyCheckin } from "./components/DailyCheckin";
import AmbientPlayer from "./components/AmbientPlayer";
import WeeklyReport from "./components/WeeklyReport";

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
  const [memoryNotification, setMemoryNotification] = useState<string | null>(
    null,
  );

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
      const { text, extractedMemory, emotionalUpdate } =
        await getGeminiResponse(currentMessages, profile);

      if (extractedMemory) {
        setProfile((prev) => {
          const episodic = prev.episodicMemories || [];
          const semantic = prev.semanticMemories || [];

          if (extractedMemory.type === "semantic") {
            return {
              ...prev,
              semanticMemories: [extractedMemory, ...semantic].slice(0, 100),
              emotionalContext: emotionalUpdate || prev.emotionalContext,
            };
          } else {
            return {
              ...prev,
              episodicMemories: [extractedMemory, ...episodic].slice(0, 100),
              emotionalContext: emotionalUpdate || prev.emotionalContext,
            };
          }
        });
        setMemoryNotification(extractedMemory.content);
        setTimeout(() => setMemoryNotification(null), 4000);
      } else if (emotionalUpdate) {
        setProfile((prev) => ({ ...prev, emotionalContext: emotionalUpdate }));
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

      <div className="hidden md:block">
        <SOSButton onQuickChat={handleSendMessage} />
        <AmbientPlayer />
      </div>

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

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onDeleteSession={deleteSession}
        onNewChat={startNewChat}
        profile={profile}
        onRemoveMemory={removeMemory}
        onOpenMemoryManager={() => setIsMemoryOpen(true)}
        onOpenMoodChart={() => setIsMoodOpen(true)}
        onOpenWeeklyReport={() => setIsReportOpen(true)}
        onSendMessage={handleSendMessage}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      <main className="flex-1 flex flex-col relative z-10 h-full">
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          activeSession={activeSession}
          profile={profile}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        <ChatContainer
          scrollRef={chatScrollRef}
          onScroll={handleScroll}
          activeSession={activeSession}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />

        <div className="glass-header border-t-0 border-t border-white/40 p-0 md:p-4 md:pb-6 safe-area-bottom">
          <div className="hidden md:block">
            <QuickActions onAction={handleSendMessage} />
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>

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

        {memoryNotification && (
          <div className="fixed top-20 right-4 left-4 md:left-auto md:right-8 z-[60] bg-white/90 backdrop-blur-md border border-indigo-100 shadow-xl rounded-2xl p-4 animate-in slide-in-from-top-4 fade-in duration-300 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 shrink-0">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Trí nhớ mới ✨
                </h4>
                <p className="text-[13px] text-slate-600 leading-relaxed italic">
                  "{memoryNotification}"
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
