export const getRelativeTime = (createdAt: string): string => {
  const now = new Date();
  const createdTime = new Date(createdAt);
  const diffInMs = now.getTime() - createdTime.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "방금 전";
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }
  return `${diffInDays}일 전`;
};
