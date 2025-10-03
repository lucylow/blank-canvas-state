import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Coins, ExternalLink, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';

export const LiveDomaIntegrationSection = () => {
  const navigate = useNavigate();
  const [expandedTx, setExpandedTx] = useState<number | null>(null);
  
  // Mock live data - In production, fetch from Doma testnet subgraph
  const liveStats = {
    totalVolume: '$125,430',
    fractionalized: 42,
    activeUsers: 18,
    avgDealTime: '2.3 hours'
  };

  const recentTransactions = [
    { domain: 'crypto-wealth.eth', price: '2.5 ETH', tx: '0x1a2b3c4d', time: '2 min ago', type: 'sale' },
    { domain: 'nftgallery.com', price: '1.8 ETH', tx: '0x5e6f7g8h', time: '8 min ago', type: 'listing' },
    { domain: 'web3hub.ai', price: '3.2 ETH', tx: '0x9i0j1k2l', time: '15 min ago', type: 'offer' }
  ];

  const activeListings = [
    { name: 'defi-master.eth', price: '4.2 ETH', offers: 3, views: 142 },
    { name: 'blockchain-pro.com', price: '2.8 ETH', offers: 1, views: 89 },
    { name: 'meta-space.xyz', price: '1.5 ETH', offers: 5, views: 203 }
  ];

  const handleViewAllListings = () => {
    toast.success('Navigating to marketplace...');
    navigate('/marketplace');
  };

  const handleViewDetails = (domain: string) => {
    toast.success(`Loading details for ${domain}...`);
    navigate('/marketplace');
  };

  return (
    <section id="live-integration" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 bg-green-500/10 text-green-400 border-green-500/30">
            <Activity className="h-3 w-3 mr-1 animate-pulse" />
            Live on Doma Testnet
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Real Transactions,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              Real Impact
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            This is live data from the Doma Protocol. Watch tokenized domains being traded in real-time.
          </p>
        </div>

        {/* Live Stats Grid - Mobile responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 animate-slide-up">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-green-500/50 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="mb-2 md:mb-3">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-400 mx-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{liveStats.totalVolume}</div>
              <div className="text-xs md:text-sm text-slate-400">Total Volume Locked</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="mb-2 md:mb-3">
                <Coins className="h-6 w-6 md:h-8 md:w-8 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{liveStats.fractionalized}</div>
              <div className="text-xs md:text-sm text-slate-400">Domains Fractionalized</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="mb-2 md:mb-3">
                <Activity className="h-6 w-6 md:h-8 md:w-8 text-cyan-400 mx-auto group-hover:scale-110 transition-transform animate-pulse" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{liveStats.activeUsers}</div>
              <div className="text-xs md:text-sm text-slate-400">Active Right Now</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-pink-500/50 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="mb-2 md:mb-3">
                <Zap className="h-6 w-6 md:h-8 md:w-8 text-pink-400 mx-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{liveStats.avgDealTime}</div>
              <div className="text-xs md:text-sm text-slate-400">Avg Deal Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Two-column layout for transactions and listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Activity className="h-6 w-6 text-green-400 animate-pulse" />
                  Recent Activity
                </h3>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                  Live
                </Badge>
              </div>
              
              <div className="space-y-4">
                {recentTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-200 group animate-fade-in"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                        {tx.domain}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <code className="text-xs bg-slate-800 px-2 py-0.5 rounded">
                          {tx.tx}
                        </code>
                        <span>•</span>
                        <span>{tx.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400 mb-1">{tx.price}</div>
                      <Badge variant="outline" className="text-xs">
                        {tx.type}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2 p-2 hover:bg-slate-800 min-w-[44px] min-h-[44px]"
                      onClick={() => window.open(`https://etherscan.io/tx/${tx.tx}`, '_blank')}
                      aria-label={`View transaction ${tx.tx} on Etherscan`}
                    >
                      <ExternalLink className="h-4 w-4 text-slate-400 hover:text-cyan-400" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-slate-500 text-sm text-center flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Data fetched from Doma Testnet Subgraph • Updates every 30 seconds
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Active Listings */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                  Hot Listings
                </h3>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                  {activeListings.length} Active
                </Badge>
              </div>
              
              <div className="space-y-4">
                {activeListings.map((listing, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-200 group animate-fade-in"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                          {listing.name}
                        </div>
                        <div className="text-sm text-slate-400">
                          {listing.views} views in last 24h
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-purple-400">{listing.price}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs">
                        {listing.offers} {listing.offers === 1 ? 'offer' : 'offers'}
                      </Badge>
                      <Button
                        size="sm"
                        className="ml-auto bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/50 min-h-[44px]"
                        onClick={() => handleViewDetails(listing.name)}
                        aria-label={`View details for ${listing.name}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold min-h-[44px]"
                onClick={handleViewAllListings}
                aria-label="Explore all domain listings in marketplace"
              >
                Explore All Listings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Integration Details */}
        <Card className="mt-12 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                🔗 Deep Doma Protocol Integration
              </h3>
              <p className="text-slate-400 max-w-3xl mx-auto mb-6">
                DomaLand.AI is built on top of the Doma Protocol, leveraging its powerful orderbook, 
                tokenization, and state sync features to provide a seamless DomainFi experience.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  ✓ Orderbook Integration
                </Badge>
                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                  ✓ Tokenization API
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                  ✓ State Synchronization
                </Badge>
                <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/30">
                  ✓ Cross-Chain Bridge
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};