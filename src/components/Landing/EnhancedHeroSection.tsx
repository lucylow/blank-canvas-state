import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Users, Zap, ArrowDown } from 'lucide-react';

export const EnhancedHeroSection = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    document.addEventListener('click', handleScroll);
    return () => document.removeEventListener('click', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Innovation Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-200">Powered by Doma Protocol & AI</span>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-200 border-purple-400/50">Live on Testnet</Badge>
          </div>

          {/* Main Headline - Mobile optimized text sizes */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 md:mb-8 leading-tight animate-slide-up px-4">
            <span className="block mb-2">Your AI-Powered Gateway to</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-x">
              Tokenized Domains
            </span>
          </h1>

          {/* Sub-headline - Better mobile readability */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in px-4" style={{animationDelay: '0.2s'}}>
            Instantly value, tokenize, and monetize your Web3 domains. 
            Transform digital assets into thriving destinations with <strong className="text-cyan-400">automated landing pages</strong>, 
            <strong className="text-purple-400"> AI valuation</strong>, and <strong className="text-pink-400">secure messaging</strong>.
          </p>

          {/* CTA Buttons - Mobile optimized with min touch target 44px */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16 animate-scale-in px-4" style={{animationDelay: '0.4s'}}>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-8 sm:py-6 sm:px-10 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 min-h-[44px] text-base sm:text-lg"
                aria-label="Launch your domain landing page"
              >
                <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Launch Your Domain Page
              </Button>
            </Link>
            <Link to="/marketplace" className="w-full sm:w-auto">
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-slate-600 hover:border-slate-400 text-slate-200 font-semibold py-4 px-8 sm:py-6 sm:px-10 rounded-xl transition-all duration-300 hover:bg-slate-800/50 min-h-[44px] text-base sm:text-lg"
                aria-label="Explore live domain marketplace"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Explore Live Marketplace
              </Button>
            </Link>
          </div>

          {/* Live Platform Stats - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto animate-fade-in px-4" style={{animationDelay: '0.6s'}}>
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600 mb-2 group-hover:scale-110 transition-transform">
                10K+
              </div>
              <div className="text-slate-400 text-xs md:text-sm font-medium">Domains Tokenized</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2 group-hover:scale-110 transition-transform">
                $2.5M+
              </div>
              <div className="text-slate-400 text-xs md:text-sm font-medium">Total Trading Volume</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 group cursor-pointer sm:col-span-3 md:col-span-1">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 mb-2 group-hover:scale-110 transition-transform">
                98%
              </div>
              <div className="text-slate-400 text-xs md:text-sm font-medium">Success Rate</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-slate-800 animate-fade-in" style={{animationDelay: '0.8s'}}>
            <p className="text-sm text-slate-500 mb-4 uppercase tracking-wider font-semibold">Powered by Industry Leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Doma Protocol</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">XMTP Messaging</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 hover:text-pink-400 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Ethereum</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - clickable */}
      <a 
        href="#features" 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group"
        aria-label="Scroll to features section"
      >
        <div className="w-6 h-10 border-2 border-slate-600 group-hover:border-slate-400 rounded-full flex items-start justify-center p-2 transition-colors">
          <div className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
        </div>
      </a>
    </section>
  );
};