import {validateRequest} from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({error: "Unauthorized"}, {status: 401});
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        likes: {
          where: {
            userId: loggedInUser.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          }
        }
      }
    });

    if (!post) {
      return Response.json({error: "Post not found"}, {status: 404});
    }

  } catch (error) {
    console.error(error);
    return Response.json({error: "Internal Server Error"}, {status: 500});
  }
}
