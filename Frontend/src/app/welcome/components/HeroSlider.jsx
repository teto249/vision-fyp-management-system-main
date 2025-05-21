"use client";
import { useState, useEffect } from "react";

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { text: "Milestone Tracking & Progress Management" },
    { text: "Secure Document Sharing & Collaboration" },
    { text: "Offline-First Architecture with Auto-Sync" },
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-3xl mx-10 relative h-96 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 flex items-center justify-center ${
            activeSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="text-4xl font-bold text-gray-100 text-center px-4">
            {slide.text}
          </h2>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              activeSlide === index ? "bg-green-400" : "bg-gray-600 hover:bg-gray-500"
            }`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}