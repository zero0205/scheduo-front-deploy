export const NOTIFICATION_TEXT_MAP = {
  ONE_DAY_BEFORE: "1일 전",
  ONE_HOUR_BEFORE: "1시간 전",
  THIRTY_MINUTES_BEFORE: "30분 전",
  FIVE_MINUTES_BEFORE: "5분 전",
} as const;

export const getNotificationText = (notificationTime?: string) => {
  return NOTIFICATION_TEXT_MAP[notificationTime as keyof typeof NOTIFICATION_TEXT_MAP] || "없음";
};
