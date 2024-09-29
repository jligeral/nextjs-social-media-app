import { BookmarkInfo } from "@/lib/types";
import {useToast} from "@/components/ui/use-toast";
import {QueryKey, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import {Bookmark} from "lucide-react";
import {cn} from "@/lib/utils";

interface BookmarkButtonProps {
  postId: string
  initialStatus: BookmarkInfo
}

export default function BookmarkButton({ postId, initialStatus }: BookmarkButtonProps) {
  const {toast} = useToast();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["bookmark-info", postId];

  const {data} = useQuery({
    queryKey,
    queryFn: () => kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialStatus,
    staleTime: Infinity,
  });

  const {mutate} = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
    ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
      toast({
        description: data.isBookmarkedByUser ? "Bookmark removed" : "Bookmarked",
      });
      await queryClient.cancelQueries({queryKey});

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }))

      return { previousState };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    },
  })

  return (
    <button onClick={() => mutate()} className={`flex items-center gap-2`}>
      <Bookmark className={cn("size-5", data.isBookmarkedByUser && "fill-primary text-primary")}/>
    </button>
  )
}