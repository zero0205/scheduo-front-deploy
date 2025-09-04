import type { CalendarCategory, NotificationTime, RecurrenceRule } from "@/entities/schedule";

export interface ScheduleFormData {
  title: string;
  isAllDay: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  category: CalendarCategory;
  memo: string;
  hasNotification: boolean;
  notificationTime: NotificationTime;
  hasRecurrence: boolean;
  recurrenceRule: RecurrenceRule;
  recurrenceEndDate: string;
}
