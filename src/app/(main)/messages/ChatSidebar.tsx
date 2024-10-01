import { useSession } from "../SessionProvider";
import {ChannelList} from "stream-chat-react";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import {cn} from "@/lib/utils";

interface ChatSideBarProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatSidebar({open, onClose}: ChatSideBarProps) {
  const {user} = useSession();

  return (
    <div className={cn("size-full flex flex-col border-e md:w-72")}>
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {members: {$in: [user.id]}},
            }
          }
        }}
      />
    </div>
  )
}

interface MenuHeaderProps {
  onClose: () => void;
}

function MenuHeader({onClose}: MenuHeaderProps) {
  return (
    <div className={`flex items-center gap-3 p-2`}>
      <div className={`h-full md:hidden`}>
        <Button
          size={`icon`}
          variant={`ghost`}
          onClick={onClose}
        >
          <X className={`size-5`} />
        </Button>
      </div>
    </div>
  )
}
