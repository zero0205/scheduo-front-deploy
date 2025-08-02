import { useEffect, useState } from "react";
import { calendarApi, useCalendarStore } from "@/entities/calendar";
import { EditCalendar } from "@/features/edit-calendar";

export const CalendarList = () => {
  const { calendars, setCalendars } = useCalendarStore();
  const [hoveredCalendarId, setHoveredCalendarId] = useState<number>(-1);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await calendarApi.getCalendarList();
        setCalendars(response.calendars);
      } catch (error) {
        console.error("Failed to fetch calendars:", error);
      }
    };

    fetchCalendars();
  }, [setCalendars]);

  return (
    <div className="mt-2 space-y-3">
      {calendars.map((calendar) => (
        <div
          key={calendar.calendarId}
          className="flex h-9 flex-1 cursor-pointer items-center justify-between rounded-md px-3 hover:bg-grayscale-200"
          onMouseEnter={() => setHoveredCalendarId(calendar.calendarId)}
          onMouseLeave={() => setHoveredCalendarId(-1)}
        >
          <span className="truncate text-grayscale-500 text-medium-m">{calendar.title}</span>
          <div className={`${hoveredCalendarId === calendar.calendarId ? "opacity-100" : "size-0 opacity-0"}`}>
            <EditCalendar calendarId={calendar.calendarId} />
          </div>
        </div>
      ))}
    </div>
  );
};
