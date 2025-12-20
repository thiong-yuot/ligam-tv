import { Zap, Users, DollarSign, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Easy Setup",
    description: "Start streaming in seconds with our simple setup process",
  },
  {
    icon: Users,
    title: "Community",
    description: "Build loyal followers and engage with your audience",
  },
  {
    icon: DollarSign,
    title: "Monetization",
    description: "Multiple ways to earn from your streams",
  },
  {
    icon: Sparkles,
    title: "AI Tools",
    description: "Smart growth features to boost your channel",
  },
];

const WhyChooseLigam = () => {
  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Why Choose Ligam?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to build and grow your streaming community
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-xl p-6 hover-lift animate-fadeIn"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseLigam;
