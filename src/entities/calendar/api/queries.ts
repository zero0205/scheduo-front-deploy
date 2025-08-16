import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/entities/notification/api/queryKeys";
import type { CalendarRole } from "../model";
import { calendarApi } from "./calendarApi";
import { participantApi } from "./participantApi";
import { calendarKeys } from "./queryKeys";
import type { UpdateCalendarRequest } from "./types";

export const useGetCalendarList = () => {
  return useQuery({
    queryKey: calendarKeys.list(),
    queryFn: calendarApi.getCalendarList,
  });
};

export const useGetCalendar = (calendarId: number, enabled: boolean) => {
  return useQuery({
    queryKey: calendarKeys.detail(calendarId),
    queryFn: () => calendarApi.getCalendarById(calendarId),
    enabled,
  });
};

export const useCreateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarApi.createCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.list() });
    },
  });
};

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, data }: { calendarId: number; data: UpdateCalendarRequest }) =>
      calendarApi.updateCalendar(calendarId, data),
    onSuccess: (_, { calendarId }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.list() });
      queryClient.invalidateQueries({ queryKey: calendarKeys.detail(calendarId) });
    },
  });
};

export const useDeleteCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarApi.deleteCalendar,
    onSuccess: (_, calendarId) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.list() });
      queryClient.removeQueries({ queryKey: calendarKeys.detail(calendarId) });
    },
  });
};

export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarApi.acceptInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
};

export const useRejectInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calendarApi.rejectInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
};

export const useDeleteParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, participantId }: { calendarId: number; participantId: number }) =>
      participantApi.deleteParticipant(calendarId, participantId),
    onSuccess: (_, { calendarId }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.detail(calendarId) });
    },
  });
};

export const useUpdateParticipantRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      calendarId,
      participantId,
      role,
    }: {
      calendarId: number;
      participantId: number;
      role: CalendarRole;
    }) => participantApi.modifyRole(calendarId, participantId, role),
    onSuccess: (_, { calendarId }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.detail(calendarId) });
    },
  });
};

export const useInviteToCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, memberIds }: { calendarId: number; memberIds: number[] }) =>
      calendarApi.inviteToCalendar(calendarId, { memberIds }),
    onSuccess: (_, { calendarId }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.detail(calendarId) });
    },
  });
};
