export type NotificationType = "CALENDAR_INVITATION" | "CALENDAR_INVITATION_ACCEPTED" | "SCHEDULE_NOTIFICATION";

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  data: Record<string, unknown>;
  createdAt: string;
}
