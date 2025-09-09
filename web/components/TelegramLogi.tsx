import { Send } from "lucide-react"
import { useEffect } from "react"
import { Button } from "./ui/button"

export default function TelegramLoginWidget() {
  useEffect(() => {
  if (typeof window === "undefined") return // ensure this runs only in the browser

  const container = document.getElementById("telegram-login")
  if (!container) return

  container.innerHTML = ""

  const script = document.createElement("script")
  script.src = "https://telegram.org/js/telegram-widget.js?15"
  script.setAttribute("data-telegram-login", "zenanetbot")
  script.setAttribute("data-size", "large")
  script.setAttribute("data-userpic", "false")
  script.setAttribute(
    "data-auth-url",
    `${window.location.origin}/api/telegram`
  )
  script.setAttribute("data-request-access", "write")
  script.async = true

  container.appendChild(script)

  return () => {
    container.innerHTML = ""
  }
}, [])


  return (
    <div id="telegram-login">
      <Button
        variant="outline"
        className="w-full h-12 bg-[#0088cc] hover:bg-[#007ebd] text-white border-2 border-[#0088cc] font-medium transition-all duration-200 hover:shadow-md group"
        type="button"
      >
        <Send className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
        Continue with Telegram
      </Button>
    </div>
  )
}
