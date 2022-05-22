export interface Message {
  content: string;
  direction: "out" | "in" | "log";
  severity: 'info' | 'error' | 'message';
}
