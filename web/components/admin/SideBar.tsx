"use client"

import {
  Archive,
  BadgeCheck,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clock,
  Home,
  ListChecks,
  Loader2,
  MessageSquare,
  MessageSquareCode,
  Settings,
  Shield,
  ShieldCheck,
  Star,
  Users,
  Workflow,
  XCircle,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Logo from "@/public/favicon.png"

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Category",
    url: "/admin/category",
    icon: ListChecks,
  },
  {
    title: "Reports",
    icon: ShieldCheck,
    items: [
      {
        title: "Pending",
        url: "/admin/reports/pending",
        icon: Clock,
      },
      {
        title: "Verified",
        url: "/admin/reports/verified",
        icon: BadgeCheck,
      },
      {
        title: "InProgress",
        url: "/admin/reports/progress",
        icon: Workflow,
      },
      {
        title: "Resolved",
        url: "/admin/reports/resolved",
        icon: CheckCircle,
      },
      {
        title: "Rejected",
        url: "/admin/reports/rejected",
        icon: XCircle,
      },
    ],
  },
  {
    title: "Feedback",
    url: "/admin/feedback",
    icon: MessageSquare,
  },
]

const otherMenuItems = [
  {
    title: "Roles & Permissions",
    url: "/admin/roles-permissions",
    icon: Shield,
  },
  {
    title: "Communications",
    url: "/admin/communications",
    icon: MessageSquareCode,
    size: 22,
    badge: "12",
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },

  {
    title: "Backup & Restore",
    url: "/admin/backup",
    icon: Archive,
  },
  {
    title: "Activity Logs",
    url: "/admin/activity-logs",
    icon: BookOpen,
  },
]

export default function AppSidebar() {
  const pathname = usePathname()

  const isActive = (url: string) => {
    if (url === "/admin") return pathname === url
    return pathname.startsWith(url)
  }

  return (
    <Sidebar className="bg-white border-r border-gray-200" collapsible="icon">
      <SidebarHeader className="p-4 bg-white">
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
              Admin Portal
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-semibold text-[15px] font-jakarta">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 space-y-1">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible className="w-full group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          data-active={isActive(item.url)}
                          className="hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-50"
                        >
                          {item.url ? (
                            <Link
                              href={item.url}
                              className="flex items-center flex-1 gap-3"
                            >
                              <item.icon
                                className={`w-6 h-6 shrink-0 ${
                                  isActive(item.url)
                                    ? "text-blue-600"
                                    : "text-gray-600"
                                }`}
                              />
                              <span
                                className={`flex-1 text-[15px] ${
                                  isActive(item.url)
                                    ? "text-blue-600 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                {item.title}
                              </span>
                            </Link>
                          ) : (
                            <>
                              <item.icon
                                className={`shrink-0 w-7 h-7 ${
                                  isActive(item.url)
                                    ? "text-blue-600"
                                    : "text-gray-600"
                                }`}
                              />
                              <span
                                className={`flex-1 text-[15px] ${
                                  isActive(item.url)
                                    ? "text-blue-600 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                {item.title}
                              </span>
                            </>
                          )}
                          <ChevronDown
                            className={`ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 ${
                              isActive(item.url)
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                data-active={isActive(subItem.url)}
                                className="hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-50"
                              >
                                <Link
                                  href={subItem.url}
                                  className="flex items-center gap-3"
                                >
                                  <subItem.icon
                                    className={`w-5 h-5 shrink-0 ${
                                      isActive(subItem.url)
                                        ? "text-blue-600"
                                        : "text-gray-600"
                                    }`}
                                  />
                                  <span
                                    className={`flex-1 text-[14px] ${
                                      isActive(subItem.url)
                                        ? "text-blue-600 font-medium"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      data-active={isActive(item.url)}
                      className="hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-50"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={`shrink-0 w-7 h-7 ${
                            isActive(item.url)
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`flex-1 text-[15px] ${
                            isActive(item.url)
                              ? "text-blue-600 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel className="text-gray-700 h-6 my-4 pl-3 pt-3 font-jakarta text-[15px]">
            Other Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {otherMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    data-active={isActive(item.url)}
                    className="hover:bg-blue-50 hover:text-blue-700 data-[active=true]:bg-blue-50"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon
                        className={`shrink-0 w-7 h-7 ${
                          isActive(item.url) ? "text-blue-600" : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`flex-1 text-[15px] ${
                          isActive(item.url)
                            ? "text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
