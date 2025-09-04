import { type UseQueryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scheduleApi } from "./api";
import { scheduleKeys } from "./queryKeys";
import type {
  CreateScheduleRequest,
  DailyScheduleResponse,
  MonthlyScheduleResponse,
  ScheduleDetailResponse,
  UpdateScheduleRequest,
} from "./types";

// 특정 날짜 일정 조회
export const useDailySchedules = (
  calendarId: number,
  date: string,
  options?: Partial<UseQueryOptions<DailyScheduleResponse, Error, DailyScheduleResponse>>,
) => {
  return useQuery({
    queryKey: scheduleKeys.byDate(calendarId, date),
    queryFn: () => scheduleApi.getSchedulesByDate(calendarId, date),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

// 월별 일정 조회
export const useMonthlySchedules = (
  calendarId: number,
  date: string,
  options?: Partial<UseQueryOptions<MonthlyScheduleResponse, Error, MonthlyScheduleResponse>>,
) => {
  return useQuery({
    queryKey: scheduleKeys.byMonth(calendarId, date),
    queryFn: () => scheduleApi.getSchedulesByMonth(calendarId, date),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

// 일정 상세 조회
export const useScheduleDetail = (
  calendarId: number,
  scheduleId: number,
  date: string,
  options?: Partial<UseQueryOptions<ScheduleDetailResponse, Error, ScheduleDetailResponse>>,
) => {
  return useQuery({
    queryKey: scheduleKeys.detail(calendarId, scheduleId, date),
    queryFn: () => scheduleApi.getScheduleById(calendarId, scheduleId, date),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

// 일정 생성
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, request }: { calendarId: number; request: CreateScheduleRequest }) =>
      scheduleApi.createSchedule(calendarId, request),
    onSuccess: (_, { calendarId }) => {
      // 해당 캘린더의 모든 일정 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["schedules", "byDate", calendarId],
      });
      queryClient.invalidateQueries({
        queryKey: ["schedules", "byMonth", calendarId],
      });
    },
  });
};

// 일정 수정
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      calendarId,
      scheduleId,
      date,
      request,
    }: {
      calendarId: number;
      scheduleId: number;
      date: string;
      request: UpdateScheduleRequest;
    }) => scheduleApi.updateSchedule(calendarId, scheduleId, date, request),
    onSuccess: (_, { calendarId, scheduleId, date }) => {
      // 해당 일정 상세 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: scheduleKeys.detail(calendarId, scheduleId, date),
      });
      // 해당 캘린더의 모든 일정 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["schedules", "byDate", calendarId],
      });
      queryClient.invalidateQueries({
        queryKey: ["schedules", "byMonth", calendarId],
      });
    },
  });
};
