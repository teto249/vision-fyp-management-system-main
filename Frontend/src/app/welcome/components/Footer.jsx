"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ScrollLink from "./ScrollLink";
import Link from "next/link";

export default function Footer() {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubscribing(false);
      setEmail("");
    }, 1500);
  };

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/altayeb-mustafa",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/altayeb-mustafa",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: "Twitter",
      href: "https://twitter.com/altayeb_mustafa",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: "Email",
      href: "mailto:altayebnuba@gmail.com",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-1.5.664-3.129.988-4.827 1.164 1.735-1.035 3.066-2.676 3.693-4.631-1.622.959-3.419 1.656-5.329 2.032C15.822 1.252 13.791 0 11.434 0c-4.608 0-8.34 3.732-8.34 8.34 0 .654.074 1.292.217 1.903C7.722 10.02 4.1 8.374 1.671 5.448c-.717 1.232-.964 2.662-.964 4.19 0 2.895 1.473 5.448 3.711 6.943-1.366-.044-2.65-.418-3.776-1.043v.105c0 4.041 2.874 7.415 6.69 8.179-.7.19-1.437.292-2.198.292-.538 0-1.06-.052-1.569-.15 1.061 3.31 4.135 5.719 7.782 5.785-2.852 2.235-6.447 3.567-10.353 3.567-.673 0-1.336-.04-1.988-.118C3.688 22.894 8.065 24 12.769 24c15.322 0 23.692-12.692 23.692-23.692 0-.361-.008-.721-.025-1.08C22.5 7.722 23.436 6.227 24 4.557z"/>
        </svg>
      )
    }
  ];

  const quickStats = [
    { label: "Universities", value: "500+", description: "Trusted worldwide" },
    { label: "Students", value: "10K+", description: "Active users" },
    { label: "Projects", value: "25K+", description: "Successfully completed" },
    { label: "Success Rate", value: "98%", description: "Student satisfaction" }
  ];

  const certifications = [
    { name: "ISO 27001", description: "Information Security" },
    { name: "GDPR", description: "Data Protection" },
    { name: "SOC 2", description: "Security & Privacy" },
    { name: "FERPA", description: "Educational Records" }
  ];

  return (
    <>
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          aria-label="Back to top"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-teal-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/3 rounded-full blur-2xl"></div>
      </div>

      <div className="relative">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-gray-700/30">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Stay Updated with VISION
            </h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get the latest updates on new features, university partnerships, and educational insights 
              delivered straight to your inbox.
            </p>
            
            {isSubscribed ? (
              <div className="inline-flex items-center space-x-3 px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-400 font-medium">Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isSubscribing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Enhanced Quick Stats Section */}
        <div className="py-16 border-b border-gray-700/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-all duration-300">
                    {stat.value}
                  </div>
                  <div className="text-gray-300 font-semibold mb-1">{stat.label}</div>
                  <div className="text-gray-500 text-xs">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust & Certifications Section */}
        <div className="py-12 border-b border-gray-700/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h4 className="text-lg font-semibold text-gray-300 mb-2">Trusted & Certified</h4>
              <p className="text-gray-500 text-sm">Industry-leading security and compliance standards</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {certifications.map((cert, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-800/50 rounded-xl flex items-center justify-center border border-gray-700/50 group-hover:border-green-500/30 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-gray-300 font-medium text-sm">{cert.name}</div>
                  <div className="text-gray-500 text-xs">{cert.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-5 gap-12">
            {/* Enhanced Logo Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="VISION Logo"
                    width={60}
                    height={60}
                    className="rounded-2xl shadow-lg"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-2xl blur-lg"></div>
                </div>
                <div>
                  <h3 className="font-bold text-2xl bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                    VISION
                  </h3>
                  <p className="text-gray-300 font-medium">FYP Management System</p>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                Revolutionizing final year project management with cutting-edge technology, 
                ensuring seamless collaboration between students and supervisors for academic excellence.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
                  🔒 Secure
                </span>
                <span className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-xs font-medium border border-teal-500/20">
                  ⚡ Reliable
                </span>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20">
                  🎓 Accredited
                </span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                  🌐 Global
                </span>
              </div>

              {/* Social Media Links */}
              <div className="flex space-x-4 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/25 border border-gray-700/50 hover:border-green-500/30"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@vision-fyp.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>UTM Faculty of Computing, Malaysia</span>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            <div 
              className="space-y-6"
              onMouseEnter={() => setHoveredSection('product')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <h4 className={`text-lg font-semibold transition-colors duration-300 ${
                hoveredSection === 'product' ? 'text-green-400' : 'text-gray-200'
              }`}>
                Product
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Features", href: "features" },
                  { label: "Value Proposition", href: "value" },
                  { label: "Pricing", href: "/pricing", external: true },
                  { label: "Demo", href: "/demo", external: true },
                  { label: "API Documentation", href: "/docs", external: true },
                  { label: "Integration Guide", href: "/integration", external: true }
                ].map((item, index) => (
                  <li key={index}>
                    {item.external ? (
                      <Link 
                        href={item.href}
                        className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-flex items-center group"
                      >
                        {item.label}
                        <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <ScrollLink 
                        to={item.href}
                        className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-block"
                      >
                        {item.label}
                      </ScrollLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div 
              className="space-y-6"
              onMouseEnter={() => setHoveredSection('company')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <h4 className={`text-lg font-semibold transition-colors duration-300 ${
                hoveredSection === 'company' ? 'text-green-400' : 'text-gray-200'
              }`}>
                Company
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "about" },
                  { label: "Blog", href: "/blog", external: true },
                  { label: "Contact", href: "/contact", external: true },
                  { label: "Careers", href: "/careers", external: true },
                  { label: "Press Kit", href: "/press", external: true },
                  { label: "Partners", href: "/partners", external: true }
                ].map((item, index) => (
                  <li key={index}>
                    {item.external ? (
                      <Link 
                        href={item.href}
                        className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-flex items-center group"
                      >
                        {item.label}
                        <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <ScrollLink 
                        to={item.href}
                        className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-block"
                      >
                        {item.label}
                      </ScrollLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div 
              className="space-y-6"
              onMouseEnter={() => setHoveredSection('support')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <h4 className={`text-lg font-semibold transition-colors duration-300 ${
                hoveredSection === 'support' ? 'text-green-400' : 'text-gray-200'
              }`}>
                Support & Legal
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Help Center", href: "/help", external: true },
                  { label: "Privacy Policy", href: "/privacy", external: true },
                  { label: "Terms of Service", href: "/terms", external: true },
                  { label: "GDPR Compliance", href: "/gdpr", external: true },
                  { label: "Security", href: "/security", external: true },
                  { label: "Status Page", href: "/status", external: true }
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.href}
                      className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:translate-x-1 inline-flex items-center group"
                    >
                      {item.label}
                      <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Enhanced Copyright Section */}
        <div className="border-t border-gray-700/30 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm mb-1">
                  © {new Date().getFullYear()} VISION FYP Management System. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs">
                  Developed for UTM Faculty of Computing by{" "}
                  <span className="text-green-400 font-medium">Altayeb Mustafa Ibrahim Abdelrasoul</span>
                </p>
              </div>
              
              <div className="flex items-center space-x-6 text-xs text-gray-500">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  System Online
                </span>
                <span>v2.1.0</span>
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  SSL Secured
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <div 
            onClick={scrollToTop} 
            className="fixed bottom-16 right-4 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            aria-label="Back to Top"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l-10 10h3v10h14v-10h3z"/>
            </svg>
          </div>
        )}

        {/* Scroll Progress Indicator */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-teal-400"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      </div>
    </footer>
    </>
  );
}