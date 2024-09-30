"use client";

import {NotificationCountInfo} from "@/lib/types";
import Link from "next/link";
import {Bell} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useQuery} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";

interface NotificationsButtonProps {
  initialState: NotificationCountInfo;
}

export default function NotificationsButton({ initialState }: NotificationsButtonProps) {

  const {data} = useQuery({
    queryKey: ["unread-notifications"],
    queryFn: () => kyInstance.get("/api/notifications/unread-count")
      .json<NotificationCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000
  })

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className={`relative`}>
          <Bell/>
          {!!data.unreadCount && (
            <span className={`absolute -right-1 -top-1 rounded-full bg-primary text-primary-foreground px-1 text-xs font-medium tabular-nums`}>
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">
            Notifications
          </span>
      </Link>
    </Button>
  )
}