"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Role, type User } from "@/lib/types"
import { Loader2, Ban } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { updateUser } from "@/services/getUsers"
import toast from "react-hot-toast"

interface EditUserSheetProps {
  user: User | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated: () => void // Callback to refresh data
}

export function EditUserSheet({
  user,
  isOpen,
  onOpenChange,
  onUserUpdated,
}: EditUserSheetProps) {
  console.log(onUserUpdated)
  const [loading, setLoading] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState<Role>(
    user?.role || Role.CITIZEN
  )
  const [isBanned, setIsBanned] = React.useState(user?.isBanned || false)

  // Update selectedRole and isBanned when the user prop changes
  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role)
      setIsBanned(user.isBanned || false)
    }
  }, [user])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user) return

    const data = {
      role: selectedRole,
    }

    setLoading(true)
    try {
      const response = await updateUser(user.id, data)

      if (response.success) {
        toast.success("User updated successfully!")
        // onUserUpdated()
        onOpenChange(false)
      } else {
        toast.error("Failed to update user.")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("An error occurred while updating the user.")
    } finally {
      setLoading(false)
    }
  }

  const initials = user
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : ""

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-6">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-text-primary">Edit User</SheetTitle>
          <SheetDescription className="text-text-secondary">
            Make changes to the user&apos;s profile and role here. Click save
            when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        {user ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-grow gap-6"
          >
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border border-border-line">
                <AvatarImage
                  src={user.profilePicture || undefined}
                  alt={`${user.username}'s profile`}
                />
                <AvatarFallback className="text-white bg-primary-accent">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-text-primary">
                  {user.username}
                </h3>
                <p className="text-sm text-text-secondary">
                  {user.email || "None"}
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username" className="text-text-secondary">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                defaultValue={user.username}
                readOnly
                disabled
                className="bg-muted/50 border-border-line text-text-primary"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-text-secondary">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                defaultValue={user.email || "None"}
                readOnly
                disabled
                className="bg-muted/50 border-border-line text-text-primary"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role" className="text-text-secondary">
                Role
              </Label>
              <Select
                value={selectedRole}
                onValueChange={(value: Role) => setSelectedRole(value)}
                disabled={loading}
              >
                <SelectTrigger className="w-full border-border-line text-text-primary">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-card-background border-border-line">
                  {Object.values(Role).map((role) => (
                    <SelectItem
                      key={role}
                      value={role}
                      className="border-gray-200 text-text-primary"
                    >
                      {role.charAt(0).toUpperCase() +
                        role.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50 border-border-line">
              <div className="flex items-center gap-3">
                <Ban className="w-5 h-5 text-destructive" />
                <div>
                  <Label htmlFor="ban-user" className="text-text-primary">
                    Ban User
                  </Label>
                  <p className="text-sm text-text-secondary">
                    {isBanned
                      ? "User is currently banned"
                      : "User is not banned"}
                  </p>
                </div>
              </div>
              <Switch
                id="ban-user"
                checked={isBanned}
                onCheckedChange={setIsBanned}
                className="data-[state=checked]:bg-destructive"
              />
            </div>

            <SheetFooter className="pt-6 mt-auto border-t border-border-line">
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-primary-accent hover:bg-primary-accent/90"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </SheetFooter>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow text-text-secondary">
            <p>No user selected for editing.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
