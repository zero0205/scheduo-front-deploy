import { X } from "lucide-react";
import { Button } from "@/shared/ui";

interface RecentSearchKeywordProps {
  recentKeywords: string[];
  onSearchKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}
/**
 * 최근 검색어를 최대 5개까지 보여주는 컴포넌트입니다.
 * 최근 검색어를 클릭하면 해당 검색어로 다시 검색하고, X 버튼으로 개별 삭제할 수 있습니다.
 */
export const RecentSearchKeyword = ({ recentKeywords, onSearchKeyword, onRemoveKeyword }: RecentSearchKeywordProps) => {
  return (
    <div className="space-y-2">
      <h3 className="pl-1 text-bold-m text-grayscale-black">최근 검색</h3>
      <ul>
        {recentKeywords.map((keyword) => (
          <li key={keyword} className="group px-2">
            <div className="flex items-center justify-between rounded-md px-2 py-1">
              <button
                type="button"
                onClick={() => onSearchKeyword(keyword)}
                className="min-w-0 flex-1 text-left text-grayscale-700 text-medium-r"
              >
                <span className="block truncate">{keyword}</span>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemoveKeyword(keyword)}
                className="h-6 w-6 flex-shrink-0 hover:bg-transparent"
                aria-label={`"${keyword}" 검색 기록 삭제`}
              >
                <X className="size-3 text-grayscale-400" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
