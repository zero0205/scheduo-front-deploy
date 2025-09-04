import type { ScheduleCalendar } from "@/entities/calendar";

export interface Schedule {
  id: number;
  title: string;
  isAllDay: boolean;
  startDateTime: string;
  endDateTime: string;
  location: string;
  category: CalendarCategory;
  memo: string;
  notificationTime?: NotificationTime;
  recurrence: ScheduleRecurrence | null;
  calendar: ScheduleCalendar;
}

export interface ScheduleRecurrence {
  frequency: RecurrenceRule;
  recurrenceEndDate: string;
}

export type NotificationTime = "ONE_DAY_BEFORE" | "ONE_HOUR_BEFORE" | "THIRTY_MINUTES_BEFORE" | "FIVE_MINUTES_BEFORE";

export type RecurrenceRule = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export type CalendarCategory = "할 일" | "취미" | "학교" | "회사" | "기타";

export type CalendarCategoryColor = "CYAN" | "PURPLE" | "TEAL" | "PINK" | "GRAY";

export type ScheduleEditScope = "ALL" | "ONLY_THIS" | "THIS_AND_FUTURE";
