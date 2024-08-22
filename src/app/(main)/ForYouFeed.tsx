"use client"

import {useQuery} from "@tanstack/react-query";
import {PostData} from "@/lib/types";
import {Loader2} from "lucide-react";
import Post from "@/components/posts/Post";

export default function ForYouFeed() {

  const query = useQuery<PostData[]>({
    queryKey: ['posts', 'for-you'],
    queryFn: async () => {
      const res = await fetch('/api/posts/for-you');
      if (!res.ok) {
        throw Error(`Request failed with status: ${res.status}`);
      }
      return res.json();
    },
  });

  if (query.status === 'pending') {
    return <Loader2 className={`mx-auto animate-spin`}/>
  }

  if (query.status === 'error') {
    return <p className={`text-center text-destructive`}>
      An error occurred loading the feed. Please try again later.
    </p>
  }
  return (
    <>
      {query.data.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </>
  )
}
