import type { InputScheduleRequest } from "@/entities/schedule";
import { devLogger } from "@/shared/lib";
import { useEffect, useState } from "react";
import { ScheduleForm } from "./ScheduleForm";

interface EditScheduleProps {
  onCancel: () => void;
}

/**
 * 일정을 수정하는 사이드바 컴포넌트입니다.
 */
export const EditSchedule = ({ onCancel }: EditScheduleProps) => {
  const [initialData, setInitialData] = useState<InputScheduleRequest | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const data: InputScheduleRequest = {
          title: "테스트 제목",
          isAllDay: false,
          startDate: "2025-06-03",
          startTime: "12:30",
          endDate: "2025-06-06",
          endTime: "14:22",
          location: "강남역",
          category: "",
          memo: "메모",
          notificationTime: "FIVE_MINUTES_BEFORE",
          recurrence: {
            recurrenceRule: "WEEKLY",
            recurrenceEndDate: "2025-06-28",
          },
        };
        setInitialData(data);
      } catch {
        throw new Error("일정 데이터를 가져오던 중 에러가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleSubmit = async (data: InputScheduleRequest) => {
    try {
      setIsSubmitting(true);
      devLogger.log("일정 수정:", data);
    } catch (error) {
      devLogger.error("일정 수정 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-grayscale-400 text-medium-m">로딩 중...</div>
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
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
