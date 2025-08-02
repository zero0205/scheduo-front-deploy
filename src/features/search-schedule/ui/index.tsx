import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, Input } from "@/shared/ui";
import { RecentSearchKeyword } from "./RecentSearchKeyword";
import { SearchResults } from "./SearchResults";
import type { SearchResultItem, ViewType } from "./types";

const MAX_RECENT_KEYWORD_NUM = 5;
const RECENT_SEARCH_KEYWORD_STORAGE_KEY = "recentSearchKeyword";

/**
 * 검색을 위한 사이드바 컴포넌트입니다.
 * 검색어 입력 기능을 제공합니다.
 */
export const SearchSchedule = () => {
  const [viewType, setViewType] = useState<ViewType>("RECENT");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [recentSearchKeyword, setRecentSearchKeyword] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (keyword?: string) => {
    const query = keyword || searchInputRef.current?.value.trim() || "";
    if (query) {
      setIsSearching(true);

      const filtered = recentSearchKeyword.filter((keyword) => keyword !== query);
      const updated = [query, ...filtered].slice(0, MAX_RECENT_KEYWORD_NUM);
      setRecentSearchKeyword(updated);

      localStorage.setItem(RECENT_SEARCH_KEYWORD_STORAGE_KEY, updated.join(","));

      if (keyword && searchInputRef.current) {
        searchInputRef.current.value = keyword;
      }

      // TODO: 검색 API 호출
      setTimeout(() => {
        setSearchResults([
          {
            scheduleId: 12,
            calendarId: 5,
            calendarName: "팀 프로젝트",
            title: "팀 회의",
            startDate: "2025-04-01",
            endDate: "2025-04-01",
            startTime: "09:00",
            endTime: "10:00",
          },
          {
            scheduleId: 27,
            calendarId: 3,
            calendarName: "개인 캘린더",
            title: "고객 회의",
            startDate: "2025-04-01",
            endDate: "2025-04-01",
            startTime: "15:00",
            endTime: "16:00",
          },
        ]);
        setIsSearching(false);
        setViewType("RESULT");
      }, 500);
    }
  };

  const handleRemoveKeyword = (removeKeyword: string) => {
    const updated = recentSearchKeyword.filter((val) => val !== removeKeyword);
    setRecentSearchKeyword(updated);
    localStorage.setItem(RECENT_SEARCH_KEYWORD_STORAGE_KEY, updated.join(","));
  };

  useEffect(() => {
    const savedKeywords = localStorage.getItem(RECENT_SEARCH_KEYWORD_STORAGE_KEY);
    if (savedKeywords) {
      const keywords = savedKeywords.split(",").filter((keyword) => keyword.trim() !== "");
      setRecentSearchKeyword(keywords);
    }
  }, []);

  return (
    <div className="flex h-full flex-col p-2">
      <div className="mb-4 flex items-center gap-1">
        <Input
          type="text"
          ref={searchInputRef}
          placeholder="검색어를 입력하세요"
          className="w-full rounded-lg border border-grayscale-400 p-2 outline-none focus:border-transparent focus:ring-2 focus:ring-primary-main"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => handleSearch()}
          className="group hover:bg-transparent"
        >
          <Search className="size-6 text-grayscale-400 transition-colors group-hover:text-primary-main" />
        </Button>
      </div>

      {viewType === "RESULT" ? (
        <SearchResults results={searchResults} isLoading={isSearching} />
      ) : (
        <RecentSearchKeyword
          recentKeywords={recentSearchKeyword}
          onSearchKeyword={handleSearch}
          onRemoveKeyword={handleRemoveKeyword}
        />
      )}
    </div>
  );
};
