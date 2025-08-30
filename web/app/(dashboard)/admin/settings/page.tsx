"use client"

import SettingsPageClient from "@/components/admin/SettingTab"
import { Settings, Sliders, CircleCheck } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-6xl mx-auto">
        <div className="p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 text-blue-600 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800">
                Settings
                <CircleCheck
                  className="w-5 h-5 text-gray-400"
                  strokeWidth={1.75}
                  color="green"
                />
              </h1>
              <p className="max-w-3xl mt-2 text-gray-600">
                Manage and configure all aspects of your platform, from general
                settings to advanced AI integrations and system monitoring.
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Sliders className="w-4 h-4" strokeWidth={1.75} />
                <span>Adjust settings to match your preferences</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
          <SettingsPageClient />
        </div>
      </div>
    </div>
  )
}
