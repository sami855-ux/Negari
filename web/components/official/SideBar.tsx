"use client"

import {
  Archive,
  Bell,
  BookOpen,
  Flag,
  Home,
  Map,
  MessageSquare,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import Logo from "@/public/favicon.png"
import { usePathname } from "next/navigation"

const navigationItems = [
  { title: "Dashboard", url: "/official", icon: Home, size: 26 },
  { title: "My Map Region", url: "/official/map", icon: Map, size: 24 },
  { title: "Reports", url: "/official/archive", icon: Archive, size: 23 },
  {
    title: "Verified Reports",
    url: "/official/verified",
    icon: ShieldCheck,
    size: 23,
    badge: "24",
  },
  {
    title: "Critical Reports",
    url: "/official/alert",
    icon: Bell,
    size: 22,
    badge: "3",
    urgent: true,
  },
  {
    title: "Flagged Reports",
    url: "/official/flagged",
    icon: Flag,
    size: 22,
    badge: "7",
  },
  {
    title: "Communications",
    url: "/official/communications",
    icon: MessageSquare,
    size: 22,
    badge: "12",
  },
  {
    title: "Citizens Feedback",
    url: "/official/feedback",
    icon: Users,
    size: 22,
    badge: "5",
  },
  { title: "Help & Guides", url: "/official/help", icon: BookOpen, size: 25 },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-blue-200 z-[50]" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 pt-2">
          <Image
            src={Logo}
            alt="Negari Logo"
            width={32}
            height={32}
            className="rounded-md shadow-sm"
          />
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-2xl font-bold text-gray-800 font-jakarta">
              Negari
            </h2>
            <p className="text-sm text-[#4B5563] font-jakarta text-semibold">
              Officer Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold text-[15px] font-jakarta">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {navigationItems.slice(0, 5).map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`hover:bg-green-50 hover:text-green-600 ${
                        isActive
                          ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={`shrink-0 w-7 h-7 ${
                            isActive ? "text-green-600" : ""
                          }`}
                        />
                        <span className="flex-1 text-[15px]">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item?.urgent ? "destructive" : "secondary"}
                            className={
                              item?.urgent
                                ? "bg-red-500 font-geist"
                                : "bg-green-100 text-green-700 hover:bg-green-200 font-geist"
                            }
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>

          <SidebarGroupLabel className="text-gray-700 h-6 my-4 pl-3 pt-3 font-jakarta text-[15px]">
            Other Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.slice(6).map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`hover:bg-green-50 hover:text-green-600 rounded-none  ${
                        isActive
                          ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3 py-2"
                      >
                        <item.icon
                          className={`shrink-0 w-7 h-7 ${
                            isActive ? "text-green-600" : ""
                          }`}
                        />
                        <span className="flex-1 text-[15px]">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={item?.urgent ? "destructive" : "secondary"}
                            className={
                              item?.urgent
                                ? "bg-red-500 font-geist"
                                : "bg-green-100 text-green-700 hover:bg-green-200 font-geist"
                            }
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-3 border border-blue-200 rounded-lg bg-gradient-to-r from-green-200 to-green-400">
          <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full">
            <Star className="w-4 h-4 text-slate-200" />
          </div>
          <div className="text-sm group-data-[collapsible=icon]:hidden">
            <p className="font-medium text-gray-700">Officer Rating</p>
            <p className="text-green-700">4.8/5.0</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
