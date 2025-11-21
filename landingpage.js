import React from "react";
import { Button } from "@/components/ui/button";
import { Coffee, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import HeroSection from "../components/landing/HeroSection";
import ProblemSection from "../components/landing/ProblemSection";
import WhyMattersSection from "../components/landing/WhyMattersSection";
import SolutionSection from "../components/landing/SolutionSection";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: "smooth" 
    });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Smart Canteen
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('problem-section')}
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                Problem
              </button>
              <button 
                onClick={() => scrollToSection('solution-section')}
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
              >
                Solution
              </button>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button 
                onClick={() => navigate(createPageUrl("Welcome"))}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-teal-600"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="flex flex-col p-4 space-y-2">
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}
                className="text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('problem-section')}
                className="text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg font-medium transition-colors"
              >
                Problem
              </button>
              <button 
                onClick={() => scrollToSection('solution-section')}
                className="text-left px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg font-medium transition-colors"
              >
                Solution
              </button>
              <Button 
                onClick={() => { navigate(createPageUrl("Welcome")); setMobileMenuOpen(false); }}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white w-full mt-2"
              >
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content with padding for fixed header */}
      <div className="pt-16">
        <HeroSection />
        <ProblemSection />
        <WhyMattersSection />
        <div id="solution-section">
          <SolutionSection />
        </div>
      </div>
    </div>
  );
}