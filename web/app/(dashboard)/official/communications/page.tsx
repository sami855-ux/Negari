"use client"

import React, { useState, useEffect, useRef } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Inbox,
  Send,
  Mail,
  Search,
  Paperclip,
  MoreVertical,
  RefreshCw,
  Archive,
  MessageSquare,
  Copy,
  Trash,
  X,
  Loader2,
  UserPlus,
} from "lucide-react"
import { useChat, User } from "@/components/ChatProvider"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { searchUsersAPI } from "@/services/getUsers"

type TabType = "inbox" | "sent" | "unread"

const tabItems = [
  { id: "inbox" as TabType, title: "Inbox", icon: Inbox },
  { id: "sent" as TabType, title: "Sent", icon: Send },
  { id: "unread" as TabType, title: "Unread", icon: Mail },
]

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  )

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diffInHours < 48) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }
}

const debounce = (func, delay: number) => {
  let timer: NodeJS.Timeout
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), delay)
  }
}

export default function CommunicationPanel() {
  const { user } = useSelector((store: RootState) => store.user)
  const currentUserId = user?.user?.id

  const [activeTab, setActiveTab] = useState<TabType>("inbox")
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [imageInput, setImageInput] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [openModal, setOpenModal] = useState(false)
  const [searchQueryModal, setSearchQueryModal] = useState("")
  const [searchedUsers, setSearchedUsers] = useState<User[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [selectedUserSearch, setSelectedUserSearch] = useState<User | null>(
    null
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageInput(e.target.files[0])
    }
  }

  const handleUserSelect = (user: User) => {
    setSelectedUserSearch(user)
  }

  const handleRemoveImage = () => setImageInput(null)

  const {
    messagedUsers,
    setMessagedUsers,
    messages,
    onlineUsers,
    loadingSend,
    loadingFetch,
    sendMessage,
    fetchMessages,
    fetchMessagedUsers,
    deleteMessage,
  } = useChat()

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchedUsers([])
      return
    }

    try {
      setLoadingSearch(true)
      const res = await searchUsersAPI(query)
      setSearchedUsers(res)
    } catch (err) {
      console.error("Failed to search users:", err)
      setSearchedUsers([])
    } finally {
      setLoadingSearch(false)
    }
  }

  // Debounced version
  const debouncedSearch = debounce(searchUsers, 300)

  // Trigger search whenever input changes
  useEffect(() => {
    debouncedSearch(searchQueryModal)
  }, [searchQueryModal])

  // Fetch messaged users on component mount
  useEffect(() => {
    fetchMessagedUsers()
  }, [])

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId)
    }
  }, [selectedConversationId])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const onDeleteMessage = (id: string) => {
    deleteMessage(id)
  }

  // Filter conversations based on active tab
  const getFilteredConversations = () => {
    let filtered = messagedUsers

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedConversationId) {
      try {
        // Find the other participant in the conversation
        const conversation = getFilteredConversations().find(
          (user) => user.id === selectedConversationId
        )

        if (conversation) {
          await sendMessage({
            conversationId: selectedConversationId,
            receiverId: conversation.id,
            textMessage: messageInput,
            file: imageInput,
          })
          setMessageInput("")
        }
      } catch (error) {
        console.error("Failed to send message:", error)
      }
    }
  }

  const ConversationList = ({ conversations }: { conversations: User[] }) => (
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
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No conversations found</p>
            </div>
          ) : (
            conversations.map((user) => (
              <Card
                key={user.id}
                className={`mb-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedConversationId === user.id
                    ? "bg-primary/10 border-gray-300 shadow-sm"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setSelectedConversationId(user.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user.profilePicture || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-primary/10">
                          {user.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {onlineUsers.includes(user.id) && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-base truncate">
                          {user.username}
                        </h4>
                        {user.lastSeen && (
                          <span className="text-xs whitespace-nowrap text-muted-foreground">
                            {formatDate(user.lastSeen)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {user.role || "User"}
                        </Badge>
                        {user.isOnline && (
                          <Badge
                            variant="default"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            Online
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
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

  const selectedUser = messagedUsers.find(
    (user) => user.id === selectedConversationId
  )
  const conversationMessages = selectedConversationId
    ? messages[selectedConversationId] || []
    : []

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
                View and manage your conversations
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={fetchMessagedUsers}
                disabled={loadingFetch}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="border-b bg-background p-4 mt-4">
        <div className="relative w-full max-w-md my-2">
          <Input
            value={"Search a person to chat..."}
            readOnly
            className="cursor-pointer text-gray-800 py-5 font-medium border-gray-300 border-2 bg-slate-100 rounded-xl"
            onClick={() => setOpenModal(true)}
          />
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Users
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Type a username or email..."
                value={searchQueryModal}
                onChange={(e) => setSearchQueryModal(e.target.value)}
                className="w-full"
              />

              {/* Search results */}
              <div className="border rounded-md">
                <ScrollArea className="h-60">
                  {loadingSearch ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : searchedUsers.length > 0 ? (
                    <div className="p-2 space-y-2">
                      {searchedUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                            selectedUser?.id === user.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleUserSelect(user)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback>
                              {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">
                                {user.username}
                              </p>
                              {user.isOnline && (
                                <Badge
                                  variant="outline"
                                  className="h-1 w-1 p-0 rounded-full bg-green-500"
                                />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {user.role || "User"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : searchQueryModal ? (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                      <UserPlus className="h-8 w-8 mb-2 opacity-50" />
                      <p>No users found</p>
                      <p className="text-sm">Try a different search term</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p>Search for users by username or email</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>

            <DialogFooter className="flex flex-row gap-2 sm:justify-between">
              <div className="text-xs text-muted-foreground">
                {searchedUsers.length > 0 &&
                  `${searchedUsers.length} user(s) found`}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>
                {selectedUserSearch && (
                  <Button
                    onClick={() => {
                      setMessagedUsers((prev) => {
                        // Check if the user is already in the array
                        const exists = prev.some(
                          (user) => user.id === selectedUserSearch.id
                        )
                        if (exists) return prev
                        return [...prev, selectedUserSearch]
                      })

                      setSelectedConversationId(selectedUserSearch.id)
                      setOpenModal(false)
                      // messagedUsers = [...messagedUsers, selectedUser]
                      // if (onUserSelect && selectedUser) {
                      //   onUserSelect(selectedUser)
                      // }
                    }}
                  >
                    Select User
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 mb-4">
            {tabItems.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {tabItems.map((item) => (
            <TabsContent key={item.id} value={item.id} className="mt-0">
              <div className="flex h-[calc(100vh-140px)]">
                {/* Conversation List */}
                <ConversationList conversations={getFilteredConversations()} />

                {/* Chat Panel */}
                {selectedConversationId ? (
                  <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b bg-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={
                                selectedUser?.profilePicture ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback className="bg-primary/10">
                              {selectedUser?.username
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-lg">
                              {selectedUser?.username} (
                              {selectedUser?.role || "User"})
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">
                                {selectedUser?.email}
                              </span>
                              {onlineUsers.includes(selectedUser?.id || "") && (
                                <span className="text-xs text-green-600 font-medium">
                                  Online
                                </span>
                              )}
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
                    <ScrollArea className="flex-1 p-6 bg-muted/20">
                      <div className="space-y-6 max-w-4xl">
                        {conversationMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.senderId === currentUserId
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <ContextMenu>
                              <ContextMenuTrigger className="inline-block">
                                <div
                                  className={`max-w-[100%] ml-10 rounded-2xl p-3 shadow-sm cursor-pointer ${
                                    message.senderId === currentUserId
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-background border"
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed">
                                    {message.content}
                                  </p>
                                  {message.attachmentUrl && (
                                    <div className="mt-3 p-1 bg-muted/50 rounded-lg flex items-center gap-2">
                                      <img
                                        src={message.attachmentUrl}
                                        alt="preview"
                                        className="h-36 w-44 object-cover rounded-md"
                                      />
                                    </div>
                                  )}

                                  <span className="text-[10px] opacity-70 mt-2 block text-right">
                                    {formatDate(message.createdAt)}
                                    {message.senderId === currentUserId &&
                                      (message.isRead ? " ✓✓" : " ✓")}
                                  </span>
                                </div>
                              </ContextMenuTrigger>

                              <ContextMenuContent className="w-40">
                                <ContextMenuItem
                                  onClick={() => handleCopy(message.content)}
                                >
                                  <Copy className="w-4 h-4 mr-2" /> Copy
                                </ContextMenuItem>
                                {message.senderId === currentUserId && (
                                  <ContextMenuItem
                                    onClick={() => onDeleteMessage(message.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash className="w-4 h-4 mr-2" /> Delete
                                  </ContextMenuItem>
                                )}
                              </ContextMenuContent>
                            </ContextMenu>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Show preview if image selected */}
                    {imageInput && (
                      <div className="relative flex items-center gap-2 bg-muted px-3 py-1 rounded-lg">
                        <img
                          src={URL.createObjectURL(imageInput)}
                          alt="preview"
                          className="h-12 w-12 object-cover rounded-md"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 absolute -top-2 -right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

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
                            disabled={loadingSend}
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10"
                            title="Attach file"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Paperclip className="h-5 w-5" />
                          </Button>
                          <Button
                            size="icon"
                            disabled={
                              (!messageInput.trim() && !imageInput) ||
                              loadingSend
                            }
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
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-muted/20">
                    <div className="text-center text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
