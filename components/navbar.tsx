"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-xl shadow-primary/10 border-b border-primary/20"
          : "bg-background/80 backdrop-blur-lg border-b border-primary/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group transition-transform duration-300 group-hover:opacity-90">
            <Image
              src="/techlynk-logo.png"
              alt="Techlynk - Enterprise Software Solutions"
              width={320}
              height={80}
              className="h-10 w-auto sm:h-12 md:h-14 object-contain object-left"
              quality={95}
              priority
              sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, 280px"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#services"
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#careers"
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group inline-flex items-center gap-2"
            >
              Careers
              <span className="px-2 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-[10px] font-bold uppercase tracking-wider text-primary">
                Hiring
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="#contact" className="relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/40 hover:scale-105 active:scale-95 border border-primary/40">
              <span className="relative z-10">Contact Us</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-4 border-t border-border/50 pt-4 space-y-2">
            <Link
              href="#services"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
            >
              Services
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
            >
              How It Works
            </Link>
            <Link
              href="#about"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
            >
              About
            </Link>
            <Link
              href="#careers"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 py-3 px-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
            >
              Careers
              <span className="px-2 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-[10px] font-bold uppercase tracking-wider text-primary">
                Hiring
              </span>
            </Link>
            <Link
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 text-center block border border-primary/40"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
