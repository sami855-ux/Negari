"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Link } from "react-scroll"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Separator } from "../ui/separator"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const navLinks = [
    { label: "Features", to: "features", offset: 40 },
    { label: "How It Works", to: "how-it-works", offset: 30 },
    { label: "About", to: "about", offset: 0 },
    { label: "Contact", to: "contact", offset: 0 },
  ]

  return (
    <header className="fixed top-0 w-full h-[74px] flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-20 z-50">
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border-b border-gray-100/70 " />

      <div className="relative z-10 h-full flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="hero"
            spy={true}
            smooth={true}
            duration={500}
            offset={-74}
            className="text-[24px] cursor-pointer font-bold font-jakarta pb-1 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent"
          >
            Negari
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-7 ml-12 h-full">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                spy={true}
                smooth={true}
                duration={500}
                offset={link.offset}
                className="font-geist cursor-pointer text-[16px] text-gray-700 hover:text-green-700 transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors z-20"
          onClick={() => setMenuOpen(true)}
        >
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

        {/* Desktop auth button */}
        <div className="hidden md:flex h-full items-center space-x-3">
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="cursor-pointer"
            onClick={() => router.push("/login")}
          >
            <Button className="font-geist text-[16px] bg-gradient-to-r from-green-700 px-7 to-green-600 text-white hover:from-green-600 hover:to-green-500 h-10 transition-all duration-200 shadow-md hover:shadow-green-200/50">
              Log In
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile menu modal */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in menu */}
            <motion.div
              className="fixed top-0 right-0 w-64 h-full bg-white z-20 shadow-lg flex flex-col p-6 space-y-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h2 className="font-jakarta text-gray-500 font-semibold">Menu</h2>

              <Separator />

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={link.offset}
                  className="font-geist cursor-pointer text-base text-gray-700 hover:text-green-700 transition-colors duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <motion.div
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="cursor-pointer"
                onClick={() => {
                  router.push("/login")
                  setMenuOpen(false)
                }}
              >
                <Button className="font-geist text-[16px] bg-gradient-to-r from-green-700 px-7 to-green-600 text-white hover:from-green-600 hover:to-green-500 h-10 transition-all duration-200 shadow-md hover:shadow-green-200/50">
                  Log In
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
