import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCalendarStore } from "@/entities/calendar";
import { cn } from "@/shared/lib";
import type { RightSidebarViewType } from "@/shared/model";
import { Button, ButtonGroup, Calendar, Popover, PopoverContent, PopoverTrigger, ScrollArea } from "@/shared/ui";
import type { ShareScheduleItemType } from "../lib";
import { ShareScheduleItem } from "./ShareScheduleItem";
import { ToggleCheckButton } from "./ToggleCheckButton";

interface ShareScheduleProps {
  onSetView: (viewType: RightSidebarViewType) => void;
}

/**
 * 우측 사이드바에서 일정 공유 기능을 제공하는 컴포넌트입니다.
 * 사용자가 공유할 일정을 선택하고 날짜 범위를 설정할 수 있습니다.
 *
 * 상단의 취소 버튼을 통해 일일 일정 뷰로 돌아갈 수 있으며,
 * 하단의 확인 버튼을 통해 선택된 일정을 공유할 수 있습니다.
 *
 * @param onSetView - 뷰를 변경하기 위한 콜백 함수
 */
export const ShareSchedule = ({ onSetView }: ShareScheduleProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedCalendar, setSelectedCalendar] = useState("");
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState<Set<string>>(new Set());
  const [schedules] = useState<ShareScheduleItemType[]>([
    {
      id: 1,
      title: "스케줄 1",
      date: "2025-04-13",
      startTime: "19:00",
      endTime: "23:59",
    },
    {
      id: 2,
      title: "스케줄 2",
      date: "2025-05-26",
      startTime: "19:00",
      endTime: "23:59",
    },
    {
      id: 3,
      title: "스케줄 3",
      date: "2025-05-30",
      startTime: "19:00",
      endTime: "23:59",
    },
    {
      id: 4,
      title: "스케줄 4",
      date: "2025-05-30",
      startTime: "19:00",
      endTime: "23:59",
    },
    {
      id: 5,
      title: "스케줄 5",
      date: "2025-05-30",
      startTime: "19:00",
      endTime: "23:59",
    },
    {
      id: 6,
      title: "스케줄 6",
      date: "2025-05-30",
      startTime: "19:00",
      endTime: "23:59",
    },
  ]);
  const calendars = useCalendarStore((state) => state.calendars);

  const getScheduleKey = (scheduleId: number, date: string): string => {
    return `${scheduleId}|${date}`;
  };

  const toggleScheduleSelection = (scheduleId: number, date: string): void => {
    const key = getScheduleKey(scheduleId, date);
    setSelectedSchedules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleAllSchedules = (): void => {
    const allKeys = schedules.map((schedule) => getScheduleKey(schedule.id, schedule.date));
    const allSelected = allKeys.every((key) => selectedSchedules.has(key));

    if (allSelected) {
      setSelectedSchedules(new Set());
    } else {
      setSelectedSchedules(new Set(allKeys));
    }
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setIsStartCalendarOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setIsEndCalendarOpen(false);
  };

  const isAllSelected = schedules.every((schedule) =>
    selectedSchedules.has(getScheduleKey(schedule.id, schedule.date)),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="h-20 p-6">
        <h2 className="mb-4 text-bold-l text-grayscale-black">일정 공유하기</h2>
      </div>

      <ScrollArea className="w-full flex-1 overflow-y-auto">
        <div className="mx-3 space-y-6 pb-6">
          {/* 공유할 캘린더 선택 */}
          <section>
            <h3 className="text-grayscale-700 text-medium-m">공유할 캘린더 선택</h3>
            <div className="relative">
              <select
                value={selectedCalendar}
                onChange={(e) => {
                  setSelectedCalendar(e.target.value);
                  e.target.blur();
                }}
                className="w-full cursor-pointer appearance-none rounded-lg border border-grayscale-400 bg-white px-4 py-2 outline-none focus:border-primary-main focus:ring-1 focus:ring-primary-main"
              >
                {calendars.map((calendar) => {
                  return (
                    <option key={calendar.calendarId} value={calendar.title}>
                      {calendar.title}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-5 w-5 transform text-grayscale-400" />
            </div>
          </section>

          {/* 날짜 선택 */}
          <section>
            <h3 className="text-grayscale-700 text-medium-m">시작 날짜</h3>
            <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start px-4 text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "yyyy/MM/dd") : "날짜를 선택하세요"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={handleStartDateSelect} initialFocus />
              </PopoverContent>
            </Popover>

            <h3 className="text-grayscale-700 text-medium-m">종료 날짜</h3>
            <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start px-4 text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "yyyy/MM/dd") : "날짜를 선택하세요"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateSelect}
                  initialFocus
                  disabled={(date) => (startDate ? date < startDate : false)}
                />
              </PopoverContent>
            </Popover>
          </section>

          {/* 일정 목록 */}
          <div className="space-y-3">
            <div className="flex items-center justify-end">
              <span className="mr-1 text-gray-500 text-xs">모두 선택</span>
              <ToggleCheckButton
                isSelected={isAllSelected}
                onToggle={toggleAllSchedules}
                ariaLabel={isAllSelected ? "모든 일정 선택 해제" : "모든 일정 선택"}
              />
            </div>
            {schedules.map((schedule) => (
              <ShareScheduleItem
                key={schedule.id}
                schedule={schedule}
                isSelected={selectedSchedules.has(getScheduleKey(schedule.id, schedule.date))}
                toggleScheduleSelection={toggleScheduleSelection}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <ButtonGroup
        onLeftClick={() => console.log("일정 공유 완료!")}
        leftDisabled={!startDate || selectedSchedules.size === 0}
        onRightClick={() => onSetView("daily")}
      />
    </div>
  );
};
