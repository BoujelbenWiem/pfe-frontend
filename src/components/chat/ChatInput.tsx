"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/context/language/useLanguage";

interface Props {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: Props) {
  const { t } = useLanguage();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || loading) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-2xl px-3 py-2 bg-white dark:bg-gray-800 shadow-sm">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("chat.inputPlaceholder")}
        rows={1}
        disabled={loading}
        className="flex-1 resize-none text-sm outline-none max-h-24 overflow-y-auto bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || loading}
        className="bg-primary text-white rounded-xl px-3 py-1.5 text-sm font-medium hover:bg-primary-hover disabled:opacity-40 transition flex-shrink-0"
      >
        {loading ? "…" : t("chat.send")}
      </button>
    </div>
  );
}
