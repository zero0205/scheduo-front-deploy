import { useState } from "react";
import { useGetCalendarList } from "@/entities/calendar";
import { EditCalendar } from "@/features/edit-calendar";

export const CalendarList = () => {
  const { data, isLoading, error } = useGetCalendarList();
  const [hoveredCalendarId, setHoveredCalendarId] = useState<number>(-1);

  if (isLoading) {
    return (
      <div className="mt-2 space-y-3">
        <div className="flex h-9 items-center justify-center">
          <span className="text-grayscale-500 text-medium-m">캘린더 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 space-y-3">
        <div className="flex h-9 items-center justify-center">
          <span className="text-medium-m text-red-500">캘린더 목록을 불러오는데 실패했습니다.</span>
        </div>
      </div>
    );
  }

  const calendars = data?.calendars || [];

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
