import { useGetNotifications } from "@/entities/notification";
import { Badge } from "@/shared/ui/badge";
import { NotificationItem } from "./NotificationItem";

/**
 * 우측 사이드바에서 사용되는 알림 컴포넌트입니다.
 * 일정 알림, 캘린더 초대 알림 등을 표시하고 읽음 처리 및 삭제 기능을 제공합니다.
 */
export const NotificationList = () => {
  const { data, isLoading, error } = useGetNotifications();

  const notifications = data?.notifications || [];
  const unreadCount = notifications.length;

  return (
    <div className="w-full max-w-sm p-3">
      <div className="flex h-20 items-center gap-2 p-6">
        <h2 className="text-bold-l text-grayscale-black">알림</h2>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="rounded-[99px] px-2 text-medium-s">
            {unreadCount}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center text-grayscale-500 text-medium-m">알림을 불러오는 중...</p>
        ) : error ? (
          <p className="text-center text-medium-m text-red-500">알림을 불러오는데 실패했습니다.</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-grayscale-500 text-medium-m">알림이 없습니다.</p>
        ) : (
          notifications.map((notification) => <NotificationItem key={notification.id} notification={notification} />)
        )}
      </div>
    </div>
  );
};
