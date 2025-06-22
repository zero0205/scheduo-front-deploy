import { cn, devLogger } from "@/shared/lib";
import { Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import type { CalendarParticipant, CalendarRole, ScheduleCalendar } from "@/entities/calendar";
import { ROLE_OPTIONS } from "@/shared/const";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

type CreateCalendarFormData = Omit<ScheduleCalendar, "id">;

/**
 * 새로운 캘린더를 생성하는 다이얼로그 컴포넌트입니다.
 * 캘린더 이름을 설정하고, 참가자들을 추가하여 생성합니다.
 */
export const CreateCalendar = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateCalendarFormData>({
    defaultValues: {
      name: "",
      participants: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const handleInvite = () => {
    const emailInput = emailInputRef.current?.value.trim();
    if (!emailInput) return;

    // TODO: 검색 결과 나온 유저만 추가하도록 변경
    const emails = emailInput
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    const existingEmails = fields.map((field) => field.email);

    const newParticipants = emails
      .filter((email) => email && !existingEmails.includes(email))
      .map(
        (email): CalendarParticipant => ({
          id: Date.now() + Math.random(),
          email,
          nickname: email,
          role: "VIEWER",
        }),
      );

    for (const participant of newParticipants) {
      append(participant);
    }

    if (emailInputRef.current) {
      emailInputRef.current.value = "";
    }
  };

  const handleRoleChange = (index: number, role: CalendarRole) => {
    const currentParticipant = fields[index];
    update(index, { ...currentParticipant, role });
  };

  const handleRemoveParticipant = (index: number) => {
    remove(index);
  };

  const handleSubmit = async (data: CreateCalendarFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: 캘린더 생성 API 호출
      form.reset();
      if (emailInputRef.current) {
        emailInputRef.current.value = "";
      }
      devLogger.log("캘린더 생성:", data);
      setIsOpen(false);
    } catch (error) {
      devLogger.error("캘린더 생성 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    if (emailInputRef.current) {
      emailInputRef.current.value = "";
    }
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      form.reset();
      if (emailInputRef.current) {
        emailInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="hover:bg-transparent">
          <Plus size={24} className="text-grayscale-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>캘린더 생성</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex min-w-0 flex-1 flex-col space-y-6">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "캘린더 이름을 입력해주세요" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>캘린더 이름</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="캘린더 이름을 입력하세요"
                      {...field}
                      className={cn(
                        form.formState.errors.name &&
                          "border-[2px] border-notification-strong focus:border-notification-strong focus:ring-notification-strong",
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex min-h-0 flex-1 flex-col space-y-4">
              <FormLabel>멤버</FormLabel>

              <div className="flex gap-2">
                <Input
                  ref={emailInputRef}
                  placeholder="이메일을 입력하세요"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleInvite();
                    }
                  }}
                />
                <Button type="button" onClick={handleInvite}>
                  Invite
                </Button>
              </div>

              {fields.length > 0 && (
                <ScrollArea className="max-h-80 w-full rounded-lg border border-grayscale-400 p-3">
                  <div className="space-y-1 pr-1">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2 py-1">
                        <div className="flex w-0 flex-1 flex-col">
                          <div className="truncate text-grayscale-700 text-medium-r leading-7">{field.nickname}</div>
                          <div className="truncate text-grayscale-400 text-medium-s">{field.email}</div>
                        </div>

                        <Select
                          value={field.role}
                          onValueChange={(value) => handleRoleChange(index, value as CalendarRole)}
                        >
                          <SelectTrigger className="h-8 w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveParticipant(index)}
                          className="text-grayscale-400 hover:bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <DialogFooter className="flex-shrink-0">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "생성 중..." : "생성"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                취소
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
