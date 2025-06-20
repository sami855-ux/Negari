import Link from "next/link"
import { Button } from "../ui/button"

const Header = () => {
  return (
    <header className="fixed top-0 w-full h-[74px] flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-20 z-50">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/70 " />

      <div className="relative z-10 h-full flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold font-jakarta pb-1 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
            ZenaNet
          </h1>

          {/* Navigation - hidden on mobile, shown on desktop */}
          <nav className="hidden md:flex items-center space-x-7 ml-12 h-full">
            <Link
              href="/#"
              className="font-geist text-[15px] text-gray-700 hover:text-green-700 transition-colors duration-200 relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#"
              className="font-geist text-[15px] text-gray-700 hover:text-green-700 transition-colors duration-200 relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#"
              className="font-geist text-[15px] text-gray-700 hover:text-green-700 transition-colors duration-200 relative group"
            >
              Partners
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/#"
              className="font-geist text-[15px] text-gray-700 hover:text-green-700 transition-colors duration-200 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* Mobile menu button - hidden on desktop */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Auth buttons - hidden on mobile, shown on desktop */}
        <div className="hidden md:flex h-full items-center space-x-3">
          <Link href={"/login"}>
            <Button className="font-geist bg-gradient-to-r from-green-700 px-7 to-green-600 text-white hover:from-green-600 hover:to-green-500 h-10 transition-all duration-200 shadow-md hover:shadow-green-200/50">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
