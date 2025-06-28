import { ManageSettings } from "@/features/manage-settings";
import { useAuthStore } from "@/shared/stores";

export const UserInfo = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-col items-start justify-center gap-2">
        <span className="font-medium text-bold-m text-grayscale-700">{user.nickname}</span>
        <span className="text-grayscale-700 text-medium-s">{user.email}</span>
      </div>
      <ManageSettings />
    </div>
  );
};
