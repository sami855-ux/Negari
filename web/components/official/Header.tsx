"use client"

import {
  Bell,
  Search,
  User,
  Menu,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { SignedOut } from "@/services/auth"
import { useDispatch, useSelector } from "react-redux"
import { signOutUser } from "@/store/slices/userSlice"
import { RootState } from "@/store"

export function Header() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const handleSignOut = async () => {
    try {
      const res = await SignedOut()
      if (res.success) {
        router.push("/")
        dispatch(signOutUser())
      }
    } catch (error) {
      console.log("Error form Signout" + error)
    }
  }

  return (
    <header className="sticky top-0 z-[50] flex h-[74px] items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="w-8 h-8 hover:bg-accent hover:text-accent-foreground rounded-md p-1.5 transition-colors">
          <Menu className="w-5 h-5" />
        </SidebarTrigger>
        <div className="items-center hidden gap-2 md:flex">
          <h1 className="text-lg font-semibold tracking-tight">
            Welcome,{" "}
            <span className="font-medium text-green-600 ">
              Officer {user?.user?.username}
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reports, cases..."
            className="w-48 pl-10 md:w-64 focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-accent"
          onClick={() => router.push("/official/notification")}
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          <Badge
            variant="destructive"
            className="absolute flex items-center justify-center w-4 h-4 p-0 text-xs rounded-full -top-1 -right-1"
          >
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full hover:bg-accent"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="/avatars/officer-dawit.jpg"
                  alt="Officer Dawit"
                />
                <AvatarFallback className="bg-green-500 text-primary-foreground">
                  {`${user.user.username}`.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  Officer {user?.user?.username}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/official/profile")}
              >
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/official/help")}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                <span>Help</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
