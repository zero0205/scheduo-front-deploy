import { axiosInstance } from "@/shared/api";
import type { Member } from "../model";

export const memberApi = {
  getMyProfile: async (): Promise<Member> => {
    const result = await axiosInstance.get("/members/me");
    return result.data.data;
  },
  editMyProfile: async (newData: Partial<Member>): Promise<{ nickname: string }> => {
    const result = await axiosInstance.patch("/members/me", newData);
    return result.data.data;
  },
  withdrawMyAccount: async () => {},

  searchMember: async (email: string): Promise<{ users: Member[] }> => {
    const result = await axiosInstance.get("/members/search", { params: { email } });
    return result.data.data;
  },
};
