import { axiosInstance } from "@/shared/api";
import type {
  CreateCalendarRequest,
  CreateCalendarResponse,
  GetCalendarByIdResponse,
  GetCalendarListResponse,
  InviteToCalendarRequest,
  UpdateCalendarRequest,
} from "./types";

export const calendarApi = {
  createCalendar: async (data: CreateCalendarRequest): Promise<CreateCalendarResponse> => {
    const result = await axiosInstance.post("/calendars", data);
    return result.data.data;
  },
  updateCalendar: async (calendarId: number, data: UpdateCalendarRequest) => {
    await axiosInstance.patch(`/calendars/${calendarId}`, data);
  },
  deleteCalendar: async (calendarId: number) => {
    await axiosInstance.delete(`/calendars/${calendarId}`);
  },

  inviteToCalendar: async (calendarId: number, data: InviteToCalendarRequest) => {
    await axiosInstance.post(`/calendars/${calendarId}`, data);
  },

  getCalendarList: async (): Promise<GetCalendarListResponse> => {
    const result = await axiosInstance.get("/calendars");
    return result.data.data;
  },

  getCalendarById: async (calendarId: number): Promise<GetCalendarByIdResponse> => {
    const result = await axiosInstance.get(`/calendars/${calendarId}`);
    return result.data.data;
  },

  acceptInvite: async (calendarId: number) => {
    await axiosInstance.post(`/calendars/${calendarId}/invite/accept`);
  },
  rejectInvite: async (calendarId: number) => {
    await axiosInstance.post(`/calendars/${calendarId}/invite/decline`);
  },
};
