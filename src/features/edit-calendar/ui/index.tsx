import { PenSquare, Trash2, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type CalendarRole,
  useDeleteCalendar,
  useDeleteParticipant,
  useGetCalendar,
  useInviteToCalendar,
  useUpdateCalendar,
  useUpdateParticipantRole,
} from "@/entities/calendar";
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

interface EditCalendarFormData {
  title: string;
  nickname: string;
}

interface EditCalendarProps {
  calendarId: number;
}

export const EditCalendar = ({ calendarId }: EditCalendarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteCalendar, setShowDeleteCalendar] = useState(false);
  const [showDeleteMember, setShowDeleteMember] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  const { data: calendarData, isLoading, error, refetch } = useGetCalendar(calendarId, isOpen);
  const updateMutation = useUpdateCalendar();
  const deleteMutation = useDeleteCalendar();
  const deleteParticipantMutation = useDeleteParticipant();
  const updateParticipantRoleMutation = useUpdateParticipantRole();
  const inviteToCalendarMutation = useInviteToCalendar();

  const form = useForm<EditCalendarFormData>({
    defaultValues: {
      title: "",
      nickname: "",
    },
  });

  const excludeEmails = useMemo(() => {
    const participantEmails = calendarData?.participants?.map((p) => p.email) || [];
    const selectedEmails = selectedMembers.map((m) => m.email);
    return [...participantEmails, ...selectedEmails];
  }, [calendarData?.participants, selectedMembers]);

  useEffect(() => {
    if (calendarData && isOpen) {
      form.reset({
        title: calendarData.title || "",
        nickname: calendarData.memberNickname || "",
      });
    }
  }, [calendarData, isOpen, form]);

  const handleSelectMember = (member: Member) => {
    setSelectedMembers((prev) => [...prev, member]);
  };

  const handleRemoveSelectedMember = (memberId: number) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleInviteAll = () => {
    if (selectedMembers.length === 0) return;

    const memberIds = selectedMembers.map((member) => member.id);

    inviteToCalendarMutation.mutate(
      { calendarId, memberIds },
      {
        onSuccess: () => {
          setSelectedMembers([]);
        },
      },
    );
  };

  const handleRoleChange = (participantId: number, role: CalendarRole) => {
    updateParticipantRoleMutation.mutate({
      calendarId,
      participantId,
      role,
    });
  };

  const handleRemoveParticipant = (participantId: number) => {
    deleteParticipantMutation.mutate({
      calendarId,
      participantId,
    });
  };

  const handleSubmit = (data: EditCalendarFormData) => {
    if (!calendarId) return;

    updateMutation.mutate(
      {
        calendarId,
        data: {
          title: data.title,
          nickname: data.nickname,
        },
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          toast("캘린더가 성공적으로 수정되었습니다.");
        },
      },
    );
  };

  const handleCancel = () => {
    form.reset();
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (!calendarId) return;

    deleteMutation.mutate(calendarId, {
      onSuccess: () => {
        setIsOpen(false);
        toast("캘린더가 성공적으로 삭제되었습니다.");
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
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
            <div className="text-medium-m text-notification-strong">{error.message}</div>
            <Button variant="outline" onClick={() => refetch()}>
              다시 시도
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex min-w-0 flex-col space-y-6">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "캘린더 이름을 입력해주세요" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>캘린더 이름</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="캘린더 이름을 입력하세요"
                        {...field}
                        className={cn(
                          form.formState.errors.title &&
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
                  <Button
                    type="button"
                    onClick={handleInviteAll}
                    disabled={inviteToCalendarMutation.isPending || selectedMembers.length === 0}
                  >
                    {inviteToCalendarMutation.isPending ? "초대 중..." : `초대 (${selectedMembers.length})`}
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
                            <User className="h-4 w-4" />
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

                {calendarData?.participants && calendarData.participants.length > 0 && (
                  <ScrollArea className="max-h-80 rounded-lg border border-grayscale-400 p-3">
                    <div className="space-y-1 pr-1">
                      {calendarData.participants.map((participant) => (
                        <div key={participant.participantId} className="flex items-center gap-2 py-1">
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
                            onValueChange={(value) =>
                              handleRoleChange(participant.participantId, value as CalendarRole)
                            }
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
                            onConfirm={() => handleRemoveParticipant(participant.participantId)}
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
                  expectedText={form.watch("title") || ""}
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
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "저장 중..." : "저장"}
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
