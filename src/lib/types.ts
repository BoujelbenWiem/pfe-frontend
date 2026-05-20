// Chat response types matching the backend ChatResponse model

export interface FormattedResponseText {
  type: "text";
  content: string;
}

export interface TableColumn {
  field: string;
  label: string;
}

export interface TableOptions {
  pagination?: boolean;
  pageSize?: number;
}

export interface FormattedResponseTable {
  type: "table";
  intro?: string;
  columns: TableColumn[];
  data: Record<string, unknown>[];
  options: TableOptions;
}

export interface ChartAxis {
  field: string;
  label?: string;
}

export interface FormattedResponseChart {
  type: "chart";
  intro?: string;
  chartType: "bar" | "line" | "pie";
  xAxis: ChartAxis;
  yAxis: ChartAxis;
  data: Record<string, unknown>[];
}

export type FormattedResponse =
  | FormattedResponseText
  | FormattedResponseTable
  | FormattedResponseChart;

export interface ChatResponse {
  intention?: string | null;
  output_type?: string | null;
  sql_query?: string | null;
  formatted_response?: FormattedResponse | null;
  access_denied?: boolean | null;
  execution_error?: string | null;
  error?: string | null;
  timestamp: string;
  conversation_id?: string;
}
