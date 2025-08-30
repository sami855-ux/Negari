"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/official/SideBar"
import { Header } from "@/components/official/Header"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { getMe } from "@/services/auth"
import { setUser } from "@/store/slices/userSlice"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    const checkUserAuth = async () => {
      const user = await getMe()
      if (!user) {
        router.push("/login")
        return
      }

      dispatch(setUser(user))
    }
    checkUserAuth()
  }, [dispatch, router])

  return (
    <>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-green-50">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  )
}
