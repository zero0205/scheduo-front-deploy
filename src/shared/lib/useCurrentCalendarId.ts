import { useParams } from "react-router";

/**
 * 현재 URL에서 캘린더 ID를 가져오는 훅
 * @returns calendarId (number) 또는 undefined
 */
export const useCurrentCalendarId = (): number | undefined => {
  const { calendarId } = useParams<{ calendarId: string }>();

  if (!calendarId) {
    return undefined;
  }

  const parsedId = Number(calendarId);
  return Number.isNaN(parsedId) ? undefined : parsedId;
};
