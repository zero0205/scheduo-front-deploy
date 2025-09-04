import { format, isBefore, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { CalendarCategory, InputScheduleRequest, ScheduleDetailResponse } from "@/entities/schedule";
import { cn } from "@/shared/lib";
import {
  Button,
  ButtonGroup,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "@/shared/ui";
import { NOTIFICATION_OPTIONS, RECURRENCE_OPTIONS } from "../consts";
import type { ScheduleFormData } from "../lib";
import { TimePicker } from "./TimePicker";

interface ScheduleFormProps {
  initialData?: ScheduleDetailResponse;
  onSubmit: (data: InputScheduleRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

/**
 * ISO 문자열이나 날짜 문자열에서 날짜 부분만 추출
 */
const extractDate = (dateString?: string): string => {
  if (!dateString) return "";
  // ISO 문자열 (YYYY-MM-DDTHH:mm:ss) 또는 날짜 문자열 (YYYY-MM-DD)
  return dateString.split("T")[0];
};

/**
 * ISO 문자열에서 시간 부분만 추출
 */
const extractTime = (dateTimeString?: string): string => {
  if (!dateTimeString) return "";
  if (!dateTimeString.includes("T")) return "00:00"; // 날짜만 있는 경우
  const timePart = dateTimeString.split("T")[1];
  return timePart ? timePart.slice(0, 5) : "00:00"; // HH:mm 형태로
};

/**
 * 일정 생성/수정을 위한 폼 컴포넌트입니다.
 * 초기 데이터 여부에 따라 생성/수정 모드로 사용할 수 있습니다.
 */
export const ScheduleForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = "저장",
}: ScheduleFormProps) => {
  const form = useForm<ScheduleFormData>({
    defaultValues: {
      title: initialData?.title ?? "",
      isAllDay: initialData?.allDay ?? false,
      // startDate, endDate: 다양한 형태 처리
      startDate: extractDate(initialData?.startDateTime) || "",
      endDate: extractDate(initialData?.endDateTime) || "",
      // startTime, endTime: ISO 문자열에서 시간 추출 또는 기본값
      startTime: extractTime(initialData?.startDateTime) || "00:00",
      endTime: extractTime(initialData?.endDateTime) || "01:00",
      location: initialData?.location ?? "",
      category: initialData?.category as CalendarCategory,
      memo: initialData?.memo ?? "",
      hasNotification: initialData?.notificationTime !== undefined,
      notificationTime: initialData?.notificationTime ?? "FIVE_MINUTES_BEFORE",
      hasRecurrence: initialData?.recurrence !== null && initialData?.recurrence !== undefined,
      recurrenceRule: initialData?.recurrence?.frequency ?? "DAILY",
      recurrenceEndDate: initialData?.recurrence?.recurrenceEndDate ?? "",
    },
  });

  const isAllDay = form.watch("isAllDay");
  const hasNotification = form.watch("hasNotification");
  const hasRecurrence = form.watch("hasRecurrence");

  const onFormSubmit = (data: ScheduleFormData) => {
    const requestData: InputScheduleRequest = {
      title: data.title,
      isAllDay: data.isAllDay,
      startDateTime: data.isAllDay ? `${data.startDate}T00:00:00` : `${data.startDate}T${data.startTime}:00`,
      endDateTime: data.isAllDay ? `${data.endDate}T23:59:59` : `${data.endDate}T${data.endTime}:00`,
      location: data.location,
      category: data.category,
      memo: data.memo,
      notificationTime: data.hasNotification ? data.notificationTime : undefined,
      recurrence: data.hasRecurrence
        ? {
            frequency: data.recurrenceRule,
            recurrenceEndDate: data.recurrenceEndDate,
          }
        : null,
    };

    onSubmit(requestData);
  };

  const [openDatePicker, setOpenDatePicker] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-3">
            {/* 일정 제목 */}
            <FormField
              control={form.control}
              name="title"
              rules={{ required: "일정 제목은 필수입니다" }}
              render={({ field, fieldState }) => (
                <FormItem className="mx-3">
                  <FormLabel
                    className={cn(
                      "text-medium-m",
                      fieldState.error ? "text-notification-strong" : "text-grayscale-700",
                    )}
                  >
                    일정 제목
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="일정 제목을 입력하세요"
                      {...field}
                      className={cn(
                        fieldState.error &&
                          "border-[2px] border-notification-strong focus:border-notification-strong focus:ring-notification-strong",
                      )}
                    />
                  </FormControl>
                  {fieldState.error && <p className="text-notification-strong text-sm">{fieldState.error.message}</p>}
                </FormItem>
              )}
            />

            {/* 하루 종일 스위치 */}
            <FormField
              control={form.control}
              name="isAllDay"
              render={({ field }) => (
                <FormItem className="mx-3 flex items-center justify-between">
                  <FormLabel className="text-grayscale-700 text-medium-m">하루 종일</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 시작 날짜 */}
            <FormField
              control={form.control}
              name="startDate"
              rules={{ required: "시작 날짜는 필수입니다" }}
              render={({ field, fieldState }) => (
                <FormItem className="mx-3">
                  <FormLabel
                    className={cn(
                      "text-medium-m",
                      fieldState.error ? "text-notification-strong" : "text-grayscale-700",
                    )}
                  >
                    시작 날짜
                  </FormLabel>
                  <FormControl>
                    <Popover
                      open={openDatePicker === "startDate"}
                      onOpenChange={(open) => setOpenDatePicker(open ? "startDate" : null)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                            fieldState.error && "border-[2px] border-notification-strong text-notification-strong",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(new Date(field.value), "yyyy/MM/dd", { locale: ko })
                            : "시작 날짜를 선택하세요"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(format(date, "yyyy-MM-dd"));
                              setOpenDatePicker(null);
                            }
                          }}
                          locale={ko}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  {fieldState.error && <p className="text-notification-strong text-sm">{fieldState.error.message}</p>}
                </FormItem>
              )}
            />

            {/* 시작 시간 */}
            {!isAllDay && (
              <FormField
                control={form.control}
                name="startTime"
                rules={{ required: !isAllDay ? "시작 시간은 필수입니다" : false }}
                render={({ field, fieldState }) => (
                  <FormItem className="mx-3">
                    <FormLabel
                      className={cn(
                        "text-medium-m",
                        fieldState.error ? "text-notification-strong" : "text-grayscale-700",
                      )}
                    >
                      시작 시간
                    </FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        className={cn(fieldState.error && "border-[2px] border-notification-strong")}
                      />
                    </FormControl>
                    {fieldState.error && <p className="text-notification-strong text-sm">{fieldState.error.message}</p>}
                  </FormItem>
                )}
              />
            )}

            {/* 종료 날짜 */}
            <FormField
              control={form.control}
              name="endDate"
              rules={{ required: "종료 날짜는 필수입니다" }}
              render={({ field, fieldState }) => {
                const startDate = form.watch("startDate");
                return (
                  <FormItem className="mx-3">
                    <FormLabel
                      className={cn(
                        "text-medium-m",
                        fieldState.error ? "text-notification-strong" : "text-grayscale-700",
                      )}
                    >
                      종료 날짜
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={openDatePicker === "endDate"}
                        onOpenChange={(open) => setOpenDatePicker(open ? "endDate" : null)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              fieldState.error && "border-[2px] border-notification-strong text-notification-strong",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(new Date(field.value), "yyyy/MM/dd", { locale: ko })
                              : "종료 날짜를 선택하세요"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(format(date, "yyyy-MM-dd"));
                                setOpenDatePicker(null);
                              }
                            }}
                            disabled={(date) =>
                              startDate ? isBefore(startOfDay(date), startOfDay(new Date(startDate))) : false
                            }
                            locale={ko}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    {fieldState.error && <p className="text-notification-strong text-sm">{fieldState.error.message}</p>}
                  </FormItem>
                );
              }}
            />

            {/* 종료 시간 */}
            {!isAllDay && (
              <FormField
                control={form.control}
                name="endTime"
                rules={{ required: !isAllDay ? "종료 시간은 필수입니다" : false }}
                render={({ field, fieldState }) => (
                  <FormItem className="mx-3">
                    <FormLabel
                      className={cn(
                        "text-medium-m",
                        fieldState.error ? "text-notification-strong" : "text-grayscale-700",
                      )}
                    >
                      종료 시간
                    </FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        className={cn(fieldState.error && "border-[2px] border-notification-strong")}
                      />
                    </FormControl>
                    {fieldState.error && <p className="text-notification-strong text-sm">{fieldState.error.message}</p>}
                  </FormItem>
                )}
              />
            )}

            {/* 장소 */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="mx-3">
                  <FormLabel className="text-grayscale-700 text-medium-m">장소</FormLabel>
                  <FormControl>
                    <Input placeholder="장소를 입력하세요" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 카테고리 */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="mx-3">
                  <FormLabel className="text-grayscale-700 text-medium-m">카테고리</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="할 일">할 일</SelectItem>
                        <SelectItem value="취미">취미</SelectItem>
                        <SelectItem value="학교">학교</SelectItem>
                        <SelectItem value="회사">회사</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 메모 */}
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem className="mx-3">
                  <FormLabel className="text-grayscale-700 text-medium-m">메모</FormLabel>
                  <FormControl>
                    <Textarea placeholder="메모를 입력하세요" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 알림 설정 */}
            <FormField
              control={form.control}
              name="hasNotification"
              render={({ field }) => (
                <FormItem className="mx-3 flex items-center justify-between">
                  <FormLabel className="text-grayscale-700 text-medium-m">알림</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 알림 시간 선택 */}
            {hasNotification && (
              <FormField
                control={form.control}
                name="notificationTime"
                render={({ field }) => (
                  <FormItem className="mx-3">
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {NOTIFICATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* 일정 반복 */}
            <FormField
              control={form.control}
              name="hasRecurrence"
              render={({ field }) => (
                <FormItem className="mx-3 flex items-center justify-between">
                  <FormLabel className="text-grayscale-700 text-medium-m">일정 반복</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 반복 규칙 */}
            {hasRecurrence && (
              <>
                <FormField
                  control={form.control}
                  name="recurrenceRule"
                  render={({ field }) => (
                    <FormItem className="mx-3">
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {RECURRENCE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* 반복 종료일 */}
                <FormField
                  control={form.control}
                  name="recurrenceEndDate"
                  rules={{
                    required: hasRecurrence ? "반복 종료일은 필수입니다" : false,
                  }}
                  render={({ field, fieldState }) => {
                    const startDate = form.watch("startDate");
                    return (
                      <FormItem className="mx-3">
                        <FormLabel
                          className={cn(
                            "text-medium-m",
                            fieldState.error ? "text-notification-strong" : "text-grayscale-700",
                          )}
                        >
                          반복 종료일
                        </FormLabel>
                        <FormControl>
                          <Popover
                            open={openDatePicker === "recurrenceEndDate"}
                            onOpenChange={(open) => setOpenDatePicker(open ? "recurrenceEndDate" : null)}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  fieldState.error &&
                                    "border-[2px] border-notification-strong text-notification-strong",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value
                                  ? format(new Date(field.value), "yyyy년 MM월 dd일", { locale: ko })
                                  : "반복 종료일을 선택하세요"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(format(date, "yyyy-MM-dd"));
                                    setOpenDatePicker(null);
                                  }
                                }}
                                disabled={(date) =>
                                  startDate ? isBefore(startOfDay(date), startOfDay(new Date(startDate))) : false
                                }
                                locale={ko}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        {fieldState.error && (
                          <p className="text-notification-strong text-sm">{fieldState.error.message}</p>
                        )}
                      </FormItem>
                    );
                  }}
                />
              </>
            )}
          </form>
        </Form>
      </ScrollArea>

      {/* 하단 버튼 그룹 */}
      <ButtonGroup
        leftText={isSubmitting ? "저장 중..." : submitButtonText}
        onLeftClick={form.handleSubmit(onFormSubmit)}
        leftDisabled={isSubmitting}
        rightText="취소"
        onRightClick={onCancel}
      />
    </div>
  );
};
