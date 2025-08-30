"use client"

import { ManualBackupCard } from "@/components/admin/ManualBackupCard"
import { AutomaticBackupSettings } from "@/components/admin/AuthomaticBackup"
import { BackupHistoryTable } from "@/components/admin/BackupHistoryTable"
import { UploadRestoreCard } from "@/components/admin/UploadRestoreCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatabaseBackup, CloudUpload, History, Settings } from "lucide-react"

export default function BackupPage() {
  return (
    <div className="container mx-auto  px-1 md:px-2 lg:px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-3 h-32 rounded-md">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Backup & Restore
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage system backups and restore points
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <DatabaseBackup className="h-4 w-4" />
          System Status
        </Button>
      </div>

      <Card className="bg-white dark:from-gray-900/50 dark:to-gray-800 ">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-2">
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
            >
              <Settings className="h-4 w-4" />
              Backup Settings
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
            >
              <CloudUpload className="h-4 w-4" />
              Upload & Restore
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
            >
              <History className="h-4 w-4" />
              Backup History
            </TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="settings" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ManualBackupCard />
                <AutomaticBackupSettings />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-0">
              <UploadRestoreCard />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <BackupHistoryTable />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
