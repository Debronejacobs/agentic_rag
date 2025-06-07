"use client";

import * as React from "react"
import {  Bot,  FileText, Settings2} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter,  SidebarRail } from "@/components/ui/sidebar"


const data = {
  navMain: [
    {
      title: "Chat",
      icon: Bot,
      isActive: true,
      items: [
        { title: "New Conversation" , id:"conversations" },
        { title: "History" , id : "past_chats"},
      ],
    },
    {
      title: "Documents",
      icon: FileText,
      items: [
        { title: "Upload data" , id : "upload_docs" },
      ],
    },
    {
      title: "Settings",
      icon: Settings2,
      items: [
        { title: "Profile"  , id : "profile_settings"  },
      ],
    },
  ],
}

export function AppSidebar({onSelect , ...props}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain}  onSelect={onSelect} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
