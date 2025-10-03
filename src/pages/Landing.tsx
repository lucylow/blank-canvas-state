import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { EnhancedHeroSection } from '@/components/Landing/EnhancedHeroSection';
import { InteractiveFeaturesSection } from '@/components/Landing/InteractiveFeaturesSection';
import { LiveDomaIntegrationSection } from '@/components/Landing/LiveDomaIntegrationSection';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-foreground">
      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />

      {/* Interactive Features Showcase */}
      <InteractiveFeaturesSection />

      {/* Live Doma Integration & Real Data */}
      <LiveDomaIntegrationSection />

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Domains?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Join the DomainFi revolution and unlock the true value of your digital assets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-6 px-12 text-lg">
                🚀 Get Started Now
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="border-2 border-slate-600 text-slate-300 py-6 px-12 text-lg hover:bg-slate-800/50">
                📊 View Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <Logo size="md" showText={true} showTagline={false} variant="default" />
              <p className="text-slate-400 leading-relaxed">
                Transforming domain ownership through blockchain technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
              <ul className="space-y-3 text-slate-400">
                <li><Link to="/marketplace" className="hover:text-cyan-400 transition-colors">Marketplace</Link></li>
                <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Tokenization</Link></li>
                <li><Link to="/fractional" className="hover:text-cyan-400 transition-colors">Fractional Ownership</Link></li>
                <li><Link to="/analytics" className="hover:text-cyan-400 transition-colors">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
              <ul className="space-y-3 text-slate-400">
                <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Documentation</Link></li>
                <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Tutorials</Link></li>
                <li><Link to="/analytics" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
                <li><Link to="/marketplace" className="hover:text-cyan-400 transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-3 text-slate-400">
                <li><Link to="/help" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400">
              &copy; 2024 DomaLand.AI. Built for the Doma Hackathon with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
