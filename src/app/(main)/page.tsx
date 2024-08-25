import prisma from "@/lib/prisma";
import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import TrendsSideBar from "@/components/TrendsSideBar";
import ForYouFeed from "@/app/(main)/ForYouFeed";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import FollowingFeed from "@/app/(main)/FollowingFeed";

export default function Home()  {

  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue={`for-you`}>
          <TabsList>
            <TabsTrigger value={`for-you`}>For You</TabsTrigger>
            <TabsTrigger value={`following`}>Following</TabsTrigger>
          </TabsList>
          <TabsContent value={`for-you`}>
            <ForYouFeed />
          </TabsContent>
          <TabsContent value={`following`}>
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSideBar />
    </main>
  );
}
