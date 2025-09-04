import type {
  CalendarCategory,
  CalendarCategoryColor,
  NotificationTime,
  Schedule,
  ScheduleEditScope,
  ScheduleRecurrence,
} from "../model";

export type InputScheduleRequest = Omit<Schedule, "id" | "calendar">;

// 특정 날짜 일정 조회 응답
export interface DailyScheduleResponse {
  schedules: ScheduleItem[];
}

// 월별 일정 조회 응답
export interface MonthlyScheduleResponse {
  calendarId: number;
  schedules: ScheduleItem[];
}

export interface ScheduleItem {
  id: number;
  title: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  category: {
    name: CalendarCategory;
    color: CalendarCategoryColor;
  };
  allDay: boolean;
}

// 일정 생성 요청 (실제 API 스펙에 맞게 수정)
export interface CreateScheduleRequest {
  title: string;
  startDateTime?: string;
  endDateTime?: string;
  allDay: boolean;
  location?: string;
  memo?: string;
  category: CalendarCategory;
  notificationTime?: NotificationTime;
  recurrence?: ScheduleRecurrence;
}

// 일정 수정 요청
export interface UpdateScheduleRequest extends CreateScheduleRequest {
  scope?: ScheduleEditScope;
}

// 일정 상세 조회 응답
export interface ScheduleDetailResponse {
  id: number;
  title: string;
  startDateTime?: string;
  endDateTime?: string;
  allDay: boolean;
  location?: string;
  memo?: string;
  category: CalendarCategory;
  notificationTime?: NotificationTime;
  recurrence?: ScheduleRecurrence;
}
