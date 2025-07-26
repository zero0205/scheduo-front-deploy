import type { Notification } from "@/entities/notification";
import { devLogger } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { X } from "lucide-react";
import { NOTIFICATION_TYPE_LABELS } from "../consts";
import { getRelativeTime } from "../lib";

interface NotificationItemProps {
  notification: Notification;
  onDelete: (id: number) => void;
}

export const NotificationItem = ({ notification, onDelete }: NotificationItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest('[data-action="delete"]')) {
      e.stopPropagation();
      onDelete(notification.id);
      return;
    }
  };

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // TODO: POST /calendars/{calendarId}/invite/accept API 연동
      devLogger.log(`Accepted notification ${notification.id}`);
      onDelete(notification.id);
    } catch (error) {
      devLogger.error("Failed to accept notification", error);
    }
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // TODO: POST /calendars/{calendarId}/invite/decline API 연동
      devLogger.log(`Declined notification ${notification.id}`);
      onDelete(notification.id);
    } catch (error) {
      devLogger.error("Failed to decline notification", error);
    }
  };

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer flex-col gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-grayscale-100 hover:shadow-sm"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <span className="text-bold-m text-grayscale-black">{NOTIFICATION_TYPE_LABELS[notification.type]} 알림</span>
        <div className="flex items-center">
          <span className="text-grayscale-500 text-medium-s">{getRelativeTime(notification.createdAt)}</span>
          <span
            data-action="delete"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded text-grayscale-500 hover:text-grayscale-black"
            aria-label="알림 삭제"
          >
            <X className="h-4 w-4" />
          </span>
        </div>
      </div>
      <p className="text-grayscale-700 text-medium-s">{notification.message}</p>
      {notification.type === "CALENDAR_INVITATION" && (
        <div className="flex w-full gap-2 pt-2">
          <Button className="flex-1" variant="default" size="sm" onClick={handleAccept}>
            수락
          </Button>
          <Button className="flex-1" variant="outline" size="sm" onClick={handleDecline}>
            거절
          </Button>
        </div>
      )}
    </button>
  );
};
