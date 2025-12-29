import { 
  Zap, 
  Users, 
  DollarSign, 
  Shield, 
  Globe, 
  Headphones,
  TrendingUp,
  Award
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Ultra-low latency streaming with global CDN delivery",
    gradient: "from-yellow-500/20 to-orange-500/10",
    iconColor: "text-yellow-500",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Build engaged audiences with interactive chat features",
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: DollarSign,
    title: "Multiple Revenue",
    description: "Subscriptions, tips, merchandise, and freelance services",
    gradient: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Enterprise-grade security for creators and viewers",
    gradient: "from-purple-500/20 to-pink-500/10",
    iconColor: "text-purple-500",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Stream to audiences worldwide with auto-translation",
    gradient: "from-indigo-500/20 to-blue-500/10",
    iconColor: "text-indigo-500",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated creator support team available anytime",
    gradient: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description: "Deep insights into your audience and performance",
    gradient: "from-cyan-500/20 to-teal-500/10",
    iconColor: "text-cyan-500",
  },
  {
    icon: Award,
    title: "Creator Rewards",
    description: "Earn badges, perks, and exclusive opportunities",
    gradient: "from-amber-500/20 to-yellow-500/10",
    iconColor: "text-amber-500",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools and features designed to help creators build, grow, and monetize their passion
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
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.iconColor}`}>
                  <feature.icon className="w-6 h-6" />
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
