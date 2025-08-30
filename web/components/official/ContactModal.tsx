"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileUploader } from "@/components/ui/FileUploader"
import {
  Mail,
  User,
  AlertTriangle,
  MessageSquare,
  Paperclip,
  Send,
  HardHat,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

type FormValues = {
  subject: string
  message: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  attachments: File[]
}

type ContactModalProps = {
  reportId: string
  reporterName: string
  workerName?: string
  trigger?: React.ReactNode
}

export const ContactModal = ({
  reportId,
  reporterName,
  workerName,
  trigger,
}: ContactModalProps) => {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("reporter")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const form = useForm<FormValues>({
    defaultValues: {
      subject: "",
      message: "",
      priority: "MEDIUM",
      attachments: [],
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const recipientType = activeTab === "reporter" ? "Reporter" : "Worker"
      const recipientName =
        activeTab === "reporter" ? reporterName : workerName || ""

      setSuccessMessage(
        `Your message to ${recipientName} (${recipientType}) has been sent successfully.`
      )

      form.reset()
      setTimeout(() => {
        setOpen(false)
        setSuccessMessage("")
      }, 2000)
    } catch (error) {
      setErrorMessage("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const validateSubject = (value: string) => {
    if (!value) return "Subject is required"
    if (value.length < 5) return "Subject must be at least 5 characters"
    return true
  }

  const validateMessage = (value: string) => {
    if (!value) return "Message is required"
    if (value.length < 10) return "Message must be at least 10 characters"
    return true
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-500" />
            Send Message
          </DialogTitle>
        </DialogHeader>

        {successMessage && (
          <div className="flex items-center p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reporter">
              <User className="w-4 h-4 mr-2" />
              Contact Reporter
            </TabsTrigger>
            <TabsTrigger
              value="worker"
              disabled={!workerName}
              className={!workerName ? "opacity-50 cursor-not-allowed" : ""}
            >
              <HardHat className="w-4 h-4 mr-2" />
              Contact Worker
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TabsContent value="reporter" className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Contacting: {reporterName} (Reporter)
                  </p>
                </div>
                <input type="hidden" name="reportId" value={reportId} />
                <input type="hidden" name="recipientType" value="reporter" />

                <FormField
                  control={form.control}
                  name="subject"
                  rules={{ validate: validateSubject }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter message subject..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  rules={{ validate: validateMessage }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attachments
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          maxFiles={3}
                          maxSize={4 * 1024 * 1024}
                          accept={{
                            "image/*": [],
                            "application/pdf": [],
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="worker" className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Contacting: {workerName || "No worker assigned"} (Assigned
                    Worker)
                  </p>
                </div>
                <input type="hidden" name="reportId" value={reportId} />
                <input type="hidden" name="recipientType" value="worker" />

                <FormField
                  control={form.control}
                  name="subject"
                  rules={{ validate: validateSubject }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter message subject..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  rules={{ validate: validateMessage }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your message here..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Priority
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attachments
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={field.value}
                          onValueChange={field.onChange}
                          maxFiles={3}
                          maxSize={4 * 1024 * 1024}
                          accept={{
                            "image/*": [],
                            "application/pdf": [],
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Message
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
