"use client"

import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {PostData, PostsPage} from "@/lib/types";
import {Loader2} from "lucide-react";
import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import {Button} from "@/components/ui/button";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

export default function ForYouFeed() {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
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
      No posts to show. Follow some users to see their posts here.
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
