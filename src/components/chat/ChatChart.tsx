"use client";

import { FormattedResponseChart } from "@/lib/types";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#d97706", "#7c3aed", "#0891b2"];

// Custom tooltip to display both X and Y values
const CustomTooltip = ({ active, payload, xAxisField, yAxisField }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
          {xAxisField}: {data[xAxisField]}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          {yAxisField}: {data[yAxisField]}
        </p>
      </div>
    );
  }
  return null;
};

export default function ChatChart({ data }: { data: FormattedResponseChart }) {
  const { chartType, xAxis, yAxis, data: rows } = data;

  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={rows} dataKey={yAxis.field} nameKey={xAxis.field} cx="50%" cy="50%" outerRadius={100} label>
            {rows.map((_: Record<string, unknown>, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={rows} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xAxis.field} 
            tick={{ fontSize: 11 }} 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip xAxisField={xAxis.field} yAxisField={yAxis.field} />} />
          <Legend />
          <Line type="monotone" dataKey={yAxis.field} stroke={COLORS[0]} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxis.field} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip xAxisField={xAxis.field} yAxisField={yAxis.field} />} />
        <Legend />
        <Bar dataKey={yAxis.field} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
