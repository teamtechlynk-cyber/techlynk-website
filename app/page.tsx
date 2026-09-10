"use client"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import ServicesOverview from "@/components/services-overview"
import Services from "@/components/services"
import Stats from "@/components/stats"
import AboutSection from "@/components/about-section"
import WhyUs from "@/components/why-us"
import HowItWorks from "@/components/how-it-works"
import Partnerships from "@/components/partnerships"
import CaseStudies from "@/components/case-studies"
import HiringOpenings from "@/components/hiring-openings"
import ContactSection from "@/components/contact-section"
import FeaturesUpdate from "@/components/features-update"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      <Stats />
      <AboutSection />
      <WhyUs />
      <HowItWorks />
      <Partnerships />
      {/* <CaseStudies /> */}
      <HiringOpenings />
      <ContactSection />
      <FeaturesUpdate />
      <Footer />
    </main>
  )
}
