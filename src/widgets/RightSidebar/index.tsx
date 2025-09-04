import { Bell, Search } from "lucide-react";
import { useState } from "react";
import type { ScheduleItem } from "@/entities/schedule";
import { CreateSchedule, EditSchedule } from "@/features/input-schedule";
import { SearchSchedule } from "@/features/search-schedule";
import { ShareSchedule } from "@/features/share-schedule";
import { DailySchedule } from "@/features/view-daily-schedule";
import { NotificationList } from "@/features/view-notification";
import { ScheduleDetail } from "@/features/view-schedule-detail";
import type { RightSidebarViewType } from "@/shared/model";
import { Button } from "@/shared/ui";

/**
 * 애플리케이션 우측에 위치하는 사이드바 컴포넌트입니다.
 * 일정 관리와 관련된 다양한 뷰를 내부 상태에 따라 동적으로 렌더링합니다.
 *
 * 헤더 영역의 검색과 알림 버튼을 통해 해당 기능으로 뷰를 전환할 수 있으며,
 * 메인 콘텐츠 영역에서는 일정 조회, 생성, 수정, 공유, 검색, 알림 등의 기능을 제공합니다.
 */

interface RightSidebarProps {
  selectedDate?: Date;
}

export const RightSidebar = ({ selectedDate }: RightSidebarProps) => {
  const [currentView, setCurrentView] = useState<RightSidebarViewType>("daily");
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | undefined>(undefined);

  const handleScheduleDetail = (scheduleData: ScheduleItem) => {
    setSelectedScheduleId(scheduleData.id);
    setCurrentView("detail");
  };

  const handleScheduleEdit = (scheduleData?: ScheduleItem) => {
    if (scheduleData) {
      setSelectedScheduleId(scheduleData.id);
    }
    setCurrentView("edit");
  };

  const handleCancel = () => {
    setSelectedScheduleId(undefined);
    setCurrentView("daily");
  };

  const renderContent = () => {
    switch (currentView) {
      case "daily":
        return (
          <DailySchedule selectedDate={selectedDate} onSetView={setCurrentView} onScheduleEdit={handleScheduleDetail} />
        );
      case "share":
        return <ShareSchedule onSetView={setCurrentView} />;
      case "create":
        return <CreateSchedule onCancel={() => setCurrentView("daily")} />;
      case "detail":
        return (
          <ScheduleDetail
            scheduleId={selectedScheduleId}
            selectedDate={selectedDate}
            onEdit={handleScheduleEdit}
            onCancel={handleCancel}
          />
        );
      case "edit":
        return <EditSchedule scheduleId={selectedScheduleId} selectedDate={selectedDate} onCancel={handleCancel} />;
      case "search":
        return <SearchSchedule />;
      case "notification":
        return <NotificationList />;
      default:
        return (
          <DailySchedule selectedDate={selectedDate} onSetView={setCurrentView} onScheduleEdit={handleScheduleDetail} />
        );
    }
  };

  return (
    <div className="flex h-screen w-80 flex-col overflow-hidden border-gray-200 border-l bg-white shadow-lg">
      <div className="flex h-12 items-center justify-end gap-2 p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView("search")}
          className="h-8 w-8 p-0"
          aria-label="검색"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView("notification")}
          className="h-8 w-8 p-0"
          aria-label="알림"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </div>
      <div className="h-[calc(100%-3rem)]">{renderContent()}</div>
    </div>
  );
};
