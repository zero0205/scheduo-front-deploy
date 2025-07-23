import { axiosInstance } from "@/shared/api";
import type { CalendarRole } from "../model";

export const participantApi = {
  modifyRole: async (calendarId: number, participantId: number, role: CalendarRole) => {
    await axiosInstance.patch(`/calendars/${calendarId}/participants/${participantId}`, { role });
  },
  deleteParticipant: async (calendarId: number, participantId: number) => {
    await axiosInstance.delete(`/calendars/${calendarId}/participants/${participantId}`);
  },
};
