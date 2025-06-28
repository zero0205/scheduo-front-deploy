export interface Member {
  id: number;
  email: string;
  nickname: string;
  socialType?: "KAKAO" | "GOOGLE";
  createdAt?: string;
  updatedAt?: string;
}
