"use client"

import { useForm } from "react-hook-form"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2, Save, Send } from "lucide-react"

type NotificationSettingsFormValues = {
  enableEmailNotifications: boolean
  enableSmsNotifications: boolean
  enablePushNotifications: boolean
  notificationTemplate: string
}

export function NotificationSettings() {
  const { register, handleSubmit, watch, setValue } =
    useForm<NotificationSettingsFormValues>({
      defaultValues: {
        enableEmailNotifications: true,
        enableSmsNotifications: false,
        enablePushNotifications: true,
        notificationTemplate:
          "Hello {userName},\n\nYour order {orderId} has been shipped!",
      },
    })

  const [isSendingTest, setIsSendingTest] = useState(false)

  const onSubmit = (data: NotificationSettingsFormValues) => {
    console.log("Notification Settings Saved:", data)
    alert("Notification settings saved!")
  }

  const handleSendTestNotification = () => {
    setIsSendingTest(true)
    console.log("Sending test notification...")
    // Simulate API call
    setTimeout(() => {
      setIsSendingTest(false)
      alert("Test notification sent successfully!")
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure how users receive notifications from your platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enableEmailNotifications">
              Enable Email Notifications
            </Label>
            <Switch
              id="enableEmailNotifications"
              checked={watch("enableEmailNotifications")}
              onCheckedChange={(checked) =>
                setValue("enableEmailNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enableSmsNotifications">
              Enable SMS Notifications
            </Label>
            <Switch
              id="enableSmsNotifications"
              checked={watch("enableSmsNotifications")}
              onCheckedChange={(checked) =>
                setValue("enableSmsNotifications", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enablePushNotifications">
              Enable Push Notifications
            </Label>
            <Switch
              id="enablePushNotifications"
              checked={watch("enablePushNotifications")}
              onCheckedChange={(checked) =>
                setValue("enablePushNotifications", checked)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationTemplate">
              Notification Template Editor
            </Label>
            <Textarea
              id="notificationTemplate"
              rows={6}
              placeholder="Enter your notification template here..."
              {...register("notificationTemplate")}
            />
            <p className="text-sm text-gray-500">
              Use placeholders like {"{userName}"}, {"{orderId}"} etc.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="text-white bg-slate-800 hover:bg-slate-900"
            >
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
            <Button
              onClick={handleSendTestNotification}
              disabled={isSendingTest}
              type="button"
              variant="outline"
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Send Test Notification
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
