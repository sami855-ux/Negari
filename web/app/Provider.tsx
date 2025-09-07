"use client"

import { NotificationProvider } from "@/components/official/NotificationProiveder"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from "react-hot-toast"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Provider } from "react-redux"
import { store } from "@/store"
import { ChatProvider } from "@/components/ChatProvider"
import { ReactNode } from "react"

// Provider
interface ProviderProps {
  children: ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Avoid unnecessary refetching
      staleTime: 1000 * 60 * 3, // Considered fresh for 3 mins
      refetchOnReconnect: true, // Refetch if connection is lost and restored
      refetchInterval: false, // Or set to ms to auto-refetch (e.g. 30000 for every 30s)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
  },
})

const ProviderState: React.FC<ProviderProps> = ({ children }) => {
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <Provider store={store}>
            <NotificationProvider>
              <ChatProvider>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: "#000", // Black background
                      color: "#fff", // White text
                      borderRadius: "8px",
                      fontSize: "15px",
                    },
                    success: {
                      iconTheme: {
                        primary: "#4ade80", // Green icon for success
                        secondary: "#000", // Match background
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: "#f87171", // Red icon for errors
                        secondary: "#000",
                      },
                    },
                  }}
                />
                {children}
              </ChatProvider>
            </NotificationProvider>
          </Provider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </>
  )
}

export default ProviderState
