import { GoogleOAuthProvider } from "@react-oauth/google"

const Provider = ({ children }) => {
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    </>
  )
}

export default Provider
