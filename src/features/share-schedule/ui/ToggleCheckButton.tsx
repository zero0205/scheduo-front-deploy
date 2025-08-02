import { Check } from "lucide-react";
import { Button } from "@/shared/ui";

interface ToggleCheckButtonProps {
  isSelected: boolean;
  onToggle: () => void;
  ariaLabel: string;
  className?: string;
}

/**
 * 체크 표시가 있는 토글 버튼 컴포넌트입니다.
 * 선택/해제 상태를 시각적으로 표시하며, 원형 버튼 형태로 렌더링됩니다.
 *
 * @param isSelected - 현재 선택된 상태 여부
 * @param onToggle - 버튼 클릭 시 실행될 함수
 * @param ariaLabel - 스크린 리더용 접근성 레이블
 * @param className - 버튼에 적용할 추가 CSS 클래스
 */
export const ToggleCheckButton = ({ isSelected, onToggle, ariaLabel, className = "" }: ToggleCheckButtonProps) => {
  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      onClick={onToggle}
      className={`flex size-5 items-center justify-center rounded-full border-2 hover:bg-transparent ${
        isSelected ? "border-none bg-primary-main" : "text-grayscale-400"
      } ${className}`}
      aria-label={ariaLabel}
    >
      <Check className={isSelected ? "text-white" : "text-grayscale-400"} strokeWidth={3} />
    </Button>
  );
};
