"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Bell, BrainCircuit, Cpu, Sparkles } from "lucide-react"
import { GeneralSettings } from "./General"
import { NotificationSettings } from "./NotficationSetting"
import { AiIntegrationSettings } from "./AiIntegration"

export default function SettingsPageClient() {
  return (
    <Tabs defaultValue="general" className="w-full max-w-6xl p-4 mx-auto">
      <TabsList className="grid w-full h-auto grid-cols-2 gap-1 p-1 rounded-lg shadow-lg bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 sm:grid-cols-3">
        <TabsTrigger
          value="general"
          className="flex items-center gap-3 py-3 px-4 rounded-md transition-all hover:bg-white/20 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
        >
          <Settings className="w-5 h-5" strokeWidth={1.5} />
          <span className="font-medium ">General</span>
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="flex items-center gap-3 py-3 px-4 rounded-md transition-all hover:bg-white/20 data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm"
        >
          <Bell className="w-5 h-5" strokeWidth={1.5} fill="currentColor" />
          <span className="font-medium">Notifications</span>
        </TabsTrigger>
        <TabsTrigger
          value="ai-integration"
          className="flex items-center gap-3 py-3 px-4 rounded-md transition-all hover:bg-white/20 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-sm"
        >
          <BrainCircuit className="w-5 h-5" strokeWidth={1.5} />
          <span className="font-medium">AI Integration</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="general"
        className="p-6 mt-8 bg-white rounded-lg shadow-md"
      >
        <GeneralSettings />
      </TabsContent>
      <TabsContent
        value="notifications"
        className="p-6 mt-8 bg-white rounded-lg shadow-md"
      >
        <NotificationSettings />
      </TabsContent>
      <TabsContent
        value="ai-integration"
        className="p-6 mt-8 bg-white rounded-lg shadow-md"
      >
        <AiIntegrationSettings />
      </TabsContent>
    </Tabs>
  )
}
