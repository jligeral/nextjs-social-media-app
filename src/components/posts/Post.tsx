"use client"

import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import {formatRelativeDate} from "@/lib/utils";
import {useSession} from "@/app/(main)/SessionProvider";
import PostMoreButton from "@/components/posts/PostMoreButton";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {

  const {user} = useSession();

  return(
    <article className={`group/delete space-y-3 rounded-2xl bg-card shadow-sm p-5`}>
      <div className={`flex justify-between gap-3`}>
        <div className={`flex flex-wrap gap-3`}>
          <Link href={`/users/${post.user.username}`}>
            <UserAvatar avatarUrl={post.user.avatarUrl}/>
          </Link>
          <div>
            <Link href={`/users/${post.user.username}`}
                  className="block font-medium hover:underline"
            >
              {post.user.displayName}
            </Link>
            <Link
              href={post.id}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {user && user.id === post.user.id && (
          <PostMoreButton
            post={post}
            className={`opacity-0 transition-opacity group-hover/delete:opacity-100`}
          />
        )}
      </div>
      <div className="whitespace-pre-line break-words">
        {post.content}
      </div>
    </article>
  )
}
