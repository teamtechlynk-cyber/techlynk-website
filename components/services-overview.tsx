"use client"

import { useState } from "react"

const serviceCategories = [
  {
    id: "erp",
    name: "ERP and Business Applications",
    services: [
      "Oracle EBS Implementation Services",
      "Oracle Fusion Implementation Services",
      "Oracle EPM Implementation Services",
      "Oracle HCM Implementation Services",
      "Oracle SCM Implementation Services",
    ],
  },
  {
    id: "cloud",
    name: "Cloud and Infrastructure",
    services: [
      "Oracle Cloud Services",
      "Oracle Cloud Integration Services",
      "Oracle Cloud Accelerators",
      "Oracle Database Services",
    ],
  },
  {
    id: "data",
    name: "Data and Analytic",
    services: [
      "Oracle Analytics",
      "Business Intelligence",
    ],
  },
]

export default function ServicesOverview() {
  const [activeTab, setActiveTab] = useState("erp")
  const activeCategory = serviceCategories.find((cat) => cat.id === activeTab)

  return (
    <section id="services-overview" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 p-3 glass-primary rounded-3xl border border-border/50 backdrop-blur-xl shadow-xl">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-6 sm:px-8 py-3 sm:py-4 font-bold transition-all duration-500 text-sm sm:text-base whitespace-nowrap relative rounded-2xl ${
                activeTab === category.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:scale-105"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Services List */}
        {activeCategory && (
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="card-premium p-8 sm:p-10 md:p-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8 sm:mb-10">
                {activeCategory.name}
              </h3>
              <ul className="space-y-4 sm:space-y-5">
                {activeCategory.services.map((service, index) => (
                  <li
                    key={index}
                    className="text-base sm:text-lg md:text-xl text-muted-foreground hover:text-primary transition-colors duration-300 pl-4 border-l-4 border-primary/20 hover:border-primary/60"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
