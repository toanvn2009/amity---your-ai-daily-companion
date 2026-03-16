import React from "react";
import ChatMessage from "./ChatMessage";
import { ChatSession } from "../types";

interface ChatContainerProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  activeSession: ChatSession | null;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onSendMessage?: (msg: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  scrollRef,
  onScroll,
  activeSession,
  isLoading,
  messagesEndRef,
  onSendMessage,
}) => {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto px-0 py-4 md:p-8 custom-scrollbar"
    >
      <div className="w-full max-w-3xl mx-auto space-y-4 md:space-y-6 pb-4">
        {activeSession ? (
          activeSession.messages.map((msg, index) => {
            const isLastMessage = index === activeSession.messages.length - 1;
            const showSuggestions = isLastMessage && msg.suggestedReplies && msg.suggestedReplies.length > 0 && !isLoading;
            
            return (
              <div key={msg.id}>
                <ChatMessage message={msg} />
                {showSuggestions && (
                  <div className="flex flex-wrap gap-2 md:pl-14 px-4 mt-3 mb-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
                    {msg.suggestedReplies?.map((reply, i) => (
                      <button
                        key={i}
                        disabled={isLoading}
                        onClick={() => onSendMessage && onSendMessage(reply)}
                        className="text-sm bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-slate-700 px-4 py-2 rounded-2xl shadow-sm transition-all hover:-translate-y-0.5"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
            <p>Chưa có cuộc trò chuyện nào được chọn...</p>
          </div>
        )}
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
  );
};

export default ChatContainer;
