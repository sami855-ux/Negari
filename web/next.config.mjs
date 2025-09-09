/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "images.unsplash.com"], // ✅ add allowed domains here
  },
  typescript: {
    // !! Danger: allows production builds with type errors
    ignoreBuildErrors: true,
  },
}

export default nextConfig
