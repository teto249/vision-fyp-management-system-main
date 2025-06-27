"use client";
import { useState, useEffect } from "react";
import HeroSlider from "../app/welcome/components/HeroSlider";
import Footer from "../app/welcome/components/Footer";
import Navigation from "../app/welcome/components/Navigation";
import Features from "../app/welcome/components/Features";
import ValueProposition from "../app/welcome/components/ValueProposition";

export default function Home() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="relative z-10">
        <Navigation />

        {/* Hero Section with Animation */}
        <div 
          id="hero"
          data-animate
          className={`transition-all duration-1000 ${
            isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <HeroSlider />
        </div>

        {/* Value Proposition with Stagger Animation */}
        <div 
          id="value-proposition"
          data-animate
          className={`transition-all duration-1000 delay-200 ${
            isVisible['value-proposition'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <ValueProposition />
        </div>

        {/* Features with Slide-in Animation */}
        <div 
          id="features"
          data-animate
          className={`transition-all duration-1000 delay-400 ${
            isVisible.features ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <Features />
        </div>

        {/* Enhanced CTA Section */}
        <section 
          id="cta"
          data-animate
          className={`relative py-24 my-8 mx-4 sm:mx-8 lg:mx-16 transition-all duration-1000 delay-600 ${
            isVisible.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* CTA Background with Gradient and Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/90 via-gray-750/90 to-gray-800/90 rounded-3xl backdrop-blur-sm border border-gray-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-teal-500/10 to-emerald-500/10 rounded-3xl"></div>
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl"></div>
          </div>

          <div className="relative max-w-5xl mx-auto px-6 sm:px-8 text-center">
            {/* Animated Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25 animate-bounce">
                  <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              </div>
            </div>

            {/* Enhanced Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent leading-tight">
              Ready to Transform
              <br />
              <span className="text-white">FYP Management?</span>
            </h2>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of universities worldwide using our platform to streamline 
              final year project supervision and enhance student success rates.
            </p>

            {/* Enhanced Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <button className="group relative w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-500 text-gray-900 px-10 py-4 rounded-xl font-semibold text-lg hover:from-green-400 hover:to-teal-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 focus:outline-none focus:ring-4 focus:ring-green-500/50">
                <span className="relative z-10">Schedule Demo</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </button>

              <button className="group relative w-full sm:w-auto border-2 border-green-400/80 text-green-400 px-10 py-4 rounded-xl font-semibold text-lg hover:bg-green-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 focus:outline-none focus:ring-4 focus:ring-green-500/50 backdrop-blur-sm">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Documentation
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-gray-700/50">
              <p className="text-sm text-gray-400 mb-6">Trusted by leading institutions</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                {['University A', 'Institute B', 'College C', 'Academy D'].map((name, index) => (
                  <div key={index} className="text-gray-500 font-medium text-sm tracking-wider hover:text-gray-300 transition-colors cursor-pointer">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-4 h-4 bg-green-400/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-8 right-8 w-6 h-6 bg-teal-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-4 w-2 h-2 bg-emerald-400/40 rounded-full animate-bounce delay-1000"></div>
        </section>

        <Footer />
      </div>

      {/* Custom CSS for Grid Pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}

