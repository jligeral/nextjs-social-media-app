import prisma from "@/lib/prisma";
import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import { postDataInclude } from "@/lib/types";
import TrendsSideBar from "@/components/TrendsSideBar";

export default async function Home()  {

  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
        <Post key={post.id} post={post} />
        ))}
      </div>
      <TrendsSideBar />
    </main>
  );
}
