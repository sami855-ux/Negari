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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"
import {
  Save,
  Globe,
  Clock,
  Wrench,
  Image as ImageIcon,
  Languages,
} from "lucide-react"

type GeneralSettingsFormValues = {
  platformName: string
  logoFile: FileList
  defaultLanguage: string
  timezone: string
  maintenanceMode: boolean
}

export function GeneralSettings() {
  const { register, handleSubmit, watch, setValue } =
    useForm<GeneralSettingsFormValues>({
      defaultValues: {
        platformName: "Negari Civic System",
        defaultLanguage: "English",
        timezone: "UTC",
        maintenanceMode: false,
      },
    })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoFile = watch("logoFile")

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setValue("logoFile", event.target.files)
      setLogoPreview(URL.createObjectURL(file))
    } else {
      setLogoPreview(null)
    }
  }

  const onSubmit = (data: GeneralSettingsFormValues) => {
    console.log("General Settings Saved:", data)
    // In a real application, you would send this data to your backend
    alert("General settings saved!")
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 text-blue-600 rounded-lg bg-blue-50">
            <Wrench className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              General Settings
            </CardTitle>
            <CardDescription className="text-gray-500">
              Manage your platform's basic information and global settings
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="platformName"
              className="flex items-center gap-2 text-gray-700"
            >
              <Globe className="w-4 h-4" strokeWidth={1.75} />
              Platform Name
            </Label>
            <Input
              id="platformName"
              {...register("platformName")}
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="logoUpload"
              className="flex items-center gap-2 text-gray-700"
            >
              <ImageIcon className="w-4 h-4" strokeWidth={1.75} />
              Logo Upload
            </Label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center px-4 py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <span className="text-sm text-gray-500">Click to upload</span>
              </label>
              {logoPreview && (
                <div className="relative w-16 h-16 overflow-hidden border border-gray-200 rounded-md">
                  <Image
                    src={logoPreview}
                    alt="Logo Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="defaultLanguage"
              className="flex items-center gap-2 text-gray-700"
            >
              <Languages className="w-4 h-4" strokeWidth={1.75} />
              Default Language
            </Label>
            <Select
              onValueChange={(value) => setValue("defaultLanguage", value)}
              defaultValue={watch("defaultLanguage")}
            >
              <SelectTrigger
                id="defaultLanguage"
                className="focus:ring-2 focus:ring-blue-500"
              >
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Amharic">Amharic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="timezone"
              className="flex items-center gap-2 text-gray-700"
            >
              <Clock className="w-4 h-4" strokeWidth={1.75} />
              Timezone
            </Label>
            <Select
              onValueChange={(value) => setValue("timezone", value)}
              defaultValue={watch("timezone")}
            >
              <SelectTrigger
                id="timezone"
                className="focus:ring-2 focus:ring-blue-500"
              >
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                <SelectItem value="GMT+3">GMT+3 (Addis Ababa)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <Label
              htmlFor="maintenanceMode"
              className="flex items-center gap-2 text-gray-700"
            >
              <Wrench className="w-4 h-4" strokeWidth={1.75} />
              Maintenance Mode
            </Label>
            <Switch
              id="maintenanceMode"
              checked={watch("maintenanceMode")}
              onCheckedChange={(checked) =>
                setValue("maintenanceMode", checked)
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              type="submit"
              className="gap-2 text-white bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <Save className="w-4 h-4" strokeWidth={1.75} />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
