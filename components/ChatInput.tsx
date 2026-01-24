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
    <div className="w-full px-0 py-2 md:p-6 pb-2">
      <div className="max-w-4xl mx-auto">
        {/* Attachment Preview - Duy trì padding nhẹ để không dính sát lề */}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1 px-3 md:px-0">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative group flex-shrink-0">
                <img
                  src={att.url}
                  alt="attachment"
                  className="h-14 w-14 md:h-16 md:w-16 object-cover rounded-xl border border-white/50 shadow-sm"
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
          className="flex items-end gap-2 md:gap-3 px-2 md:px-0"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          {/* Cụm input chính */}
          <div className="flex-1 flex items-end gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-[24px] border border-white/50 dark:border-slate-700 p-1 md:p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 md:p-2.5 rounded-full text-slate-400 hover:text-indigo-500 hover:bg-white transition-all duration-300 flex-shrink-0"
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
                className={`p-2 md:p-2.5 rounded-full transition-all duration-300 flex-shrink-0 ${
                  isListening
                    ? "bg-rose-500 text-white shadow-lg animate-pulse"
                    : "text-slate-400 hover:text-indigo-500 hover:bg-white"
                }`}
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
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
            )}

            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Đang lắng nghe..." : "Nhắn tin..."}
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 py-2.5 md:py-3 px-1 text-slate-700 dark:text-slate-200 text-base max-h-32 md:max-h-40 resize-none custom-scrollbar font-content"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={
                (!input.trim() && attachments.length === 0) || isLoading
              }
              className={`p-2 md:p-2.5 rounded-full transition-all duration-300 flex-shrink-0 ${
                (input.trim() || attachments.length > 0) && !isLoading
                  ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 scale-100 active:scale-90"
                  : "text-slate-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-6 md:w-6 transform rotate-90"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 12.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
              </svg>
            </button>
          </div>
        </form>
        <p className="text-center text-[9px] md:text-xs text-slate-400 mt-2 font-medium opacity-60 hidden md:block">
          Trang AI 2.0 • Được trang bị trí nhớ & cảm xúc
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
