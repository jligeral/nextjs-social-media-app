"use client"

import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import {cn, formatRelativeDate} from "@/lib/utils";
import {useSession} from "@/app/(main)/SessionProvider";
import PostMoreButton from "@/components/posts/PostMoreButton";
import Linkify from "@/components/Linkify";
import UserTooltip from "@/components/UserTooltip";
import {Media} from "@prisma/client";
import Image from "next/image";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {

  const {user} = useSession();

  return(
    <article className={`group/delete space-y-3 rounded-2xl bg-card shadow-sm p-5`}>
      <div className={`flex justify-between gap-3`}>
        <div className={`flex flex-wrap gap-3`}>
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl}/>
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user} >
              <Link href={`/users/${post.user.username}`}
                     className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning // This is to remove the warning message if trying to view page immediately after creating a post
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
      <Linkify>
        <div className="whitespace-pre-line break-words">
          {post.content}
        </div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
    </article>
  )
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return(
    <div className={cn("flex flex-col gap-3", attachments.length > 1 && "sm:grid sm:grid-cols-2")}>
      {attachments.map((media) => (
        <MediaPreview key={media.id} media={media} />
      ))}
    </div>
  )
}
interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt={`Attachment`}
        width={500}
        height={500}
        className={`mx-auto size-fit max-h-[30rem] rounded-2xl`}
      />
    );
  }
  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className={`mx-auto size-fit max-h-[30rem] rounded-2xl`}
        />
      </div>
    );
  }
  return <p className={`text-destructive`}>Unsupported media type</p>;
}
