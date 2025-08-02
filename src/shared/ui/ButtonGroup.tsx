import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/ui";

interface ButtonGroupProps {
  leftText?: string;
  onLeftClick: () => void;
  leftIcon?: LucideIcon;
  rightText?: string;
  onRightClick: () => void;
  rightIcon?: LucideIcon;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
}

/**
 * 사이드바 하단에 고정되는 2개 버튼 액션바 컴포넌트입니다.
 * 왼쪽은 메인 액션(기본 스타일), 오른쪽은 보조 액션(outline 스타일)으로 구성됩니다.
 * 아이콘은 선택적으로 사용할 수 있습니다.
 */
export const ButtonGroup = ({
  leftText = "확인",
  onLeftClick,
  leftIcon,
  rightText = "취소",
  onRightClick,
  rightIcon,
  leftDisabled = false,
  rightDisabled = false,
}: ButtonGroupProps) => {
  const LeftIcon = leftIcon;
  const RightIcon = rightIcon;

  return (
    <div className="mb-5 h-16 flex-shrink-0 p-6">
      <div className="flex items-center gap-2">
        <Button onClick={onLeftClick} disabled={leftDisabled} className="flex-1">
          {LeftIcon && <LeftIcon className="mr-2 h-4 w-4" />}
          {leftText}
        </Button>
        <Button variant="outline" onClick={onRightClick} disabled={rightDisabled} className="flex-1">
          {RightIcon && <RightIcon className="mr-2 h-4 w-4" />}
          {rightText}
        </Button>
      </div>
    </div>
  );
};
