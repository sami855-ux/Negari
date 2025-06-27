import { GoogleOAuthProvider } from "@react-oauth/google"
import { Toaster } from "react-hot-toast"

const Provider = ({ children }) => {
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#000", // Black background
              color: "#fff", // White text
              borderRadius: "8px",
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
      </GoogleOAuthProvider>
    </>
  )
}

export default Provider
