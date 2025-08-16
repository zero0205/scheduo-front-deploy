import { X } from "lucide-react";
import { toast } from "sonner";
import { useAcceptInvite, useRejectInvite } from "@/entities/calendar";
import { type Notification, useDeleteNotification } from "@/entities/notification";
import { Button } from "@/shared/ui";
import { NOTIFICATION_TYPE_LABELS } from "../consts";
import { getRelativeTime } from "../lib";

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const acceptInviteMutation = useAcceptInvite();
  const rejectInviteMutation = useRejectInvite();
  const deleteNotificationMutation = useDeleteNotification();

  const getValidCalendarId = () => {
    const { calendarId } = notification.data ?? {};
    if (typeof calendarId !== "number") {
      toast.error("알림 처리 중 오류가 발생했습니다.");
      return null;
    }
    return calendarId;
  };

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    const calendarId = getValidCalendarId();
    if (!calendarId) return;

    acceptInviteMutation.mutate(calendarId);
  };

  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    const calendarId = getValidCalendarId();
    if (!calendarId) return;

    rejectInviteMutation.mutate(calendarId);
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-grayscale-100 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-bold-m text-grayscale-black">{NOTIFICATION_TYPE_LABELS[notification.type]} 알림</span>
        <div className="flex items-center">
          <span className="text-grayscale-500 text-medium-s">{getRelativeTime(notification.createdAt)}</span>
          <button
            type="button"
            onClick={() => deleteNotificationMutation.mutate(notification.id)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded text-grayscale-500 hover:text-grayscale-black"
            aria-label="알림 삭제"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-grayscale-700 text-medium-s">{notification.message}</p>
      {notification.type === "CALENDAR_INVITATION" && (
        <div className="flex w-full gap-2 pt-2">
          <Button
            className="flex-1"
            variant="default"
            size="sm"
            onClick={handleAccept}
            disabled={acceptInviteMutation.isPending}
          >
            {acceptInviteMutation.isPending ? "수락 중..." : "수락"}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            size="sm"
            onClick={handleDecline}
            disabled={rejectInviteMutation.isPending}
          >
            {rejectInviteMutation.isPending ? "거절 중..." : "거절"}
          </Button>
        </div>
      )}
    </div>
  );
};
