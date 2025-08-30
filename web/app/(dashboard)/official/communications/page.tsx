"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Inbox,
  Send,
  Mail,
  CheckCircle,
  MessageSquare,
  Search,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  RefreshCw,
  Archive,
} from "lucide-react"

type TabType = "inbox" | "sent" | "unread" | "resolved" | "all"

const tabItems = [
  { id: "inbox" as TabType, title: "Inbox", icon: Inbox, count: 12 },
  { id: "sent" as TabType, title: "Sent", icon: Send, count: 8 },
  { id: "unread" as TabType, title: "Unread", icon: Mail, count: 5 },
  {
    id: "resolved" as TabType,
    title: "Resolved",
    icon: CheckCircle,
    count: 23,
  },
  {
    id: "all" as TabType,
    title: "All Messages",
    icon: MessageSquare,
    count: 156,
  },
]

const allConversations = [
  {
    id: 1,
    name: "John Doe",
    role: "Citizen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for your report...",
    time: "Today",
    unread: true,
    reportId: "#RPT-2023-00123",
    status: "active",
    type: "received" as const,
  },
  {
    id: 2,
    name: "Jane User",
    role: "Business Owner",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can you update the status?",
    time: "Yesterday",
    unread: true,
    reportId: "#RPT-2023-00124",
    status: "pending",
    type: "received" as const,
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Citizen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The issue has been resolved",
    time: "2 days ago",
    unread: false,
    reportId: "#RPT-2023-00125",
    status: "resolved",
    type: "received" as const,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    role: "Citizen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Message sent successfully",
    time: "3 days ago",
    unread: false,
    reportId: "#RPT-2023-00126",
    status: "sent",
    type: "sent" as const,
  },
  {
    id: 5,
    name: "Tom Brown",
    role: "Business Owner",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thank you for the quick response",
    time: "1 week ago",
    unread: false,
    reportId: "#RPT-2023-00127",
    status: "resolved",
    type: "received" as const,
  },
  {
    id: 6,
    name: "Lisa Davis",
    role: "Citizen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Report submitted successfully",
    time: "2 weeks ago",
    unread: false,
    reportId: "#RPT-2023-00128",
    status: "sent",
    type: "sent" as const,
  },
]

const messages = [
  {
    id: 1,
    sender: "John Doe",
    content: "✅ Your report has been reviewed",
    time: "10:30 AM",
    type: "received",
    status: "success",
  },
  {
    id: 2,
    sender: "You",
    content: "❗ Could you provide more detail about the location?",
    time: "10:35 AM",
    type: "sent",
  },
  {
    id: 3,
    sender: "John Doe",
    content: "Sure, here is the attachment with more details",
    time: "10:40 AM",
    type: "received",
    attachment: "🖼️ Attachment.jpg",
  },
]

export default function CommunicationPanel() {
  const [activeTab, setActiveTab] = useState<TabType>("inbox")
  const [selectedConversation, setSelectedConversation] = useState(
    allConversations[0]
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")

  // Filter conversations based on active tab
  const getFilteredConversations = (tabId: TabType) => {
    let filtered = allConversations

    switch (tabId) {
      case "inbox":
        filtered = allConversations.filter(
          (conv) => conv.type === "received" && conv.status !== "resolved"
        )
        break
      case "sent":
        filtered = allConversations.filter((conv) => conv.type === "sent")
        break
      case "unread":
        filtered = allConversations.filter((conv) => conv.unread)
        break
      case "resolved":
        filtered = allConversations.filter((conv) => conv.status === "resolved")
        break
      case "all":
        filtered = allConversations
        break
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (conv) =>
          conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.reportId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput)
      setMessageInput("")
    }
  }

  const ConversationList = ({
    conversations,
  }: {
    conversations: typeof allConversations
  }) => (
    <div className="w-96 border-r bg-muted/30">
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg capitalize">
            {activeTab.replace("-", " ")}
          </h3>
          <Badge variant="outline">{conversations.length}</Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-3">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No conversations found</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`mb-3 cursor-pointer transition-all duration-200 hover:shadow-md  ${
                  selectedConversation.id === conversation.id
                    ? "bg-primary/10 border-gray-300 shadow-sm"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={conversation.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-primary/10">
                          {conversation.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.unread && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-base truncate">
                          {conversation.name}
                        </h4>
                        <span className="text-xs  whitespace-nowrap font-semibold text-blue-800">
                          {conversation.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {conversation.role}
                        </Badge>
                        {conversation.status === "resolved" && (
                          <Badge
                            variant="default"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            Resolved
                          </Badge>
                        )}
                        {conversation.status === "pending" && (
                          <Badge
                            variant="default"
                            className="text-xs bg-yellow-100 text-yellow-800"
                          >
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        "{conversation.lastMessage}"
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {conversation.reportId}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="h-screen p-5">
      {/* Header */}

      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl text-slate-900 dark:text-slate-100">
                <Archive className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                Communication Panel
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                View and manage archived community reports across all statuses
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="border-b bg-background p-4 mt-4">
        <h1 className="text-2xl font-bold text-primary mb-4"></h1>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="w-full "
        >
          <TabsList className="grid w-full grid-cols-5 bg-muted/50 mb-4">
            {tabItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.title}</span>
                {item.count > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 text-xs">
                    {item.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {tabItems.map((item) => (
            <TabsContent key={item.id} value={item.id} className="mt-0">
              <div className="flex h-[calc(100vh-140px)]">
                {/* Conversation List */}
                <ConversationList
                  conversations={getFilteredConversations(item.id)}
                />

                {/* Chat Panel */}
                <div className="flex-1 flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              selectedConversation.avatar || "/placeholder.svg"
                            }
                          />
                          <AvatarFallback className="bg-primary/10">
                            {selectedConversation.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg">
                            {selectedConversation.name} (
                            {selectedConversation.role})
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground font-mono">
                              Report ID: {selectedConversation.reportId}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-6 bg-muted/20 ">
                    <div className="space-y-6 max-w-4xl">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.type === "sent"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                              message.type === "sent"
                                ? "bg-primary text-primary-foreground"
                                : "bg-background border"
                            }`}
                          >
                            {message.status === "success" && (
                              <div className="flex items-center gap-2 mb-3 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  Status Update
                                </span>
                              </div>
                            )}
                            <p className="text-sm leading-relaxed">
                              {message.content}
                            </p>
                            {message.attachment && (
                              <div className="mt-3 p-3 bg-muted/50 rounded-lg flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                <span className="text-sm">
                                  {message.attachment}
                                </span>
                              </div>
                            )}
                            <span className="text-xs opacity-70 mt-2 block">
                              {message.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-background">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Type your message here..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          className="min-h-[60px] resize-none border-2 focus:border-primary"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                          title="Attach file"
                        >
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          disabled={!messageInput.trim()}
                          onClick={handleSendMessage}
                          className="h-10 w-10"
                          title="Send message"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
