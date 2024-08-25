"use client"

import {useInfiniteQuery} from "@tanstack/react-query";
import {PostsPage} from "@/lib/types";
import {Loader2} from "lucide-react";
import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

interface UserPostsFeedProps {
  userId: string;
}

export default function UserPostsFeed({ userId }: UserPostsFeedProps) {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/posts`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === 'pending') {
    return <PostsLoadingSkeleton />
  }

  if (status === 'success' && !posts.length && !hasNextPage) {
    return <p className={`text-center text-muted`}>
      This user has not posted anything yet.
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
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className={`mx-auto animate-spin`}/>}

    </InfiniteScrollContainer>
  )
}
