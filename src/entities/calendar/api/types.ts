import type { CalendarInfo, CalendarParticipant, CalendarRole } from "../model";

interface CreateCalendarParticipant {
  memberId: number;
  role: CalendarRole;
}

export interface CreateCalendarRequest {
  title: string;
  participants: CreateCalendarParticipant[];
}

export interface CreateCalendarResponse {
  calendarId: number;
  title: string;
}

export interface UpdateCalendarRequest {
  title: string;
  nickname: string;
}

export interface InviteToCalendarRequest {
  memberId: number;
}

export interface GetCalendarListResponse {
  calendars: CalendarInfo[];
}

export interface GetCalendarByIdResponse {
  calendarId: number;
  title: string;
  memberRole: CalendarRole;
  memberNickname: string;
  participants: CalendarParticipant[];
}
