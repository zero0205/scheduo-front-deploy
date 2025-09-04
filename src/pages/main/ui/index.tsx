import { useState } from "react";
import { Navigate } from "react-router";
import { useGetCalendarList } from "@/entities/calendar";
import { useCurrentCalendarId } from "@/shared/lib";
import { Calendar, LeftSidebar, RightSidebar } from "@/widgets";

export const Main = () => {
  const currentCalendarId = useCurrentCalendarId();
  const { data, isLoading, error } = useGetCalendarList();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // calendarId가 없고 캘린더 데이터가 있으면 첫 번째 캘린더로 리다이렉트
  if (!currentCalendarId && !isLoading && !error && data?.calendars?.length) {
    const firstCalendarId = data.calendars[0].calendarId;
    return <Navigate to={`/calendar/${firstCalendarId}`} replace />;
  }

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-grayscale-500 text-medium-l">캘린더를 불러오는 중...</div>
      </div>
    );
  }

  // 에러가 발생했을 때
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-medium-l text-red-500">캘린더를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  // 캘린더가 없을 때
  const calendars = data?.calendars || [];
  if (calendars.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-grayscale-500 text-medium-l">사용 가능한 캘린더가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-row">
      <LeftSidebar />
      <Calendar onDateSelect={setSelectedDate} />
      <RightSidebar selectedDate={selectedDate} />
    </div>
  );
};
