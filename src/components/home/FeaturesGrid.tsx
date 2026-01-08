import { 
  Zap, 
  Users, 
  DollarSign, 
  Shield, 
  Globe, 
  Headphones,
  TrendingUp,
  GraduationCap
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Sub-Second Latency",
    description: "Chat feels live because it is. Under 500ms delay worldwide",
    gradient: "from-yellow-500/20 to-orange-500/10",
    iconColor: "text-yellow-500",
  },
  {
    icon: Users,
    title: "Real Chat, Real Tips",
    description: "Live chat with emotes, virtual gifts, and highlighted messages",
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: DollarSign,
    title: "Five Revenue Streams",
    description: "Subscriptions, tips, shop, courses, and freelance — pick your mix",
    gradient: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: Shield,
    title: "Fair Creator Split",
    description: "8–15% platform fee. You keep the rest. No hidden charges",
    gradient: "from-primary/20 to-sky-500/10",
    iconColor: "text-primary",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Edge nodes on 6 continents for buffer-free streaming",
    gradient: "from-indigo-500/20 to-blue-500/10",
    iconColor: "text-indigo-500",
  },
  {
    icon: Headphones,
    title: "Creator Support",
    description: "Email us and a human replies — usually within a few hours",
    gradient: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Clear Analytics",
    description: "Revenue, watch time, and growth stats without the clutter",
    gradient: "from-cyan-500/20 to-teal-500/10",
    iconColor: "text-cyan-500",
  },
  {
    icon: GraduationCap,
    title: "Sell Courses",
    description: "Upload lessons, set a price, and earn on autopilot",
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
            One Place to Do It All
          </h2>
          <p className="text-lg text-muted-foreground">
            Stream, sell, teach, and freelance — without juggling a dozen different tools
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
