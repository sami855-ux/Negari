import {
  CloudLightningIcon,
  CheckCircleIcon,
  BarChart2Icon,
  Shield,
} from "lucide-react"
import { Button } from "../ui/button"
import { motion } from "framer-motion"

const Hero = () => {
  // Partner logos data
  const partners = [
    { name: "Ethio Telecom", initials: "ET" },
    { name: "Commercial Bank", initials: "CBE" },
    { name: "Ministry of Innovation", initials: "MoT" },
    { name: "Ministry of Innovation", initials: "MoT" },
  ]

  // Feature cards data
  const features = [
    {
      id: 1,
      icon: <CheckCircleIcon className="text-orange-600" size={20} />,
      title: "Real-time Reporting",
      description: "Instant submission and tracking",
      position: "top-2/3 right-10 md:right-44",
    },
    {
      id: 2,
      icon: <BarChart2Icon className="text-blue-800" size={20} />,
      title: "Powerful Analytics",
      description: "Data-driven insights",
      position: "bottom-2/4 left-5 md:left-10",
    },
    {
      id: 3,
      icon: <Shield className="text-green-800" size={20} />,
      title: "Fast Response",
      description: "Instant submission and tracking",
      position: "top-4 right-10 md:right-12",
    },
  ]

  return (
    <div className="w-full mt-[74px] flex flex-col items-center justify-center min-h-[calc(100vh-74px)] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-20 w-40 h-40 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float1"></div>
        <div className="absolute top-60 right-32 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float2"></div>
        <div className="absolute bottom-20 left-1/2 w-52 h-52 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float3"></div>
      </div>

      {/* Floating feature cards */}
      {features.map((feature) => (
        <div
          key={feature.id}
          className={`absolute ${feature.position} z-10 hidden lg:block`}
        >
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/20">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 pt-20">
        {/* Tagline with animation */}
        <div className="flex items-center justify-center space-x-3 mb-4 animate-fadeIn">
          <CloudLightningIcon
            size={25}
            className="text-green-900 font-bold animate-pulse"
          />
          <span className="text-[15px] text-green-900 bg-green-50 px-3 py-1 rounded-full">
            Created for the Ethiopian people
          </span>
        </div>

        {/* Main headline */}
        <h2 className="text-center text-5xl sm:text-6xl md:text-7xl font-extrabold text-primary font-grotesk py-2 animate-slideUp">
          One tool to manage all <br /> community reports
        </h2>

        {/* Subheading */}
        <p className="max-w-3xl mx-auto text-center text-gray-600 pt-5 font-jakarta animate-fadeIn delay-100">
          Streamline community reporting, enhance transparency, and empower
          decision-making with our all-in-one solution designed specifically for
          Ethiopian communities.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center justify-center space-x-5 pt-6 animate-fadeIn delay-200">
          <Button className="bg-gradient-to-r from-green-700 to-green-600 text-white h-12 text-[15px] rounded-xl font-geist px-9 hover:from-green-600 hover:to-green-500 transition-all duration-300 shadow-md hover:shadow-lg">
            Start For Free
          </Button>
          <Button className="bg-transparent h-12 text-[15px] rounded-xl text-green-900 font-geist px-9 hover:bg-gray-100 border border-gray-200 transition-colors duration-300">
            Get a Demo
          </Button>
        </div>

        {/* Enhanced partners section */}
        <div className="w-full mt-16 animate-fadeIn delay-300 flex flex-col items-center justify-center">
          <p className="text-center text-sm font-medium text-gray-500 mb-6 font-jakarta">
            Trusted by organizations across Ethiopia
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4 max-w-md mx-auto">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100/30"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-900 font-bold mb-2">
                  {partner.initials}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
