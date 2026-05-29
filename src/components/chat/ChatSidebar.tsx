"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/language/useLanguage";
import { useTheme } from "@/context/theme/useTheme";
import {
  Conversation,
  getConversations,
  deleteConversation,
  renameConversation,
} from "@/services/chatHistory.service";
import { MessageSquare, Plus, Trash2, Pencil, Check, X, PanelLeftClose, PanelLeft } from "lucide-react";

interface ChatSidebarProps {
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  refreshTrigger: number;
}

export default function ChatSidebar({
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  refreshTrigger,
}: ChatSidebarProps) {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations, refreshTrigger]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (currentConversationId === id) {
        onNewConversation();
      }
    } catch {
      // silently fail
    }
  };

  const handleRenameStart = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(title);
  };

  const handleRenameConfirm = async (id: string) => {
    if (!editTitle.trim()) return;
    try {
      await renameConversation(id, editTitle.trim());
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: editTitle.trim() } : c))
      );
    } catch {
      // silently fail
    }
    setEditingId(null);
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("chatSidebar.today");
    if (diffDays === 1) return t("chatSidebar.yesterday");
    if (diffDays < 7) return `${diffDays} ${t("chatSidebar.daysAgo")}`;
    return date.toLocaleDateString();
  };

  // Group conversations by date
  const grouped = conversations.reduce<Record<string, Conversation[]>>((acc, conv) => {
    const label = formatDate(conv.updated_at || conv.created_at);
    if (!acc[label]) acc[label] = [];
    acc[label].push(conv);
    return acc;
  }, {});

  if (collapsed) {
    return (
      <div className={`flex flex-col items-center py-4 px-2 border-r ${isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
        <button
          onClick={() => setCollapsed(false)}
          className={`p-2 rounded-lg mb-4 transition-colors ${isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-200 text-gray-600"}`}
          title={t("chatSidebar.openPanel")}
        >
          <PanelLeft size={20} />
        </button>
        <button
          onClick={onNewConversation}
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          title={t("chatSidebar.newConversation")}
        >
          <Plus size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className={`w-72 flex flex-col border-r h-full ${isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <h2 className={`text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
          {t("chatSidebar.history")}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onNewConversation}
            className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            title={t("chatSidebar.newConversation")}
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setCollapsed(true)}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-200 text-gray-600"}`}
            title={t("chatSidebar.collapsePanel")}
          >
            <PanelLeftClose size={16} />
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className={`text-center py-8 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
            <p>{t("chatSidebar.noConversations")}</p>
          </div>
        ) : (
          Object.entries(grouped).map(([dateLabel, convs]) => (
            <div key={dateLabel}>
              <p className={`text-xs font-medium px-2 py-1.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                {dateLabel}
              </p>
              {convs.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                    currentConversationId === conv.id
                      ? "bg-blue-600 text-white"
                      : `${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-200"}`
                  }`}
                >
                  <MessageSquare size={14} className="flex-shrink-0" />
                  {editingId === conv.id ? (
                    <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameConfirm(conv.id);
                          if (e.key === "Escape") handleRenameCancel();
                        }}
                        className={`flex-1 text-xs px-1 py-0.5 rounded border ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                        autoFocus
                      />
                      <button onClick={() => handleRenameConfirm(conv.id)} className="p-0.5">
                        <Check size={12} />
                      </button>
                      <button onClick={handleRenameCancel} className="p-0.5">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 truncate">{conv.title || t("chatSidebar.untitled")}</span>
                      <div className={`hidden group-hover:flex items-center gap-0.5 ${currentConversationId === conv.id ? "!flex" : ""}`}>
                        <button
                          onClick={(e) => handleRenameStart(conv.id, conv.title, e)}
                          className={`p-1 rounded transition-colors ${
                            currentConversationId === conv.id
                              ? "hover:bg-blue-700"
                              : `${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-300"}`
                          }`}
                          title={t("chatSidebar.rename")}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(conv.id, e)}
                          className={`p-1 rounded transition-colors ${
                            currentConversationId === conv.id
                              ? "hover:bg-red-500"
                              : "hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                          }`}
                          title={t("chatSidebar.delete")}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}