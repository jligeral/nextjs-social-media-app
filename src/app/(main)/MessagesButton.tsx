"use client";

import {MessageCountInfo} from "@/lib/types";
import Link from "next/link";
import {Mail} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useQuery} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface MessagesButtonProps {
  initialState: MessageCountInfo;
}

export default function MessagesButton({ initialState }: MessagesButtonProps) {

  const {data} = useQuery({
    queryKey: ["unread-messages"],
    queryFn: () => kyInstance.get("/api/messages/unread-count")
      .json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000
  })

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className={`relative`}>
          <Mail />
          {!!data.unreadCount && (
            <span className={`absolute -right-1 -top-1 rounded-full bg-primary text-primary-foreground px-1 text-xs font-medium tabular-nums`}>
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">
            Messages
          </span>
      </Link>
    </Button>
  )
}
