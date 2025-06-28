import type { CalendarParticipant, CalendarRole, ScheduleCalendar } from "@/entities/calendar";
import type { Member } from "@/entities/member/model";
import { ROLE_OPTIONS } from "@/shared/const";
import { cn } from "@/shared/lib";
import {
  Button,
  ConfirmDialog,
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
  MemberSearchInput,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TextConfirmDialog,
} from "@/shared/ui";
import { PenSquare, Trash2, User, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface EditableScheduleCalendar extends ScheduleCalendar {
  nickname: string;
}

interface EditCalendarFormData {
  name: string;
  nickname: string;
}

interface EditCalendarProps {
  calendarId: number;
}

/**
 * 기존 캘린더를 수정하는 다이얼로그 컴포넌트입니다.
 * 캘린더 이름, 닉네임 수정과 실시간 참가자 초대/권한 변경/삭제 기능을 제공합니다.
 */
export const EditCalendar = ({ calendarId }: EditCalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [participants, setParticipants] = useState<CalendarParticipant[]>([]);
  const [showDeleteCalendar, setShowDeleteCalendar] = useState(false);
  const [showDeleteMember, setShowDeleteMember] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  const form = useForm<EditCalendarFormData>({
    defaultValues: {
      name: "",
      nickname: "",
    },
  });

  const excludeEmails = useMemo(() => {
    const participantEmails = participants.map((p) => p.email);
    const selectedEmails = selectedMembers.map((m) => m.email);
    return [...participantEmails, ...selectedEmails];
  }, [participants, selectedMembers]);

  const fetchCalendarData = useCallback(async (id: number): Promise<EditableScheduleCalendar> => {
    try {
      // TODO: 실제 캘린더 조회 API 호출로 교체
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        id,
        name: "기존 캘린더 이름",
        nickname: "내 이름",
        participants: [
          {
            id: 1,
            email: "owner@example.com",
            nickname: "소유자",
            role: "OWNER",
          },
          {
            id: 2,
            email: "editor@example.com",
            nickname: "편집자",
            role: "EDITOR",
          },
        ],
      };
    } catch (err) {
      throw new Error("캘린더 정보를 불러오는데 실패했습니다.");
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !calendarId) return;

    const loadCalendarData = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const data = await fetchCalendarData(calendarId);
        form.reset({
          name: data.name || "",
          nickname: data.nickname || "",
        });
        setParticipants(data.participants || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCalendarData();
  }, [calendarId, isOpen, fetchCalendarData, form]);

  const handleSelectMember = (member: Member) => {
    setSelectedMembers((prev) => [...prev, member]);
  };

  const handleRemoveSelectedMember = (memberId: number) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleInviteAll = async () => {
    if (selectedMembers.length === 0) return;

    setIsInviting(true);
    try {
      // TODO: 여러 멤버 초대 API 호출

      // API 성공 후에만 UI 업데이트
      const newParticipants: CalendarParticipant[] = selectedMembers.map((member) => ({
        id: member.id,
        email: member.email,
        nickname: member.nickname,
        role: "VIEWER",
      }));

      setParticipants((prev) => [...prev, ...newParticipants]);
      setSelectedMembers([]);

      // TODO: 성공 토스트 표시
    } catch (error) {
      console.error("참가자 초대 실패:", error);
      // TODO: 에러 토스트 표시
      // UI 상태는 자동으로 원래대로 유지됨 (API 실패 시 아무것도 변경하지 않음)
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (participantId: number, role: CalendarRole) => {
    try {
      // TODO: 역할 변경 API 호출

      setParticipants((prev) =>
        prev.map((participant) => (participant.id === participantId ? { ...participant, role } : participant)),
      );
    } catch (error) {
      console.error("역할 변경 실패:", error);
      // TODO: 에러 토스트 표시
    }
  };

  const handleRemoveParticipant = async (participantId: number) => {
    try {
      // TODO: 삭제 API 호출

      setParticipants((prev) => prev.filter((participant) => participant.id !== participantId));
    } catch (error) {
      console.error("참가자 삭제 실패:", error);
      // TODO: 에러 토스트 표시
    }
  };

  const handleSubmit = async (data: EditCalendarFormData) => {
    setIsSubmitting(true);
    try {
      const updateData = {
        name: data.name,
        nickname: data.nickname,
      };

      console.log(updateData);
      // TODO: 캘린더 수정 API 호출(닉네임은 수정하지 않는다면 null을 넣거나 아예 nickname 필드 빼기)

      setIsOpen(false);
      // TODO: 성공 토스트 표시
    } catch (error) {
      console.error("캘린더 수정 실패:", error);
      // TODO: 에러 토스트 표시
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      // TODO: 캘린더 삭제 요청 API 호출

      setIsOpen(false);
      // TODO: 성공 토스트 표시
    } catch (error) {
      console.error("캘린더 삭제 실패:", error);
      // TODO: 에러 토스트 표시
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="hover:bg-transparent">
          <PenSquare size={24} className="text-grayscale-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>캘린더 편집</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-grayscale-400 text-medium-m">로딩 중...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="text-medium-m text-notification-strong">{error}</div>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              닫기
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex min-w-0 flex-col space-y-6">
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

              <FormField
                control={form.control}
                name="nickname"
                rules={{ required: "캘린더에서 사용할 닉네임을 입력해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>닉네임</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="캘린더에서 사용할 닉네임을 입력해주세요"
                        {...field}
                        className={cn(
                          form.formState.errors.nickname &&
                            "border-[2px] border-notification-strong focus:border-notification-strong focus:ring-notification-strong",
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-4">
                <FormLabel>멤버</FormLabel>

                <div className="flex gap-2">
                  <MemberSearchInput
                    placeholder="이메일 또는 닉네임을 입력하여 멤버를 검색하세요"
                    excludeEmails={excludeEmails}
                    onSelectMember={handleSelectMember}
                    className="flex-1"
                  />
                  <Button type="button" onClick={handleInviteAll} disabled={isInviting || selectedMembers.length === 0}>
                    {isInviting ? "초대 중..." : `초대 (${selectedMembers.length})`}
                  </Button>
                </div>

                {selectedMembers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-grayscale-600 text-small">선택된 멤버 ({selectedMembers.length}명)</div>
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {selectedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 rounded-lg border border-primary-main/20 bg-primary-main/5 p-3"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-grayscale-100">
                            <User className="h-4 w-4 text-grayscale-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-grayscale-700 text-medium-r">{member.nickname}</div>
                            <div className="truncate text-grayscale-400 text-medium-s">{member.email}</div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSelectedMember(member.id)}
                            className="text-grayscale-400"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {participants.length > 0 && (
                  <ScrollArea className="max-h-80 rounded-lg border border-grayscale-400 p-3">
                    <div className="space-y-1 pr-1">
                      {participants.map((participant) => (
                        <div key={participant.id} className="flex items-center gap-2 py-1">
                          <div className="flex w-0 flex-1 flex-col">
                            <div
                              className="truncate text-grayscale-700 text-medium-r leading-7"
                              title={participant.nickname}
                            >
                              {participant.nickname}
                            </div>
                            <div className="truncate text-grayscale-400 text-medium-s" title={participant.email}>
                              {participant.email}
                            </div>
                          </div>

                          <Select
                            value={participant.role}
                            onValueChange={(value) => handleRoleChange(participant.id, value as CalendarRole)}
                            disabled={participant.role === "OWNER"}
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

                          <ConfirmDialog
                            isOpen={showDeleteMember}
                            onOpenChange={setShowDeleteMember}
                            title="멤버 삭제"
                            description="멤버를 삭제하시겠습니까?"
                            onConfirm={() => handleRemoveParticipant(participant.id)}
                            variant="destructive"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowDeleteMember(true)}
                              className="text-grayscale-400 hover:bg-transparent"
                              disabled={participant.role === "OWNER"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </ConfirmDialog>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              <div className="flex justify-end">
                <TextConfirmDialog
                  isOpen={showDeleteCalendar}
                  onOpenChange={setShowDeleteCalendar}
                  title="캘린더 삭제"
                  description="캘린더를 삭제하면 모든 일정이 영구적으로 삭제됩니다. 캘린더를 삭제하려면 아래에 캘린더 이름을 똑같이 입력하세요."
                  expectedText={form.watch("name") || ""}
                  onConfirm={handleDelete}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-grayscale-400 underline"
                    onClick={() => setShowDeleteCalendar(true)}
                  >
                    캘린더 삭제
                  </Button>
                </TextConfirmDialog>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "저장 중..." : "저장"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  취소
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
