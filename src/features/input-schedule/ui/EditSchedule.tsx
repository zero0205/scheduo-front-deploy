import { useMemo } from "react";
import type { InputScheduleRequest, UpdateScheduleRequest } from "@/entities/schedule";
import { useScheduleDetail, useUpdateSchedule } from "@/entities/schedule";
import { useCurrentCalendarId } from "@/shared/lib";
import { ScheduleForm } from "./ScheduleForm";

interface EditScheduleProps {
  scheduleId?: number;
  selectedDate?: Date;
  onCancel: () => void;
}

/**
 * 일정을 수정하는 사이드바 컴포넌트입니다.
 */
export const EditSchedule = ({ scheduleId, selectedDate, onCancel }: EditScheduleProps) => {
  const calendarId = useCurrentCalendarId();
  const updateSchedule = useUpdateSchedule();

  const dateString = useMemo(() => {
    if (!selectedDate) return "";
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  const { data: dailyScheduleData, isLoading } = useScheduleDetail(calendarId ?? 0, scheduleId ?? 0, dateString, {
    enabled: !!calendarId && !!scheduleId,
  });
  const handleSubmit = async (data: InputScheduleRequest) => {
    if (!calendarId || !scheduleId || !selectedDate) return;

    const requestData: UpdateScheduleRequest = {
      title: data.title,
      allDay: data.isAllDay,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      location: data.location || undefined,
      memo: data.memo || undefined,
      category: data.category,
      ...(data.notificationTime && { notificationTime: data.notificationTime }),
      ...(data.recurrence && {
        recurrence: {
          frequency: data.recurrence.frequency,
          recurrenceEndDate: data.recurrence.recurrenceEndDate,
        },
      }),
    };

    updateSchedule.mutate(
      { calendarId, scheduleId, date: dateString, request: requestData },
      {
        onSuccess: () => {
          onCancel();
        },
      },
    );
  };

  if (!calendarId || !scheduleId || !selectedDate) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-grayscale-400 text-medium-m">일정을 선택해주세요.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-grayscale-400 text-medium-m">로딩 중...</div>
      </div>
    );
  }

  if (!dailyScheduleData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-grayscale-400 text-medium-m">일정을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 px-6 py-4">
        <h2 className="text-bold-l text-grayscale-black">일정 편집</h2>
      </div>

      <div className="min-h-0 flex-1">
        <ScheduleForm
          initialData={dailyScheduleData}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={updateSchedule.isPending}
        />
      </div>
    </div>
  );
};
