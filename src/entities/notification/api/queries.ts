import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "./notificationApi";
import { notificationKeys } from "./queryKeys";

export { notificationApi };

export const useGetNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationApi.getNotifications,
    staleTime: 2 * 60 * 1000, // 2분 stale time (알림은 자주 확인)
    gcTime: 5 * 60 * 1000, // 5분 garbage collection
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
    },
  });
};
