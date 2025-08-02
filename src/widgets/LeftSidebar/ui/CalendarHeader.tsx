import { Calendar } from "lucide-react";
import { useState } from "react";
import { CreateCalendar } from "@/features/create-calendar";

export const CalendarHeader = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      role="group"
      className="flex items-center justify-between rounded-lg bg-primary-light p-3 text-primary-main"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <Calendar size={18} />
        <span>Calendar</span>
      </div>
      <div className={`${isHovered ? "opacity-100" : "opacity-0"}`}>
        <CreateCalendar />
      </div>
    </div>
  );
};
