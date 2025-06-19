import type { Metadata } from "next"
import "./globals.css"
import Provider from "./Provider"

export const metadata: Metadata = {
  title: "ZenaNet",
  description: "Make ethiopia better for good!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
