"use client";

import { FormattedResponseTable } from "@/lib/types";
import { useState } from "react";

export default function ChatTable({ data }: { data: FormattedResponseTable }) {
  const { columns, data: rows, options } = data;
  const pageSize = options.pageSize ?? 10;
  const [page, setPage] = useState(0);
  const paginated = options.pagination ? rows.slice(page * pageSize, (page + 1) * pageSize) : rows;
  const totalPages = Math.ceil(rows.length / pageSize);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {columns.map((col) => (
              <th key={col.field} className="px-3 py-2 text-left font-medium border-b border-gray-200 dark:border-gray-600">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              {columns.map((col) => (
                <td key={col.field} className="px-3 py-2 text-gray-700 dark:text-gray-300">
                  {String(row[col.field] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {options.pagination && totalPages > 1 && (
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="px-2 py-1 rounded border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700">←</button>
          <span>Page {page + 1} / {totalPages} ({rows.length} lignes)</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
            className="px-2 py-1 rounded border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700">→</button>
        </div>
      )}
    </div>
  );
}
