import { 
  Zap, 
  Wallet, 
  ShieldCheck, 
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "More Than Streaming",
    description: "Stream, sell, teach, or just watch—Ligam fits your goals, not the other way around",
  },
  {
    icon: Wallet,
    title: "Multiple Income Paths",
    description: "Subscriptions, tips, shop, courses, and freelance—choose what works for you",
  },
  {
    icon: ShieldCheck,
    title: "Fair Revenue Split",
    description: "Keep 85-92% of earnings. No hidden fees or surprise deductions",
  },
  {
    icon: BarChart3,
    title: "Discover New Talent",
    description: "Find emerging creators the algorithms hide from you elsewhere",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-[1920px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Built for All Creators
          </h2>
          <p className="text-lg text-muted-foreground">
            Streamers, teachers, sellers, freelancers, and viewers—Ligam.tv 
            welcomes everyone with tools that work for you
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 bg-card border border-border rounded-2xl hover:border-muted-foreground/30 transition-all hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
