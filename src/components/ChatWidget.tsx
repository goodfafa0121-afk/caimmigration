"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { chatConfig } from "@/lib/chat-config";

type Message = { role: "agent" | "user"; text: string; time?: string };

function formatTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function ChatWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<boolean>(chatConfig.autoOpen);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    { role: "agent", text: t.chat.welcome },
    { role: "agent", text: t.chat.agentIntro, time: formatTime() },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setMessages((prev) => [
      ...prev,
      { role: "agent", text: t.chat.agentReply, time: formatTime() },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const displayOpen = open && !minimized;
  const titleLabel = `${chatConfig.agentTitle}${chatConfig.agentName}`;

  return (
    <>
      {/* 浮动按钮（面板展开或最小化条显示时隐藏） */}
      {!open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          aria-label={t.nav.consult}
        >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        </button>
      )}

      {/* 聊天面板 */}
      {displayOpen && (
        <div
          className="fixed bottom-20 right-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl bg-white shadow-xl"
          style={{ height: "520px" }}
        >
          {/* 顶部栏 */}
          <div className="flex items-center justify-between bg-gray-800 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-600">
                {chatConfig.agentAvatar ? (
                  <img src={chatConfig.agentAvatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-300">
                    {chatConfig.agentName.slice(0, 1)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{titleLabel}</p>
                <div className="mt-1 flex gap-2">
                  <a
                    href={`tel:${chatConfig.phone}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600"
                    aria-label={t.chat.call}
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </a>
                  <span className="flex h-7 items-center rounded-full bg-gray-700 px-2 text-xs" title={t.chat.wechat}>
                    {t.chat.wechat} {chatConfig.wechat}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMinimized(true)}
                className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white"
                aria-label="Minimize"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 消息区域 */}
          <div ref={listRef} className="flex-1 overflow-y-auto bg-gray-50 p-4 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-3 ${m.role === "user" ? "ml-8 text-right" : "mr-8"}`}
              >
                {m.role === "agent" && (
                  <p className="mb-0.5 text-xs text-gray-500">
                    {titleLabel} {m.time}
                  </p>
                )}
                <div
                  className={`inline-block max-w-[85%] rounded-lg px-3 py-2 ${
                    m.role === "user"
                      ? "bg-brand text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* 输入区 */}
          <div className="flex items-center gap-2 border-t border-gray-200 bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chat.inputPlaceholder}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <button
              type="button"
              onClick={handleSend}
              className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              {t.chat.send}
            </button>
          </div>
        </div>
      )}

      {/* 最小化时的小条：点击可再次展开 */}
      {open && minimized && (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white shadow-lg hover:bg-gray-700"
        >
          <span>{titleLabel}</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
}
