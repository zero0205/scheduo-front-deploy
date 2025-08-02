import { Loader2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { memberApi } from "@/entities/member/api";
import type { Member } from "@/entities/member/model";
import { cn, devLogger } from "@/shared/lib";
import { Input } from "@/shared/ui";

interface MemberSearchInputProps {
  placeholder?: string;
  excludeEmails?: string[];
  onSelectMember: (member: Member) => void;
  className?: string;
}

interface SearchResult {
  users: Member[];
}

/**
 * 멤버를 검색하고 선택할 수 있는 검색 입력 컴포넌트입니다.
 * 실시간 검색과 드롭다운 결과를 제공합니다.
 */
export const MemberSearchInput = ({
  placeholder = "이메일을 입력하여 멤버를 검색하세요",
  excludeEmails = [],
  onSelectMember,
  className,
}: MemberSearchInputProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 검색 디바운싱을 위한 useEffect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const result: SearchResult = await memberApi.searchMember(searchQuery.trim());
          setSearchResults(result.users || []);
          setShowSearchResults(true);
        } catch (error) {
          devLogger.error("멤버 검색 실패:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // 검색 결과 영역 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSelectMember = (member: Member) => {
    onSelectMember(member);

    // 검색 초기화
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)} ref={searchContainerRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchInputChange(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowSearchResults(true);
            }
          }}
        />
        {isSearching && (
          <div className="-translate-y-1/2 absolute top-1/2 right-3">
            <Loader2 className="h-4 w-4 animate-spin text-grayscale-400" />
          </div>
        )}
      </div>

      {/* 검색 결과 드롭다운 */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-grayscale-300 bg-white shadow-lg">
          {searchResults.map((member) => {
            const isExcluded = excludeEmails.includes(member.email);

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => !isExcluded && handleSelectMember(member)}
                disabled={isExcluded}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                  isExcluded
                    ? "cursor-not-allowed bg-grayscale-50 text-grayscale-400"
                    : "cursor-pointer hover:bg-grayscale-50",
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-grayscale-100">
                  <User className="h-4 w-4 text-grayscale-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-grayscale-700 text-medium-r">{member.nickname}</div>
                  <div className="truncate text-grayscale-400 text-medium-s">{member.email}</div>
                </div>
                {isExcluded && <span className="text-grayscale-400 text-small">이미 추가됨</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* 검색 결과가 없는 경우 */}
      {showSearchResults && searchResults.length === 0 && searchQuery.trim().length >= 2 && !isSearching && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-lg border border-grayscale-300 bg-white p-4 text-center text-grayscale-400 text-medium-r shadow-lg">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
};
