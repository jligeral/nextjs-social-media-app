import prisma from "@/lib/prisma";
import {cache} from "react";
import {FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import {notFound} from "next/navigation";
import {validateRequest} from "@/auth";
import {Metadata} from "next";
import TrendsSideBar from "@/components/TrendsSideBar";
import UserAvatar from "@/components/UserAvatar";
import {formatDate} from "date-fns";
import {formatNumber} from "@/lib/utils";
import FollowerCount from "@/components/FollowerCount";
import {Button} from "@/components/ui/button";
import FollowButton from "@/components/FollowButton";
import UserPostsFeed from "@/app/(main)/users/[username]/UserPostsFeed";

interface PageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive'
      }
    },
    select: getUserDataSelect(loggedInUserId)
  });

  if (!user)  notFound();
  return user;
});

export async function generateMetadata({ params: { username } }: PageProps): Promise<Metadata> {
  const {user: loggedInUser} = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  }

}

export default async function Page({ params: { username } }: PageProps) {
  const {user: loggedInUser} = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className={`text-destructive`}>
        Unauthorized
      </p>
    )
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className={`flex w-full min-w-0 gap-5`}>
      <div className={`w-full min-w-0 space-y-5`}>
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className={`rounded-2xl bg-card p-5 shadow-sm`}>
          <h2 className={`text-center text-2xl font-bold`}>
            {user.displayName}&apos;s Posts
          </h2>
        </div>
        <UserPostsFeed userId={user.id} />
      </div>
      <TrendsSideBar />
    </main>
  );

}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({followerId}) => followerId === loggedInUserId
    )
  }

  return (
    <div className={`h-fit p-5 shadow-sm bg-card w-full space-y-5 rounded-2xl`}>
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className={`mx-auto size-full max-h-60 max-w-60 rounded-full`}
      />
      <div className={`flex flex-wrap gap-3 sm:flex-nowrap`}>
        <div className={`me-auto space-y-3`}>
          <div>
            <h1 className={`text-3xl font-bold`}>
              {user.displayName}
            </h1>
            <div className={`text-muted-foreground`}>
              @{user.username}
            </div>
          </div>
          <div>
            Member since {formatDate(user.createdAt, 'MMM do, yyyy')}
          </div>
          <div className={`flex items-center gap-3`}>
            <span>
              Posts: {" "}
              <span className={`font-semibold`}>
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount
              userId={user.id}
              initialState={followerInfo}
            />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit Profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <div className={`whitespace-pre-line overflow-hidden break-words`}>
            {user.bio}
          </div>
        </>
      )}
    </div>
  )
}
