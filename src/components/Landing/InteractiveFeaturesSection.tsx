import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Coins, Zap, MessageSquare, BarChart3, Shield, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  demoText: string;
  benefit: string;
  color: string;
}

export const InteractiveFeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState<string>('ai-valuation');
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const navigate = useNavigate();

  const features: Feature[] = [
    {
      id: 'ai-valuation',
      title: 'AI Domain Valuation',
      description: 'Our advanced AI engine analyzes market trends, comparable sales, keyword value, and traffic metrics to provide real-time, accurate domain valuations.',
      icon: <Brain className="h-6 w-6" />,
      demoText: 'Analyzing web3pro.eth...\n✓ Keyword Score: 95/100\n✓ Market Demand: High\n✓ Estimated Value: 12.5 ETH\n✓ Confidence: 94%',
      benefit: 'Data-driven pricing',
      color: 'cyan'
    },
    {
      id: 'fractionalize',
      title: 'One-Click Fractionalization',
      description: 'Transform any domain NFT into liquid, tradable ERC-20 tokens instantly. Enable collective ownership and unlock domain liquidity.',
      icon: <Coins className="h-6 w-6" />,
      demoText: 'Creating fractional shares for web3pro.eth...\n✓ Total Supply: 10,000 tokens\n✓ Your Share: 100%\n✓ Minimum Purchase: 10 tokens\n✓ Status: Ready to Trade',
      benefit: 'Instant liquidity',
      color: 'purple'
    },
    {
      id: 'instant-pages',
      title: 'Automated Landing Pages',
      description: 'Each tokenized domain automatically generates a beautiful, SEO-optimized landing page with integrated marketplace features.',
      icon: <Zap className="h-6 w-6" />,
      demoText: 'Generating page for web3pro.eth...\n✓ Landing page created\n✓ SEO metadata optimized\n✓ Marketplace integration live\n✓ URL: web3pro.domaland.xyz',
      benefit: 'Instant web presence',
      color: 'pink'
    },
    {
      id: 'messaging',
      title: 'Secure On-Chain Messaging',
      description: 'Built-in XMTP messaging enables direct, encrypted communication between buyers and sellers without exposing personal information.',
      icon: <MessageSquare className="h-6 w-6" />,
      demoText: 'Initializing secure channel...\n✓ Encrypted connection established\n✓ Identity verified on-chain\n✓ Ready for negotiation\n✓ Zero email exposure',
      benefit: 'Private negotiations',
      color: 'green'
    }
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature) || features[0];

  const handleTryDemo = () => {
    setIsRunningDemo(true);
    toast.success(`Running ${activeFeatureData.title} demo...`);
    
    setTimeout(() => {
      setIsRunningDemo(false);
      toast.success('Demo completed! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1000);
    }, 2000);
  };

  const handleLearnMore = () => {
    const section = activeFeature === 'ai-valuation' ? 'valuation' : 
                   activeFeature === 'fractionalize' ? 'fractional' :
                   activeFeature === 'instant-pages' ? 'pages' : 'messaging';
    navigate(`/help#${section}`);
  };

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Innovation Showcase
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Powerful Web3 Domain Tools
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Experience the future of domain management with our integrated suite of AI and blockchain tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-7xl mx-auto">
          {/* Feature Selector - Mobile optimized */}
          <div className="space-y-3 md:space-y-4">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 ${
                  activeFeature === feature.id
                    ? `bg-gradient-to-br from-${feature.color}-500/20 to-${feature.color}-600/10 border-${feature.color}-500/50 shadow-lg shadow-${feature.color}-500/20`
                    : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
                onClick={() => setActiveFeature(feature.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveFeature(feature.id)}
                aria-label={`Select ${feature.title} feature`}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      activeFeature === feature.id
                        ? `bg-${feature.color}-500/20 text-${feature.color}-400`
                        : 'bg-slate-700/50 text-slate-400'
                    } transition-colors duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 flex items-center gap-2">
                        {feature.title}
                        {activeFeature === feature.id && (
                          <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-cyan-400 animate-pulse" />
                        )}
                      </h3>
                      <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-3">
                        {feature.description}
                      </p>
                      <Badge variant="outline" className={`${
                        activeFeature === feature.id
                          ? `bg-${feature.color}-500/20 text-${feature.color}-400 border-${feature.color}-500/50`
                          : 'bg-slate-700/30 text-slate-400 border-slate-600'
                      }`}>
                        {feature.benefit}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Live Demo Preview */}
          <div className="sticky top-8">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Live Preview</h3>
                  <Badge className={`bg-${activeFeatureData.color}-500/20 text-${activeFeatureData.color}-400 border-${activeFeatureData.color}-500/50`}>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    Active
                  </Badge>
                </div>

                {/* Terminal-style demo output */}
                <div className="bg-slate-950 rounded-xl p-6 mb-6 font-mono text-sm border border-slate-800">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-slate-500 text-xs ml-2">
                      domaland-ai-demo
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className={`text-${activeFeatureData.color}-400 flex items-center gap-2`}>
                      <span className="animate-pulse">▸</span>
                      // {activeFeatureData.title} Demo
                    </p>
                    <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {activeFeatureData.demoText}
                    </pre>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className={`flex-1 bg-gradient-to-r from-${activeFeatureData.color}-500 to-${activeFeatureData.color}-600 hover:from-${activeFeatureData.color}-600 hover:to-${activeFeatureData.color}-700 text-white font-semibold transition-all duration-200 min-h-[44px]`}
                    onClick={handleTryDemo}
                    disabled={isRunningDemo}
                    aria-label={`Try ${activeFeatureData.title} live demo`}
                  >
                    {isRunningDemo ? 'Running...' : 'Try Live Demo'}
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-slate-600 hover:border-slate-500 text-slate-300 min-h-[44px]"
                    onClick={handleLearnMore}
                    aria-label={`Learn more about ${activeFeatureData.title}`}
                  >
                    Learn More
                  </Button>
                </div>

                {/* Integration Badge */}
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span>Powered by Doma Protocol smart contracts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};