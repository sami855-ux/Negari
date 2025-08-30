import type { Metadata } from "next"
import "./globals.css"
import ProviderState from "./Provider"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"

export const metadata: Metadata = {
  title: "Negari",
  description: "Make Ethiopia better for good!",
  icons: {
    icon: "/favicon.png",
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
