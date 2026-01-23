import React, { useState, useRef, useEffect } from "react";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { Attachment } from "../types";

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: Attachment[]) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useVoiceInput();

  // Sync transcript to input
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((input.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(input.trim(), attachments);
      setInput("");
      setAttachments([]);
      resetTranscript(); // Reset voice transcript after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachments([
            ...attachments,
            { type: "image", url: event.target.result as string },
          ]);
        }
      };

      reader.readAsDataURL(file);
    }
    // Reset input value so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="p-1.5 md:p-6 pb-2 w-full">
      <div className="max-w-4xl mx-auto">
        {/* Attachment Preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={att.url}
                  alt="attachment"
                  className="h-12 w-12 md:h-16 md:w-16 object-cover rounded-xl border border-white/50 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow-md hover:bg-rose-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
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
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="relative group flex gap-1.5 md:gap-2 items-end px-1"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="hidden md:flex p-2 md:p-3 rounded-xl md:rounded-2xl bg-white/80 text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-white/50 transition-all duration-300 flex-shrink-0"
            title="Gửi ảnh"
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {isSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-1.5 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 flex-shrink-0 ${
                isListening
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-200 animate-pulse scale-105"
                  : "bg-white/80 text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-white/50"
              }`}
              title="Nhấn để nói"
            >
              {isListening ? (
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
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              ) : (
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
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </button>
          )}

          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Đang lắng nghe..." : "Nhắn tin..."}
              className={`w-full resize-none rounded-xl md:rounded-2xl glass-input py-2 md:py-4 pl-3.5 md:pl-5 pr-10 md:pr-14 
                focus:outline-none focus:ring-4 focus:ring-indigo-100/50 
                text-slate-700 max-h-32 md:max-h-40 custom-scrollbar text-base placeholder:text-slate-400
                ${isListening ? "ring-2 ring-rose-200 placeholder:text-rose-400" : ""}
              `}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={
                (!input.trim() && attachments.length === 0) || isLoading
              }
              className={`absolute right-1 bottom-1 md:right-2 md:bottom-2 p-1 md:p-2 rounded-lg md:rounded-xl transition-all duration-300 ${
                (input.trim() || attachments.length > 0) && !isLoading
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-100 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                  : "bg-slate-100/50 text-slate-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
        <p className="text-center text-[9px] md:text-xs text-slate-400 mt-2 font-medium opacity-60 hidden md:block">
          Amity AI 2.0 • Được trang bị trí nhớ & cảm xúc
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
