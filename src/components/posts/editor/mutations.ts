import { useToast } from "@/components/ui/use-toast";
import {InfiniteData, QueryFilters, useMutation, useQueryClient} from "@tanstack/react-query";
import {submitPost} from "@/components/posts/editor/actions";
import {PostsPage} from "@/lib/types";
import {useSession} from "@/app/(main)/SessionProvider";

export function useSubmitPostMutation() {

  const {toast} = useToast();

  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter = { queryKey: ["post-feed"],
        predicate(query) {
          return query.queryKey.includes("for-you") ||
            query.queryKey.includes("user-posts") && query.queryKey.includes(user.id);
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData: any) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1)
              ]
            };
          }
        },
      );

      /* Invalidate the query if it has no data */

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        }
      })

      toast({
        description: "Post submitted successfully",
      })
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit post",
      });
    }
  })
  return mutation;
}
