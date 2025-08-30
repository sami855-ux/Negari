import type { Metadata } from "next"
import "./globals.css"
import ProviderState from "./Provider"

export const metadata: Metadata = {
  title: "Negari",
  description: "Make Ethiopia better for good!",
  icons: {
    icon: "/favicon.png", // ✅ CORRECT path
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ProviderState>{children}</ProviderState>
      </body>
    </html>
  )
}
