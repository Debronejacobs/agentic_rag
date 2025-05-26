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
        { title: "New Conversation" },
        { title: "History" },
      ],
    },
    {
      title: "Documents",
      icon: FileText,
      items: [
        { title: "Upload docs" },
      ],
    },
    {
      title: "Settings",
      icon: Settings2,
      items: [
        { title: "Profile" },
      ],
    },
  ],
}

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
