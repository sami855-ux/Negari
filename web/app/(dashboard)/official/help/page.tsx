"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  ChevronRight,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageSquare,
  ScrollText,
  Search,
  Shield,
  Star,
  User,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function HelpGuidePage() {
  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Trigger */}
      <div className="p-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[300px] border-r bg-white dark:bg-gray-800 p-4 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
            <LifeBuoy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Help & Guide Center
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find answers to common questions and learn how to use the reporting
            system effectively.
          </p>

          <div className="mt-6">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <Input
                placeholder="Search help articles..."
                className="pl-9 w-full md:w-[400px]"
              />
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Getting Started Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      How to view and manage assigned reports
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                      <p>
                        <strong>1. Access your dashboard</strong> - Upon logging
                        in, you'll see your assigned reports in the main table.
                      </p>
                      <p>
                        <strong>2. Filter reports</strong> - Use the status
                        filters to view reports by their current state (Pending,
                        In Progress, etc.).
                      </p>
                      <p>
                        <strong>3. View details</strong> - Click on any report
                        to see full details including description, location, and
                        reporter information.
                      </p>
                      <p>
                        <strong>4. Take action</strong> - From the detail view,
                        you can update status, add notes, or assign to other
                        officials.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      How to update report status
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        To update a report's status:
                      </p>
                      <ol className="pl-5 space-y-2 text-gray-700 list-decimal dark:text-gray-300">
                        <li>
                          Open the report details by clicking on the report
                          title
                        </li>
                        <li>Click the status dropdown in the action bar</li>
                        <li>Select the appropriate new status</li>
                        <li>Add any required notes about the status change</li>
                        <li>Click "Confirm" to save changes</li>
                      </ol>
                      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Note:</strong> Some status changes may require
                          approval from supervisors depending on your access
                          level.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Communication Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                Communication Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-3">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Communicating with reporters
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Tabs defaultValue="anonymous" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="anonymous">Anonymous</TabsTrigger>
                        <TabsTrigger value="public">Public</TabsTrigger>
                      </TabsList>
                      <TabsContent value="anonymous">
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                          <p>
                            <strong>System-generated messages:</strong> Use the
                            built-in template responses for common scenarios.
                          </p>
                          <p>
                            <strong>Personalized messages:</strong> You can send
                            custom messages that will be forwarded without
                            revealing your identity.
                          </p>
                          <p>
                            <strong>Best practices:</strong>
                          </p>
                          <ul className="pl-5 space-y-1 list-disc">
                            <li>Always maintain professional tone</li>
                            <li>Avoid sharing personal opinions</li>
                            <li>Stick to facts about the report status</li>
                            <li>Don't make promises you can't keep</li>
                          </ul>
                        </div>
                      </TabsContent>
                      <TabsContent value="public">
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                          <p>
                            <strong>Public comments:</strong> These will be
                            visible to the reporter and other officials.
                          </p>
                          <p>
                            <strong>When to use:</strong>
                          </p>
                          <ul className="pl-5 space-y-1 list-disc">
                            <li>
                              When providing general updates that don't require
                              anonymity
                            </li>
                            <li>
                              When multiple officials need to coordinate on a
                              response
                            </li>
                            <li>For documenting official actions taken</li>
                          </ul>
                          <div className="p-3 mt-3 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-800">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              <strong>Warning:</strong> Public comments cannot
                              be deleted, only edited within 15 minutes of
                              posting.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Status Definitions Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Report Status Definitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Next Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Pending</TableCell>
                    <TableCell>
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    </TableCell>
                    <TableCell>Report received but not yet reviewed</TableCell>
                    <TableCell>Verify details, assign priority</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Verified</TableCell>
                    <TableCell>
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    </TableCell>
                    <TableCell>
                      Report confirmed as valid and actionable
                    </TableCell>
                    <TableCell>Assign to appropriate official</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">In Progress</TableCell>
                    <TableCell>
                      <Clock className="w-4 h-4 text-blue-500" />
                    </TableCell>
                    <TableCell>Work has begun to resolve the issue</TableCell>
                    <TableCell>Provide updates, estimate resolution</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Resolved</TableCell>
                    <TableCell>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </TableCell>
                    <TableCell>Issue has been successfully addressed</TableCell>
                    <TableCell>Confirm with reporter, close report</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Rejected</TableCell>
                    <TableCell>
                      <XCircle className="w-4 h-4 text-red-500" />
                    </TableCell>
                    <TableCell>Report deemed invalid or out of scope</TableCell>
                    <TableCell>Provide explanation to reporter</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Priority Guidelines Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                Priority Scoring Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h3 className="font-semibold">High Priority</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                    <li>• Immediate danger to people or property</li>
                    <li>• Critical infrastructure failure</li>
                    <li>• Time-sensitive public safety issues</li>
                    <li>• Response expected within 24 hours</li>
                  </ul>
                </div>
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="font-semibold">Medium Priority</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                    <li>• Significant inconvenience or hazard</li>
                    <li>• Non-critical infrastructure issues</li>
                    <li>• Environmental concerns</li>
                    <li>• Response expected within 3-5 days</li>
                  </ul>
                </div>
                <div className="p-4 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold">Low Priority</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                    <li>• Minor maintenance issues</li>
                    <li>• Cosmetic or non-urgent repairs</li>
                    <li>• General inquiries</li>
                    <li>• Response expected within 7-10 days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function SidebarContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-2">
        <LifeBuoy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold">Help Center</h2>
      </div>

      <div className="space-y-1">
        <Button variant="ghost" className="justify-start w-full">
          <BookOpen className="w-4 h-4 mr-2" />
          Getting Started
        </Button>
        <Button variant="ghost" className="justify-start w-full">
          <MessageSquare className="w-4 h-4 mr-2" />
          Communication
        </Button>
        <Button variant="ghost" className="justify-start w-full">
          <ScrollText className="w-4 h-4 mr-2" />
          Status Definitions
        </Button>
        <Button variant="ghost" className="justify-start w-full">
          <Star className="w-4 h-4 mr-2" />
          Priority Guidelines
        </Button>
        <Button variant="ghost" className="justify-start w-full">
          <Users className="w-4 h-4 mr-2" />
          Team Management
        </Button>
        <Button variant="ghost" className="justify-start w-full">
          <Shield className="w-4 h-4 mr-2" />
          Ethical Guidelines
        </Button>
      </div>

      <div className="pt-4 border-t">
        <h3 className="px-2 mb-2 text-sm font-semibold">Need more help?</h3>
        <Button variant="outline" className="justify-start w-full">
          <Mail className="w-4 h-4 mr-2" />
          Contact Support
        </Button>
        <Button variant="outline" className="justify-start w-full mt-2">
          <User className="w-4 h-4 mr-2" />
          Request Training
        </Button>
      </div>
    </div>
  )
}
