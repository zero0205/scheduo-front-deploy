import { cn } from "@/shared/lib";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui";

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  className?: string;
}

export const TimePicker = ({ value = "", onChange, className }: TimePickerProps) => {
  const [hours, minutes] = value ? value.split(":") : ["", ""];

  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

  const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"));

  const handleHourChange = (hour: string) => {
    const newTime = `${hour}:${minutes || "00"}`;
    onChange(newTime);
  };

  const handleMinuteChange = (minute: string) => {
    const newTime = `${hours || "00"}:${minute}`;
    onChange(newTime);
  };

  const displayHours = hours || "00";
  const displayMinutes = minutes || "00";

  return (
    <div className={cn("flex w-full gap-2", className)}>
      <div className="flex-1">
        <Select value={displayHours} onValueChange={handleHourChange}>
          <SelectTrigger className="w-full">
            <SelectValue>{displayHours}시</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {hourOptions.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}시
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Select value={displayMinutes} onValueChange={handleMinuteChange}>
          <SelectTrigger className="w-full">
            <SelectValue>{displayMinutes}분</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {minuteOptions.map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}분
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
