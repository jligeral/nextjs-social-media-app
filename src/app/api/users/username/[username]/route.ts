import {validateRequest} from "@/auth";
import {getUserDataSelect} from "@/lib/types";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params: {username} }: { params: {username : string}}) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive'
        }
      },
      select: getUserDataSelect(loggedInUser.id)
    });

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(user);

  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Internal Service Error' }, { status: 500 });
  }
}
