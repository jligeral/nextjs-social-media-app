"use server"

import {getCommentDataInclude, PostData} from "@/lib/types";
import {validateRequest} from "@/auth";
import {createCommentSchema} from "@/lib/validation";
import prisma from "@/lib/prisma";

export async function submitComment ({
  post,
  content
                                     }: {post: PostData, content: string}) {
  const {user} = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const {content: validatedContent} = createCommentSchema.parse({content});

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: validatedContent,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(post.user.id !== user.id
      ? [
        prisma.notification.create({
          data: {
            issuerId: user.id,
            recipientId: post.user.id,
            postId: post.id,
            type: "COMMENT",
          }
        })
        ]: []
    )
  ])

  return newComment;
}

export async function deleteComment(id: string) {
  const {user} = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
