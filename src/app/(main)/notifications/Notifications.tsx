"use client"

import {useInfiniteQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {NotificationsPage} from "@/lib/types";
import {Loader2} from "lucide-react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import Notification from "@/app/(main)/notifications/Notification";
import kyInstance from "@/lib/ky";
import {useEffect} from "react";

export default function Notifications() {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();

  const {mutate} = useMutation({
    mutationFn: () => kyInstance.patch("/api/notifications/mark-as-read"),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notifications"], {
        unreadCount: 0,
      })
    },
    onError(error) {
      console.error("An error occurred marking notifications as read", error);
    }
  })

  useEffect(() => {
    mutate()
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === 'pending') {
    return <PostsLoadingSkeleton />
  }

  if (status === 'success' && !notifications.length && !hasNextPage) {
    return <p className={`text-center text-muted`}>
      You haven&apos;t received any notifications yet.
    </p>
  }

  if (status === 'error') {
    return <p className={`text-center text-destructive`}>
      An error occurred loading the feed. Please try again later.
    </p>
  }
  return (
    <InfiniteScrollContainer className={`space-y-5`}
                             onBottomReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
    >
      {notifications.map(notification => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && <Loader2 className={`mx-auto animate-spin`}/>}

    </InfiniteScrollContainer>
  )
}
