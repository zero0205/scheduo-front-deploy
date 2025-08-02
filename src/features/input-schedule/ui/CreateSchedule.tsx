import { useState } from "react";
import type { InputScheduleRequest } from "@/entities/schedule";
import { devLogger } from "@/shared/lib";
import { ScheduleForm } from "./ScheduleForm";

interface CreateScheduleProps {
  onCancel: () => void;
}

/**
 * 새로운 일정을 생성하는 사이드바 컴포넌트입니다.
 */
export const CreateSchedule = ({ onCancel }: CreateScheduleProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: InputScheduleRequest) => {
    try {
      setIsSubmitting(true);
      devLogger.log("일정 생성:", data);
    } catch (error) {
      devLogger.error("일정 생성 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0 px-6 py-4">
        <h2 className="text-bold-l text-grayscale-black">새 일정 추가</h2>
      </div>

      <div className="min-h-0 flex-1">
        <ScheduleForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};
