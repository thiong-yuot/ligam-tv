import { Zap, Users, DollarSign, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "One Platform, Many Paths",
    description: "Stream live, sell products, teach courses, or offer services—all in one place",
  },
  {
    icon: Users,
    title: "Built for All",
    description: "Whether you create or consume, stream or shop, teach or learn—you belong here",
  },
  {
    icon: DollarSign,
    title: "Fair Revenue for All",
    description: "Keep 85-92% of your earnings. Weekly payouts. No hidden fees",
  },
  {
    icon: Clock,
    title: "Productivity Built In",
    description: "Eelai AI, news, weather, and tools that help everyone get things done",
  },
];

const WhyChooseLigam = () => {
  return (
    <section id="why-ligam" className="py-20 px-4 bg-card/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Why We Built Ligam.tv
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A platform built for all—where creators, viewers, and learners thrive together
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
