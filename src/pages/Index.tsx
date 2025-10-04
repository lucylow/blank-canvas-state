const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-foreground animate-fade-in">
          Welcome to CompatGuard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your new React application is ready. Start building something amazing!
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Get Started
          </button>
          <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
