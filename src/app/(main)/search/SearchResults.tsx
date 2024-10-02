"use client"

import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {PostData, PostsPage} from "@/lib/types";
import {Loader2} from "lucide-react";
import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import {Button} from "@/components/ui/button";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

interface SearchResultsProps {
  query: string
}

export default function SearchResults({query}: SearchResultsProps) {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "search", query],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/search",
          {
            searchParams: {
              q: query,
              ...(pageParam ? {cursor: pageParam} : {})
            }
          }
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    gcTime: 0
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === 'pending') {
    return <PostsLoadingSkeleton />
  }

  if (status === 'success' && !posts.length && !hasNextPage) {
    return <p className={`text-center text-muted-foreground`}>
      No results found for &quot;{query}&quot;
    </p>
  }

  if (status === 'error') {
    return <p className={`text-center text-destructive`}>
      An error occurred loading posts. Please try again later.
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
