import { Shield, CheckCircle, AlertTriangle, TrendingUp, Code, Zap, Users } from 'lucide-react';

const Index = () => {
  const stats = [
    { icon: CheckCircle, label: 'Baseline Compliance', value: '84%', trend: '+12%', trendUp: true },
    { icon: AlertTriangle, label: 'Active Issues', value: '23', trend: '-5%', trendUp: false },
    { icon: TrendingUp, label: 'Browser Coverage', value: '96%', trend: '+3%', trendUp: true },
  ];

  const features = [
    { icon: Code, title: 'Smart Analysis', description: 'Automated compatibility scanning across all major browsers and frameworks' },
    { icon: Zap, title: 'Auto-Fix Issues', description: 'One-click fixes for common compatibility problems with intelligent suggestions' },
    { icon: Users, title: 'Team Collaboration', description: 'Share insights and track progress with your entire development team' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 rounded-2xl shadow-xl">
                  <Shield className="w-16 h-16 text-primary-foreground" strokeWidth={1.5} />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl sm:text-7xl font-bold text-foreground tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
                CompatGuard
              </span>
            </h1>
            
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Web Compatibility Intelligence Platform
            </p>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ensure your web applications work flawlessly across all browsers and frameworks. 
              Detect issues early, fix them fast, and ship with confidence.
            </p>
            
            <div className="flex gap-4 justify-center pt-6">
              <button className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start Free Trial
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="px-8 py-4 bg-card text-card-foreground border border-border rounded-xl font-semibold hover:bg-muted transition-all duration-300 hover:scale-105">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-4 rounded-xl ${
                    index === 0 ? 'bg-primary/10 text-primary' :
                    index === 1 ? 'bg-accent/10 text-accent' :
                    'bg-secondary/10 text-secondary'
                  }`}>
                    <Icon className="w-8 h-8" strokeWidth={2} />
                  </div>
                  <span className={`text-sm font-semibold ${stat.trendUp ? 'text-secondary' : 'text-destructive'}`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to maintain perfect cross-browser compatibility
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="mb-6 inline-block p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-primary" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-primary via-purple-600 to-secondary rounded-3xl p-12 shadow-2xl text-center space-y-6 animate-fade-in">
          <h2 className="text-4xl font-bold text-primary-foreground">
            Ready to Ship Bug-Free Code?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of developers who trust CompatGuard to keep their applications compatible across all platforms.
          </p>
          <div className="pt-4">
            <button className="px-10 py-5 bg-white text-primary rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
