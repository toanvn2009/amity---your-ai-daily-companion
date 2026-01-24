import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "../types";
import { TONE_DATA } from "../utils/constants";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === "assistant";

  // Choose avatar based on tone (if available) or default to Amity's flower
  const avatar = isAssistant
    ? message.tone
      ? TONE_DATA[message.tone]?.icon
      : TONE_DATA["sweet"].icon
    : "U";

  return (
    <div
      className={`flex w-full mb-4 md:mb-8 px-2 md:px-0 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex w-full md:max-w-[80%] ${isAssistant ? "flex-row" : "flex-row-reverse"}`}
      >
        <div
          className={`hidden md:flex flex-shrink-0 h-8 w-8 md:h-9 md:w-9 rounded-full items-center justify-center text-white text-xs md:text-sm font-bold shadow-md transition-transform hover:scale-110 ${isAssistant ? "bg-indigo-500 mr-2 md:mr-4 text-sm md:text-lg" : "bg-emerald-500 ml-2 md:ml-4"}`}
        >
          {avatar}
        </div>
        <div
          className={`relative px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-sm text-sm md:text-[15px] leading-relaxed group
            ${
              isAssistant
                ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none ring-1 ring-slate-100 dark:ring-slate-700"
                : "bg-indigo-600 dark:bg-indigo-500 text-white rounded-tr-none shadow-indigo-100/50 dark:shadow-none"
            } w-[calc(100%-1rem)] md:w-auto ml-2 md:ml-0`}
        >
          <div
            className={`markdown-content font-content ${isAssistant ? "prose prose-slate dark:prose-invert prose-p:leading-relaxed prose-li:marker:text-slate-400 dark:prose-li:marker:text-slate-500" : "prose prose-invert prose-p:leading-relaxed prose-p:text-white/90 prose-strong:text-white prose-a:text-indigo-200"} max-w-none`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => (
                  <p className="mb-4 last:mb-0" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-4 mb-4 space-y-1" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-4 mb-4 space-y-1" {...props} />
                ),
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                a: ({ node, ...props }) => (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 font-medium"
                    {...props}
                  />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-current pl-4 italic my-4 opacity-80"
                    {...props}
                  />
                ),
                code: ({ node, ...props }) => {
                  const hasLang = /language-(\w+)/.exec(props.className || "");
                  return hasLang ? (
                    <code
                      className="block bg-black/10 rounded p-2 my-2 text-sm overflow-x-auto font-mono"
                      {...props}
                    />
                  ) : (
                    <code
                      className="bg-black/10 rounded px-1 py-0.5 text-[0.9em] font-mono font-bold"
                      {...props}
                    />
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
