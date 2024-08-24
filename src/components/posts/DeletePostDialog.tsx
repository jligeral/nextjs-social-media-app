import {PostData} from "@/lib/types";
import {useDeletePostMutation} from "./mutations";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import {Button} from "@/components/ui/button";

interface DeletePostDialogProps {
  post: PostData,
  open: boolean,
  onClose: () => void,
}

export default function DeletePostDialog({post, open, onClose}: DeletePostDialogProps) {
  const mutation = useDeletePostMutation();
  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this post?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant={`destructive`}
            onClick={() => mutation.mutate(post.id, {onSuccess: () => onClose()})}
            loading={mutation.isPending}
          >
            Delete Post
          </LoadingButton>
          <Button
            variant={`outline`}
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

}
