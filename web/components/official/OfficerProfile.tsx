// components/editable-officer-profile.tsx
"use client"

import { useState, useRef, ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Mail,
  User,
  Calendar,
  Shield,
  ShieldCheck,
  MessageSquare,
  Globe,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit,
  Save,
  X,
  Camera,
} from "lucide-react"

interface OfficerProfileProps {
  username: string
  email?: string
  role: "OFFICER" | "ADMIN"
  createdAt: string
  profilePicture?: string
  telegramId?: string
  googleId?: string
  onSave: (data: any) => Promise<void> | void
}

export function EditableOfficerProfile({
  username: initialUsername,
  email: initialEmail,
  role: initialRole,
  createdAt,
  profilePicture: initialProfilePicture,
  telegramId,
  googleId,
  onSave,
}: OfficerProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profilePicture, setProfilePicture] = useState(initialProfilePicture)
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  )
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      username: initialUsername,
      email: initialEmail || "",
    },
  })

  const joinDate = new Date(createdAt).toLocaleDateString()

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePictureFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePicture(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const onSubmit = async (data: any) => {
    setIsSaving(true)
    try {
      await onSave({
        ...data,
        profilePictureFile,
      })
      setIsEditing(false)
      setProfilePictureFile(null) // Reset after successful save
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    reset()
    setProfilePicture(initialProfilePicture)
    setProfilePictureFile(null)
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-green-100 shadow-lg">
          <CardHeader className="p-6 rounded-t-lg bg-green-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-green-200">
                    <AvatarImage src={profilePicture} />
                    <AvatarFallback className="text-3xl text-green-800 bg-green-100">
                      {initialUsername.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="absolute bottom-0 right-0 p-2 text-white transition-colors bg-green-600 rounded-full hover:bg-green-700"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor="username"
                          className="text-sm font-medium text-green-800"
                        >
                          Username*
                        </Label>
                        <Input
                          id="username"
                          className="w-full mt-1"
                          {...register("username", { required: true })}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-green-800"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="w-full mt-1"
                          {...register("email")}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="flex items-center text-3xl font-bold text-green-900">
                        {initialUsername}
                        <Badge
                          variant={
                            initialRole === "ADMIN" ? "default" : "secondary"
                          }
                          className="ml-3 text-sm text-green-800 bg-green-100 hover:bg-green-100"
                        >
                          {initialRole === "ADMIN" ? (
                            <ShieldCheck className="w-4 h-4 mr-1" />
                          ) : (
                            <Shield className="w-4 h-4 mr-1" />
                          )}
                          {initialRole}
                        </Badge>
                      </CardTitle>

                      <CardDescription className="flex items-center mt-2 text-green-700">
                        <Calendar className="w-4 h-4 mr-1" />
                        Member since {joinDate}
                      </CardDescription>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSaving || (!isDirty && !profilePictureFile)}
                  >
                    {isSaving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="grid gap-8 p-6 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center mb-3 text-lg font-semibold text-green-800">
                  <User className="w-5 h-5 mr-2" />
                  Contact Information
                </h3>

                <div className="space-y-3 pl-7">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">
                      {initialEmail || (
                        <span className="text-gray-400">Not Provided</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">
                      Telegram:{" "}
                      {telegramId ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-400">
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Connected
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm">
                      Google:{" "}
                      {googleId ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-400">
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Connected
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center mb-3 text-lg font-semibold text-green-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                Responsibilities
              </h3>

              <div className="p-4 border border-green-100 rounded-lg bg-green-50">
                <p className="text-sm text-green-800">
                  {initialRole === "ADMIN" ? (
                    <>
                      Responsible for overseeing all community operations,
                      managing officers, and resolving escalated reports across
                      all jurisdictions.
                    </>
                  ) : (
                    <>
                      Responsible for reviewing, assigning, and resolving
                      community reports in their assigned jurisdiction.
                    </>
                  )}
                </p>
              </div>

              {initialRole === "ADMIN" && (
                <div className="p-4 mt-4 border border-yellow-100 rounded-lg bg-yellow-50">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">
                      Administrator Privileges:
                    </span>{" "}
                    This officer has full access to all system functions and
                    data.
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t border-green-100 rounded-b-lg bg-green-50">
            <p className="text-xs text-green-600">
              Last active: {new Date().toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
