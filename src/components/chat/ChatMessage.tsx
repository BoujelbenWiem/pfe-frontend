"use client";

import { FormattedResponseTable, FormattedResponseChart, FormattedResponseText, ChatResponse } from "@/lib/types";
import ChatTable from "./ChatTable";
import ChatChart from "./ChatChart";
import { Download } from "lucide-react";

interface Props {
  role: "user" | "assistant";
  content?: string;
  response?: ChatResponse;
}

// Clean function to remove markdown table from intro text
function cleanIntroText(intro: string): string {
  return intro
    .replace(/\|\s*[-\s|]+\s*\|/g, "")
    .replace(/\|\s*\w+\s*\|/g, "")
    .trim();
}

// Export table data to CSV
function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        const stringValue = String(value || "");
        return stringValue.includes(",") ? `"${stringValue}"` : stringValue;
      }).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ChatMessage({ role, content, response }: Props) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xl text-sm">
          {content}
        </div>
      </div>
    );
  }

  const fr = response?.formatted_response;

  // Error state
  if (response?.error || response?.execution_error) {
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xl text-sm">
          {response.error ?? response.execution_error}
        </div>
      </div>
    );
  }

  if (!fr) return null;

  return (
    <div className="flex justify-start mb-4 w-full">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-4xl w-full shadow-sm text-sm">
        {fr.type === "text" && (
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{(fr as FormattedResponseText).content}</p>
        )}
        {fr.type === "table" && (
          <div className="relative">
            <button
              onClick={() => exportToCSV((fr as FormattedResponseTable).data, "export")}
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-20"
              style={{ zIndex: 20 }}
              title="Exporter en CSV"
            >
              <Download size={18} />
            </button>
            {(fr as FormattedResponseTable).intro && (
              <p className="text-gray-900 dark:text-gray-100  mb-2 text-s pr-8">{cleanIntroText((fr as FormattedResponseTable).intro || "")}</p>
            )}
            <ChatTable data={fr as FormattedResponseTable} />
          </div>
        )}
        {fr.type === "chart" && (
          <>
            {(fr as FormattedResponseChart).intro && (
              <p className="text-gray-500 dark:text-gray-400 italic mb-2 text-xs">{(fr as FormattedResponseChart).intro}</p>
            )}
            <ChatChart data={fr as FormattedResponseChart} />
          </>
        )}
        {response?.sql_query && (
          <details className="mt-3">
            <summary className="text-xs text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">SQL généré</summary>
            <pre className="mt-1 text-xs bg-gray-50 dark:bg-gray-900 rounded p-2 overflow-x-auto text-gray-600 dark:text-gray-400">{response.sql_query}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
