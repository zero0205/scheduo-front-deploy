import { useForm } from "react-hook-form";
import { Button, Input, Textarea } from "@/shared/ui";
import { Label } from "@/shared/ui/label";

interface InquiryFormData {
  title: string;
  email: string;
  content: string;
}

export const Inquiry = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryFormData>();

  const onSubmit = async (data: InquiryFormData) => {
    try {
      // TODO: 문의하기 API 호출
      console.log("문의 전송:", data);
      // await submitInquiry(data);
      reset();
      // TODO: 문의 접수 성공 토스트
    } catch (error) {
      console.error("문의 전송 실패:", error);
    }
  };

  return (
    <section className="flex h-full w-full flex-col">
      <div className="flex h-16 items-center justify-between p-4">
        <h3 className="text-bold-l text-grayscale-black">1:1 문의/건의하기</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col p-3">
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-grayscale-700 text-medium-l">
              제목
            </Label>
            <Input
              id="title"
              {...register("title", {
                required: "제목을 입력해주세요",
                maxLength: {
                  value: 100,
                  message: "제목은 최대 100글자까지 입력 가능합니다",
                },
              })}
              placeholder="문의 제목을 입력하세요"
              className="w-full"
            />
            {errors.title && <p className="text-medium-s text-notification-strong">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-grayscale-700 text-medium-l">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "올바른 이메일 형식을 입력해주세요",
                },
              })}
              placeholder="답변 받을 이메일을 입력하세요"
              className="w-full"
            />
            {errors.email && <p className="text-medium-s text-notification-strong">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-grayscale-700 text-medium-l">
              내용
            </Label>
            <Textarea
              id="content"
              {...register("content", {
                required: "문의 내용을 입력해주세요",
              })}
              placeholder="문의하실 내용을 자세히 입력해주세요"
              className="min-h-32 w-full resize-none"
              rows={8}
            />
            {errors.content && <p className="text-medium-s text-notification-strong">{errors.content.message}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="w-20">
            {isSubmitting ? "전송 중..." : "확인"}
          </Button>
        </div>
      </form>
    </section>
  );
};
