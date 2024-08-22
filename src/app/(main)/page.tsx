import prisma from "@/lib/prisma";
import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import { postDataInclude } from "@/lib/types";
import TrendsSideBar from "@/components/TrendsSideBar";
import ForYouFeed from "@/app/(main)/ForYouFeed";

export default function Home()  {



  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendsSideBar />
    </main>
  );
}
