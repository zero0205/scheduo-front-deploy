export const scheduleKeys = {
  all: ["schedules"] as const,
  byDate: (calendarId: number, date: string) => [...scheduleKeys.all, "byDate", calendarId, date] as const,
  byMonth: (calendarId: number, date: string) => [...scheduleKeys.all, "byMonth", calendarId, date] as const,
  detail: (calendarId: number, scheduleId: number, date: string) =>
    [...scheduleKeys.all, "detail", calendarId, scheduleId, date] as const,
} as const;
