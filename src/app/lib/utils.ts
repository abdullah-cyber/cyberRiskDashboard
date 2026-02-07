export function safeParseTime(input?: string): string {
  if (!input) return "Unknown";
  const parsed = new Date(input);
  return isNaN(parsed.getTime())
    ? "Unknown"
    : parsed.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}
