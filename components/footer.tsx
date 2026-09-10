"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-muted/50 text-foreground relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[150px]"></div>
      </div>
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="bg-primary/10 py-20 sm:py-24 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10 sm:gap-14 text-center">
            <div className="group animate-slide-up">
              <div className="inline-flex p-4 bg-primary/15 rounded-2xl mb-6 group-hover:bg-primary/25 group-hover:scale-110 transition-all duration-500">
                <Phone className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h4 className="card-title !mb-3">Phone</h4>
              <a href="tel:+919573787824" className="text-muted-foreground hover:text-primary transition-colors text-base sm:text-lg font-medium">
                +91 95737 87824
              </a>
            </div>
            <div className="group animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="inline-flex p-4 bg-primary/15 rounded-2xl mb-6 group-hover:bg-primary/25 group-hover:scale-110 transition-all duration-500">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h4 className="card-title !mb-3">Email</h4>
              <a href="mailto:support@techlynk.co" className="text-muted-foreground hover:text-primary transition-colors text-base sm:text-lg font-medium">
                support@techlynk.co
              </a>
            </div>
            <div className="group animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="inline-flex p-4 bg-primary/15 rounded-2xl mb-6 group-hover:bg-primary/25 group-hover:scale-110 transition-all duration-500">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h4 className="card-title !mb-3">Location</h4>
              <p className="text-muted-foreground text-base sm:text-lg font-medium">Hyderabad, India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid md:grid-cols-4 gap-10 sm:gap-14 mb-12 sm:mb-16">
          <div className="animate-slide-up">
            <h4 className="section-heading !mb-6 sm:!mb-8 text-xl sm:text-2xl text-primary">Services</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  Development
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  Consulting
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h4 className="section-heading !mb-6 sm:!mb-8 text-xl sm:text-2xl text-primary">Company</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#careers" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h4 className="section-heading !mb-6 sm:!mb-8 text-xl sm:text-2xl text-primary">Resources</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <h4 className="section-heading !mb-6 sm:!mb-8 text-xl sm:text-2xl text-primary">Legal</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors duration-300 text-base sm:text-lg font-medium">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-10 text-center text-muted-foreground">
          <p className="text-base sm:text-lg font-medium">&copy; 2025 Techlynk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
