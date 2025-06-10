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

// Intersection Observer hook for scroll animations
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return [ref, isIntersecting] as const
}

// Optimized lazy loading image component
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
      {isLoading && <div className={`absolute inset-0 bg-gray-800 animate-pulse rounded-full ${className}`}></div>}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-all duration-500 ${isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        loading="lazy"
        priority={false}
      />
      {hasError && (
        <div className={`${className} bg-gray-800 flex items-center justify-center text-gray-400 rounded-full`}>
          <span className="text-xs">No Image</span>
        </div>
      )}
    </div>
  )
}

// Optimized particle system
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

    // Reduced particle count for better performance
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          targetX: Math.random() * canvas.width,
          targetY: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.1,
          speed: Math.random() * 0.015 + 0.005,
        })
      }
    }

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Calculate distance to mouse
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // If mouse is close, particles move away
        if (distance < 100) {
          particle.targetX = particle.x - dx * 0.05
          particle.targetY = particle.y - dy * 0.05
        } else {
          // Otherwise, gentle random movement
          particle.targetX += (Math.random() - 0.5) * 1
          particle.targetY += (Math.random() - 0.5) * 1
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
      })

      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}

// Animated counter component
function AnimatedCounter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [ref, isIntersecting] = useIntersectionObserver()

  useEffect(() => {
    if (!isIntersecting) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isIntersecting, end, duration])

  return <span ref={ref}>{count}</span>
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
    // Reduced loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 1000)

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

    window.addEventListener("scroll", handleScroll, { passive: true })
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
      price: "From RM1,500",
      features: ["React/Next.js", "Mobile Responsive", "Database Integration", "API Development"],
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Landing Pages for Businesses",
      description: "High-converting landing pages that drive results and grow your business",
      price: "From RM500",
      features: ["Modern Design", "SEO Optimized", "Fast Loading", "Analytics Setup"],
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Resume & CV Writing",
      description: "Professional resumes that get you noticed by employers and recruiters",
      price: "From RM50",
      features: ["ATS Friendly", "Industry Specific", "Cover Letter", "LinkedIn Optimization"],
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: "Translation Services",
      description: "Accurate Bahasa Malaysia to English translations for all your needs",
      price: "From RM0.10/word",
      features: ["Native Speakers", "Business Documents", "Academic Papers", "Quick Turnaround"],
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Posters & Graphics",
      description: "Eye-catching designs for marketing, events, and brand promotion",
      price: "From RM25",
      features: ["Custom Design", "Print Ready", "Social Media Formats", "Brand Guidelines"],
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Technical Consulting",
      description: "Expert guidance on technology implementation and digital transformation",
      price: "From RM75/hour",
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
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Ahmad Razak",
      role: "Restaurant Owner",
      content: "The online ordering system revolutionized our business during the pandemic. Sales doubled!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Jennifer Lee",
      role: "HR Manager",
      content: "The resume makeover was incredible. I got 5 interview calls in just one week!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Robert Kim",
      role: "Tech Startup CEO",
      content: "Afiq's technical expertise helped us avoid costly mistakes. Best investment we made!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Priya Sharma",
      role: "Freelance Designer",
      content: "The portfolio website brought in 10x more clients. Professional and stunning design!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face",
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
          <div className="text-2xl font-bold text-white mb-2 animate-pulse">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AfiqRohaizal
            </span>
          </div>
          <p className="text-gray-400 animate-pulse">Loading amazing experiences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Mouse-following particle system */}
      <MouseFollowingParticles />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-white transform hover:scale-105 transition-transform duration-200">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                AfiqRohaizal
              </span>
            </div>

            <div className="hidden md:flex space-x-8">
              {["services", "portfolio", "about", "testimonials", "contact"].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  className={`text-sm hover:text-cyan-400 transition-all duration-300 relative group transform hover:scale-105 ${activeSection === section ? "text-cyan-400" : "text-white/80"}`}
                >
                  {section.toUpperCase()}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
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
              className="md:hidden text-white hover:text-cyan-400 transition-all duration-300 transform hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10 animate-in slide-in-from-top duration-300">
            <div className="px-4 py-4 space-y-3">
              {["services", "portfolio", "about", "testimonials", "contact"].map((section, index) => (
                <a
                  key={section}
                  href={`#${section}`}
                  className="block text-white hover:text-cyan-400 py-2 text-sm transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {section.toUpperCase()}
                </a>
              ))}
              <a
                href="https://wa.me/60162673423"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-medium px-4 py-3 rounded-xl text-sm mt-4 text-center transition-all duration-300 transform hover:scale-105"
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
              <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full animate-pulse">
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
              <p className="text-xl text-gray-300 max-w-xl leading-relaxed animate-in fade-in-50 slide-in-from-left duration-1000 delay-300">
                Professional services to elevate your business and career. From custom apps to expert consulting, I
                deliver excellence in every project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in-50 slide-in-from-left duration-1000 delay-500">
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
            <div className="relative animate-in fade-in-50 slide-in-from-right duration-1000 delay-200">
              <div className="relative bg-black/20 p-2 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20">
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

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: 50, label: "Projects Completed", suffix: "+" },
              { number: 100, label: "Happy Clients", suffix: "%" },
              { number: 24, label: "Hour Support", suffix: "/7" },
              { number: 5, label: "Years Experience", suffix: "+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-in fade-in-50 slide-in-from-bottom duration-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter end={stat.number} />
                  {stat.suffix}
                </div>
                <div className="text-gray-300 text-sm md:text-base group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in-50 slide-in-from-bottom duration-1000">
            <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full mb-4 animate-pulse">
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
                className="group relative bg-black/20 border border-white/10 rounded-2xl p-8 hover:bg-black/40 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 h-full flex flex-col animate-in fade-in-50 slide-in-from-bottom duration-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative flex flex-col h-full">
                  <div className="text-cyan-400 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 mb-6 flex-grow group-hover:text-gray-200 transition-colors duration-300">
                    {service.description}
                  </p>
                  <div className="text-2xl font-bold text-cyan-400 mb-6 group-hover:scale-105 transition-transform duration-300">
                    {service.price}
                  </div>
                  <ul className="space-y-2 mb-8 flex-grow">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300"
                      >
                        <CheckCircle className="w-4 h-4 text-cyan-400 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="inline-block w-full border border-white/20 hover:border-cyan-500 hover:bg-cyan-500/10 text-white py-3 rounded-xl font-medium text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg mt-auto"
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
            <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full mb-4 animate-pulse">
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
                <div className="relative bg-black/20 rounded-2xl h-full flex flex-col overflow-hidden transform group-hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20">
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 flex-grow group-hover:text-gray-200 transition-colors duration-300">
                      {item.description}
                    </p>
                    <a
                      href="#contact"
                      className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-all duration-300 group/link transform hover:translate-x-1"
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
            <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full mb-4 animate-pulse">
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
                className="group bg-black/20 border border-white/10 rounded-2xl p-8 hover:bg-black/40 transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 animate-in fade-in-50 slide-in-from-bottom duration-1000"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {typeof item.icon === "string" ? item.icon : item.icon}
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
                    {item.desc}
                  </p>
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
              <div className="relative bg-black/20 p-2 rounded-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20">
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
            <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full mb-4 animate-pulse">
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
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-8 mx-4 hover:bg-black/30 transition-all duration-300">
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
                            <Star
                              key={i}
                              className="w-5 h-5 text-yellow-400 fill-current animate-pulse"
                              style={{ animationDelay: `${i * 100}ms` }}
                            />
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
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
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
              <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-sm border border-cyan-500/30 rounded-full mb-4 animate-pulse">
                GET IN TOUCH
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Discuss Your Project</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Ready to transform your digital presence? Contact me to discuss how I can help bring your vision to
                life.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "Afiqrohaizal00@gmail.com",
                    href: "mailto:Afiqrohaizal00@gmail.com",
                  },
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    value: "Afiq Rohaizal",
                    href: "https://www.linkedin.com/in/afiq-rohaizal-b6189929a",
                  },
                  { icon: Github, label: "GitHub", value: "Abejal", href: "https://github.com/Abejal" },
                ].map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-start group animate-in fade-in-50 slide-in-from-left duration-1000"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 rounded-xl mr-4 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300 transform group-hover:scale-110">
                      <contact.icon className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                        {contact.label}
                      </h3>
                      <a
                        href={contact.href}
                        target={contact.href.startsWith("http") ? "_blank" : undefined}
                        rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 inline-flex items-center group-hover:translate-x-1 transform"
                      >
                        {contact.value}
                        {contact.href.startsWith("http") && <ExternalLink className="w-4 h-4 ml-1" />}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-in fade-in-50 slide-in-from-right duration-1000 delay-300">
              <form className="relative bg-gradient-to-b from-cyan-500/5 to-blue-500/5 p-8 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-cyan-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-black/20 border border-cyan-500/30 rounded-xl p-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 placeholder-gray-400 hover:border-cyan-500/50"
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
                    className="w-full bg-black/20 border border-cyan-500/30 rounded-xl p-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 placeholder-gray-400 hover:border-cyan-500/50"
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
                    className="w-full bg-black/20 border border-cyan-500/30 rounded-xl p-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none placeholder-gray-400 hover:border-cyan-500/50"
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
            <div className="md:col-span-2 animate-in fade-in-50 slide-in-from-left duration-1000">
              <div className="text-3xl font-bold text-white mb-4 transform hover:scale-105 transition-transform duration-300">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AfiqRohaizal
                </span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Professional services for the digital age. Transforming ideas into exceptional digital experiences.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Linkedin, href: "https://www.linkedin.com/in/afiq-rohaizal-b6189929a" },
                  { icon: Github, href: "https://github.com/Abejal" },
                  { icon: Twitter, href: "https://twitter.com" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-cyan-500/20 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                  >
                    <social.icon className="w-5 h-5 text-cyan-400" />
                  </a>
                ))}
              </div>
            </div>

            <div className="animate-in fade-in-50 slide-in-from-bottom duration-1000 delay-200">
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {["Web Development", "Mobile Apps", "UI/UX Design", "Consulting"].map((service, index) => (
                  <li key={index}>
                    <a
                      href="#services"
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:translate-x-1 inline-block"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="animate-in fade-in-50 slide-in-from-bottom duration-1000 delay-300">
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {["About", "Portfolio", "Testimonials", "Contact"].map((link, index) => (
                  <li key={index}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center animate-in fade-in-50 slide-in-from-bottom duration-1000 delay-500">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 AfiqRohaizal. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((policy, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-cyan-400 transition-all duration-300 transform hover:translate-y-1"
                >
                  {policy}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/25 z-50 ${scrollY > 500 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  )
}
