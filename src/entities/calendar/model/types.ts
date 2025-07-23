export interface ScheduleCalendar {
  calendarId: number;
  title: string;
  participants: CalendarParticipant[];
}

export interface CalendarInfo {
  calendarId: number;
  title: string;
}

export interface CalendarParticipant {
  participantId: number;
  nickname: string;
  role: CalendarRole;
  email: string;
  me: boolean;
}

export type CalendarRole = "OWNER" | "VIEW" | "EDIT";
