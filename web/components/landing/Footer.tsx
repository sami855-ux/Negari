import {
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  InstagramIcon,
  CloudLightningIcon,
} from "lucide-react"
import Link from "next/link"

const Footer = () => {
  const links = [
    {
      title: "Product",
      items: [
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "Updates", href: "#" },
      ],
    },
    {
      title: "Company",
      items: [
        { name: "About", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Blog", href: "#" },
      ],
    },
    {
      title: "Support",
      items: [
        { name: "Help Center", href: "#" },
        { name: "Community", href: "#" },
        { name: "API Status", href: "#" },
        { name: "Documentation", href: "#" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
      ],
    },
  ]

  return (
    <footer
      className="w-full bg-gradient-to-b from-slate-200 to-slate-300 border-t border-gray-200"
      id="contact"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <CloudLightningIcon className="text-green-600 mr-2" size={24} />
              <span className="text-xl font-bold font-jakarta text-gray-900">
                Negari
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md">
              Empowering Ethiopian communities through transparent reporting and
              data-driven decision making.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <TwitterIcon size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <FacebookIcon size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <LinkedinIcon size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-green-600 transition-colors"
              >
                <InstagramIcon size={20} />
              </Link>
            </div>
          </div>

          {/* Navigation links */}
          {links.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-green-600 transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="pt-8 mt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Negari. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <Link
              href="#"
              className="text-gray-500 hover:text-green-600 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-green-600 text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-green-600 text-sm transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Ethiopia specific */}
        <div className="mt-8 text-center md:text-left">
          <p className="text-xs text-gray-400">Made in Addis Ababa, Ethiopia</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
