import type { CalendarCategory, CalendarCategoryColor } from "../model";

export const CATEGORY_COLOR_MAP = {
  RED: "bg-red-500",
  BLUE: "bg-blue-500",
  GREEN: "bg-green-500",
  YELLOW: "bg-yellow-500",
  PURPLE: "bg-purple-500",
  ORANGE: "bg-orange-500",
  PINK: "bg-pink-500",
  GRAY: "bg-gray-500",
  CYAN: "bg-cyan-500",
  TEAL: "bg-teal-500",

  // 카테고리명으로 찾기
  할_일: "bg-cyan-500",
  취미: "bg-purple-500",
  회사: "bg-teal-500",
  학교: "bg-pink-500",
  기타: "bg-gray-500",
} as const;

export const getCategoryColorClass = (color: CalendarCategoryColor | CalendarCategory): string => {
  return CATEGORY_COLOR_MAP[color as keyof typeof CATEGORY_COLOR_MAP] || "bg-gray-500";
};
