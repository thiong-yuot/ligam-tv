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
    title: "Sub-Second Latency",
    description: "Chat feels live because it is. Under 500ms delay worldwide",
  },
  {
    icon: Users,
    title: "Real Chat, Real Tips",
    description: "Live chat with emotes, virtual gifts, and highlighted messages",
  },
  {
    icon: Wallet,
    title: "Five Revenue Streams",
    description: "Subscriptions, tips, shop, courses, and freelance — pick your mix",
  },
  {
    icon: ShieldCheck,
    title: "Fair Creator Split",
    description: "8–15% platform fee. You keep the rest. No hidden charges",
  },
  {
    icon: Globe2,
    title: "Global CDN",
    description: "Edge nodes on 6 continents for buffer-free streaming",
  },
  {
    icon: HeadphonesIcon,
    title: "Creator Support",
    description: "Email us and a human replies — usually within a few hours",
  },
  {
    icon: BarChart3,
    title: "Clear Analytics",
    description: "Revenue, watch time, and growth stats without the clutter",
  },
  {
    icon: BookOpen,
    title: "Sell Courses",
    description: "Upload lessons, set a price, and earn on autopilot",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-[1920px] mx-auto">
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
