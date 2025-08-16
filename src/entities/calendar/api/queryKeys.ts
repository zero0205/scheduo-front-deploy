export const calendarKeys = {
  all: ["calendars"] as const,
  list: () => [...calendarKeys.all, "list"] as const,
  detail: (id: number) => [...calendarKeys.all, "detail", id] as const,
} as const;
