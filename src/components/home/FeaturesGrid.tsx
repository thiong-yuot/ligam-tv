import { 
  Zap, 
  Users, 
  Wallet, 
  ShieldCheck, 
  Globe2, 
  HeadphonesIcon,
  BarChart3,
  BookOpen
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fair Discovery System",
    description: "Every creator gets visibility. No algorithm gatekeeping your content",
  },
  {
    icon: Users,
    title: "Decentralized Growth",
    description: "Build your audience without depending on platform algorithms",
  },
  {
    icon: Wallet,
    title: "Five Revenue Streams",
    description: "Subscriptions, tips, shop, courses, and freelance — own your income",
  },
  {
    icon: ShieldCheck,
    title: "Creator-First Split",
    description: "Keep 85-92% of earnings. No hidden fees or surprise deductions",
  },
  {
    icon: Globe2,
    title: "Global Infrastructure",
    description: "Enterprise-grade streaming with edge nodes on 6 continents",
  },
  {
    icon: HeadphonesIcon,
    title: "Real Support",
    description: "Humans who reply in hours, not bots who ignore you",
  },
  {
    icon: BarChart3,
    title: "Transparent Analytics",
    description: "See exactly how you're growing without vanity metrics",
  },
  {
    icon: BookOpen,
    title: "Teach & Earn",
    description: "Sell courses, offer services, and monetize your expertise",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-[1920px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Built for Creator Independence
          </h2>
          <p className="text-lg text-muted-foreground">
            Unlike platforms that favor established creators, we give every voice equal 
            opportunity to be discovered and grow
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
