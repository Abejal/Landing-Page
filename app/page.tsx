"use client"

import { useState, useEffect, useRef } from "react"
import {
  Code,
  Globe,
  FileText,
  Languages,
  Palette,
  Star,
  Menu,
  X,
  CheckCircle,
  ChevronRight,
  Cpu,
  Shield,
  Zap,
  Mail,
  Linkedin,
  Github,
  Twitter,
  ArrowUp,
  ExternalLink,
  ChevronLeft,
} from "lucide-react"
import Image from "next/image"

// Enhanced typing animation hook
function useTypingAnimation(texts: string[], speed = 100, deleteSpeed = 50, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentText = texts[currentIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentText.length) {
            setDisplayText(currentText.slice(0, displayText.length + 1))
            setIsTyping(true)
          } else {
            setIsTyping(false)
            setTimeout(() => setIsDeleting(true), pauseTime)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(currentText.slice(0, displayText.length - 1))
            setIsTyping(true)
          } else {
            setIsDeleting(false)
            setCurrentIndex((prev) => (prev + 1) % texts.length)
            setIsTyping(false)
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    )

    return () => clearTimeout(timeout)
  }, [displayText, currentIndex, isDeleting, texts, speed, deleteSpeed, pauseTime])

  return { displayText, isTyping }
}

// Loading skeleton component
function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-shimmer"></div>
    </div>
  )
}

// Lazy loading image component
function LazyImage({
  src,
  alt,
  width,
  height,
  className,
}: { src: string; alt: string; width: number; height: number; className?: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className="relative">
      {isLoading && <LoadingSkeleton className={`absolute inset-0 ${className}`} />}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        loading="lazy"
      />
      {hasError && (
        <div className={`${className} bg-gray-800 flex items-center justify-center text-gray-400`}>
          Failed to load image
        </div>
      )}
    </div>
  )
}

// Mouse-following particle system inspired by woodlight.fr
function MouseFollowingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      targetX: number
      targetY: number
      size: number
      opacity: number
      speed: number
    }>
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          targetX: Math.random() * canvas.width,
          targetY: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 0.02 + 0.01,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Calculate distance to mouse
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // If mouse is close, particles move away
        if (distance < 150) {
          particle.targetX = particle.x - dx * 0.1
          particle.targetY = particle.y - dy * 0.1
        } else {
          // Otherwise, gentle random movement
          particle.targetX += (Math.random() - 0.5) * 2
          particle.targetY += (Math.random() - 0.5) * 2
        }

        // Smooth movement towards target
        particle.x += (particle.targetX - particle.x) * particle.speed
        particle.y += (particle.targetY - particle.y) * particle.speed

        // Keep particles within bounds
        if (particle.x < 0) particle.targetX = Math.random() * 100
        if (particle.x > canvas.width) particle.targetX = canvas.width - Math.random() * 100
        if (particle.y < 0) particle.targetY = Math.random() * 100
        if (particle.y > canvas.height) particle.targetY = canvas.height - Math.random() * 100

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34, 211, 238, ${particle.opacity})`
        ctx.fill()

        // Draw connections to nearby particles
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - distance / 100)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        })
      })

      requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}

export default function ServicesLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [scrollY, setScrollY] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Enhanced typing animation texts
  const typingTexts = ["Digital Presence", "Business Success", "Career Growth", "Tech Solutions"]
  const { displayText, isTyping } = useTypingAnimation(typingTexts, 120, 80, 2500)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 2000)

    const handleScroll = () => {
      setScrollY(window.scrollY)
      const sections = ["services", "portfolio", "about", "testimonials", "contact"]

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const services = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Custom App Development",
      description: "Full-stack web and mobile applications tailored to your business needs",
      price: "From $1,500",
      features: ["React/Next.js", "Mobile Responsive", "Database Integration", "API Development"],
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Landing Pages for Businesses",
      description: "High-converting landing pages that drive results and grow your business",
      price: "From $500",
      features: ["Modern Design", "SEO Optimized", "Fast Loading", "Analytics Setup"],
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Resume & CV Writing",
      description: "Professional resumes that get you noticed by employers and recruiters",
      price: "From $50",
      features: ["ATS Friendly", "Industry Specific", "Cover Letter", "LinkedIn Optimization"],
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: "Translation Services",
      description: "Accurate Bahasa Malaysia to English translations for all your needs",
      price: "From $0.10/word",
      features: ["Native Speakers", "Business Documents", "Academic Papers", "Quick Turnaround"],
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Posters & Graphics",
      description: "Eye-catching designs for marketing, events, and brand promotion",
      price: "From $25",
      features: ["Custom Design", "Print Ready", "Social Media Formats", "Brand Guidelines"],
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Technical Consulting",
      description: "Expert guidance on technology implementation and digital transformation",
      price: "From $75/hour",
      features: ["Technology Assessment", "Solution Architecture", "Implementation Strategy", "Ongoing Support"],
    },
  ]

  const testimonials = [
    {
      name: "Sarah Ahmad",
      role: "Business Owner",
      content: "The landing page transformed our online presence. We saw a 300% increase in inquiries!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "David Chen",
      role: "Job Seeker",
      content: "Professional resume writing service helped me land my dream job within 2 weeks.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Fatimah Ibrahim",
      role: "Marketing Director",
      content: "The custom web application streamlined our entire workflow. Highly recommended!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Michael Rodriguez",
      role: "Startup Founder",
      content: "Exceptional technical consulting that helped us scale our platform efficiently.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Lisa Wang",
      role: "E-commerce Owner",
      content: "The e-commerce solution increased our sales by 250%. Outstanding work!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
  ]

  const portfolioItems = [
    {
      title: "Admin Dashboard",
      description: "Comprehensive admin interface with real-time analytics and user management",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-09%20235519-ppX1nYlxW98imwgQQpKpLYKNdTi640.png",
    },
    {
      title: "E-commerce Platform",
      description: "Full-featured online store with payment processing and inventory management",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    },
    {
      title: "Corporate Website",
      description: "Modern, responsive website for a leading technology company",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-2xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ProServices
            </span>
          </div>
          <p className="text-gray-400">Loading amazing experiences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Mouse-following particle system */}
      <MouseFollowingParticles />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ProServices
              </span>
            </div>

            <div className="hidden md:flex space-x-8">
              <a
                href="#services"
                className={`text-sm hover:text-cyan-400 transition-all duration-300 relative group ${activeSection === "services" ? "text-cyan-400" : "text-white/80"}`}
              >
                SERVICES
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#portfolio"
                className={`text-sm hover:text-cyan-400 transition-all duration-300 relative group ${activeSection === "portfolio" ? "text-cyan-400" : "text-white/80"}`}
              >
                PORTFOLIO
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#about"
                className={`text-sm hover:text-cyan-400 transition-all duration-300 relative group ${activeSection === "about" ? "text-cyan-400" : "text-white/80"}`}
              >
                ABOUT
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#testimonials"
                className={`text-sm hover:text-cyan-400 transition-all duration-300 relative group ${activeSection === "testimonials" ? "text-cyan-400" : "text-white/80"}`}
              >
                TESTIMONIALS
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#contact"
                className={`text-sm hover:text-cyan-400 transition-all duration-300 relative group ${activeSection === "contact" ? "text-cyan-400" : "text-white/80"}`}
              >
                CONTACT
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            <div className="hidden md:flex">
              <a
                href="https://wa.me/60162673423"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-medium px-6 py-2 rounded-full text-sm flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                CONTACT ME
              </a>
            </div>

            <button
              className="md:hidden text-white hover:text-cyan-400 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 animate-in slide-in-from-top duration-300">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#services"
                className="block text-white hover:text-cyan-400 py-2 text-sm transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                SERVICES
              </a>
              <a
                href="#portfolio"
                className="block text-white hover:text-cyan-400 py-2 text-sm transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                PORTFOLIO
              </a>
              <a
                href="#about"
                className="block text-white hover:text-cyan-400 py-2 text-sm transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
              </a>
              <a
                href="#testimonials"
                className="block text-white hover:text-cyan-400 py-2 text-sm transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                TESTIMONIALS
              </a>
              <a
                href="#contact"
                className="block text-white hover:text-cyan-400 py-2 text-sm transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT
              </a>
              <a
                href="https://wa.me/60162673423"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-medium px-4 py-3 rounded-xl text-sm mt-4 text-center transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT ME
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-left duration-1000">
              <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full backdrop-blur-sm">
                PROFESSIONAL SERVICES
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Transform Your
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent block mt-2 min-h-[1.2em] relative">
                  {displayText}
                  <span
                    className={`inline-block w-1 h-full bg-cyan-400 ml-1 ${
                      isTyping ? "animate-pulse" : "animate-blink"
                    }`}
                  ></span>
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-xl leading-relaxed animate-in fade-in-50 slide-in-from-left duration-1000 delay-500">
                Professional services to elevate your business and career. From custom apps to expert consulting, I
                deliver excellence in every project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in-50 slide-in-from-left duration-1000 delay-700">
                <a
                  href="#services"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black px-8 py-4 rounded-full font-medium flex items-center justify-center transition-all duration-300 group transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25 w-full sm:w-auto"
                >
                  EXPLORE SERVICES
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
                <a
                  href="#contact"
                  className="border border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-white px-8 py-4 rounded-full font-medium flex items-center justify-center transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                >
                  GET IN TOUCH
                </a>
              </div>
            </div>
            <div className="relative animate-in fade-in-50 slide-in-from-right duration-1000 delay-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30 animate-pulse"></div>
              <div className="relative bg-black p-2 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20">
                <LazyImage
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-09%20235519-ppX1nYlxW98imwgQQpKpLYKNdTi640.png"
                  alt="Dashboard Example"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in-50 slide-in-from-bottom duration-1000">
            <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full backdrop-blur-sm mb-4">
              WHAT I OFFER
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Professional Services</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive solutions for your business and career needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-gradient-to-b hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 animate-in fade-in-50 slide-in-from-bottom duration-1000 h-full flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 rounded-2xl transition-all duration-500"></div>
                <div className="relative flex flex-col h-full">
                  <div className="text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 mb-6 flex-grow">{service.description}</p>
                  <div className="text-2xl font-bold text-cyan-400 mb-6">{service.price}</div>
                  <ul className="space-y-2 mb-8 flex-grow">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-cyan-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="inline-block w-full border border-white/20 hover:border-cyan-500 hover:bg-cyan-500/10 text-white py-3 rounded-xl font-medium text-center transition-all duration-300 transform hover:scale-105 mt-auto"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in-50 slide-in-from-bottom duration-1000">
            <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full backdrop-blur-sm mb-4">
              MY WORK
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Projects</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore some of my recent work and successful implementations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl animate-in fade-in-50 slide-in-from-bottom duration-1000"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-black rounded-2xl h-full flex flex-col overflow-hidden transform group-hover:scale-105 transition-all duration-500">
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 flex-grow">{item.description}</p>
                    <a
                      href="#contact"
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-300 group/link"
                    >
                      View Details
                      <ChevronRight className="ml-1 w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in-50 slide-in-from-bottom duration-1000">
            <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full backdrop-blur-sm mb-4">
              WHY CHOOSE ME
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Expertise & Approach</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              I bring fresh perspectives, competitive pricing, and personalized attention to every project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: "100%", title: "Dedicated", desc: "Full commitment to your project's success" },
              { icon: "24h", title: "Quick Response", desc: "Fast communication and project updates" },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Affordable Rates",
                desc: "Competitive pricing without compromising quality",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Innovation",
                desc: "Constantly exploring new technologies and trends",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-gradient-to-b hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 animate-in fade-in-50 slide-in-from-bottom duration-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {typeof item.icon === "string" ? item.icon : item.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in-50 slide-in-from-left duration-1000">
              <h3 className="text-3xl font-bold text-white mb-6">My Approach</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                I believe in delivering high-quality solutions that make a real difference for my clients. With a
                passion for technology and design, I focus on creating experiences that not only meet your requirements
                but exceed your expectations.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Every project is treated with the attention and care it deserves, ensuring results that drive success. I
                stay updated with the latest technologies and best practices to provide cutting-edge solutions.
              </p>
            </div>
            <div className="relative animate-in fade-in-50 slide-in-from-right duration-1000 delay-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30 animate-pulse"></div>
              <div className="relative bg-black p-2 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20">
                <LazyImage
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop"
                  alt="Modern developer workspace with multiple monitors showing code and applications"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in-50 slide-in-from-bottom duration-1000">
            <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full backdrop-blur-sm mb-4">
              CLIENT FEEDBACK
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See what satisfied clients have to say about my services
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Testimonial Carousel */}
            <div className="relative overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mx-4">
                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                          <LazyImage
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover rounded-full border-2 border-cyan-400"
                          />
                        </div>
                        <div className="flex justify-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-300 mb-6 italic text-lg leading-relaxed max-w-2xl mx-auto">
                          "{testimonial.content}"
                        </p>
                        <div>
                          <div className="font-semibold text-white text-xl mb-1">{testimonial.name}</div>
                          <div className="text-cyan-400">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-cyan-400 scale-125" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-in fade-in-50 slide-in-from-left duration-1000">
              <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full backdrop-blur-sm mb-4">
                GET IN TOUCH
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Discuss Your Project</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Ready to transform your digital presence? Contact me to discuss how I can help bring your vision to
                life.
              </p>

              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 rounded-xl mr-4 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                    <Mail className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                      Email
                    </h3>
                    <a
                      href="mailto:Afiqrohaizal00@gmail.com"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                    >
                      Afiqrohaizal00@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 rounded-xl mr-4 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                    <Linkedin className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                      LinkedIn
                    </h3>
                    <a
                      href="https://www.linkedin.com/in/afiq-rohaizal-b6189929a"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 inline-flex items-center"
                    >
                      Afiq Rohaizal
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in-50 slide-in-from-right duration-1000 delay-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-30"></div>
              <form className="relative bg-gradient-to-b from-cyan-500/5 to-blue-500/5 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-cyan-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-black/20 border border-cyan-500/30 rounded-xl p-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 placeholder-gray-400"
                    placeholder="Your name"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-cyan-300">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-black/20 border border-cyan-500/30 rounded-xl p-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 placeholder-gray-400"
                    placeholder="Your email"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-cyan-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-black/20 border border-cyan-500/30 rounded-xl p-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none placeholder-gray-400"
                    placeholder="Tell me about your project"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-medium py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="text-3xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  ProServices
                </span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Professional services for the digital age. Transforming ideas into exceptional digital experiences.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/in/afiq-rohaizal-b6189929a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-cyan-500/20 p-3 rounded-xl transition-all duration-300 transform hover:scale-110"
                >
                  <Linkedin className="w-5 h-5 text-cyan-400" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-cyan-500/20 p-3 rounded-xl transition-all duration-300 transform hover:scale-110"
                >
                  <Github className="w-5 h-5 text-cyan-400" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-cyan-500/20 p-3 rounded-xl transition-all duration-300 transform hover:scale-110"
                >
                  <Twitter className="w-5 h-5 text-cyan-400" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#services" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                    Mobile Apps
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                    UI/UX Design
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                    Consulting
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                    About
                  </a>
                </li>
                <li>
                  <a href="#portfolio" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 ProServices. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50 ${scrollY > 500 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  )
}
