"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollLink from "./ScrollLink";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Active section detection
      const sections = ["hero", "features", "about", "value"];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(currentSection || "");
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { id: "features", label: "Features" },
    { id: "about", label: "About" },
    { id: "value", label: "Value" }
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-lg shadow-2xl border-b border-gray-800/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group z-10">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="VISION Logo"
                  width={45}
                  height={45}
                  className="rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl opacity-0 group-hover:opacity-30 blur transition-all duration-300"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                VISION
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <ScrollLink
                  key={item.id}
                  to={item.id}
                  className={`relative font-medium transition-all duration-300 group px-2 py-1 ${
                    activeSection === item.id
                      ? 'text-green-400'
                      : 'text-gray-300 hover:text-green-400'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-green-400 to-teal-400 transition-all duration-300 ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </ScrollLink>
              ))}
              
              <Link href="/auth">
                <button className="relative bg-gradient-to-r from-green-500 to-teal-500 text-gray-900 px-6 py-2.5 rounded-lg font-semibold hover:from-green-400 hover:to-teal-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 overflow-hidden group">
                  <span className="relative z-10">Log In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-green-400 hover:bg-gray-800/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 z-10"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 top-3' : 'top-1'
                }`}></span>
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 top-3 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 top-3' : 'top-5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-gray-900/95 backdrop-blur-lg border-t border-gray-800/50">
            <div className="px-4 py-6 space-y-1">
              {navItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`transform transition-all duration-300 delay-${index * 100} ${
                    isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                >
                  <ScrollLink
                    to={item.id}
                    className={`block font-medium py-3 px-2 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? 'text-green-400 bg-green-500/10'
                        : 'text-gray-300 hover:text-green-400 hover:bg-gray-800/50'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </ScrollLink>
                </div>
              ))}
              
              <div className={`pt-4 transform transition-all duration-300 delay-300 ${
                isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}>
                <Link href="/auth" className="block">
                  <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:from-green-400 hover:to-teal-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50">
                    Log In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={closeMobileMenu}
          ></div>
        )}
      </nav>
      
      {/* Spacer for fixed navigation */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}
