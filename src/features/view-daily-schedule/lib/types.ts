import type { ScheduleCalendar } from "@/entities/calendar";
import type { Schedule } from "@/entities/schedule";

export type ScheduleItem = Partial<Schedule> & {
  calendar: ScheduleCalendar;
};
