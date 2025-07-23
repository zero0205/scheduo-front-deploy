import { create } from "zustand";
import type { CalendarInfo } from "./types";

interface CalendarState {
  calendars: CalendarInfo[];
  setCalendars: (calendars: CalendarInfo[]) => void;
  addCalendar: (calendar: CalendarInfo) => void;
  updateCalendar: (updatedCalendar: CalendarInfo) => void;
  deleteCalendar: (calendarId: number) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  calendars: [],
  setCalendars: (calendars) => set({ calendars }),
  addCalendar: (calendar) => set((state) => ({ calendars: [...state.calendars, calendar] })),
  updateCalendar: (updatedCalendar) =>
    set((state) => ({
      calendars: state.calendars.map((c) => (c.calendarId === updatedCalendar.calendarId ? updatedCalendar : c)),
    })),
  deleteCalendar: (calendarId) =>
    set((state) => ({
      calendars: state.calendars.filter((c) => c.calendarId !== calendarId),
    })),
}));
