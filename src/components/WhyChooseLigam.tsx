import { Zap, Users, DollarSign, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Start in Minutes",
    description: "Stream, upload courses, list products, or offer services—no complicated setup",
  },
  {
    icon: Users,
    title: "For Everyone",
    description: "Creators, viewers, teachers, sellers—Ligam is built for all, not just streamers",
  },
  {
    icon: DollarSign,
    title: "Earn Your Way",
    description: "Weekly payouts. Keep 85-92% whether you stream, sell, teach, or freelance",
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "Enterprise infrastructure with productivity tools like Eelai AI built in",
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
            Because not everyone wants to be a streamer—but everyone deserves a platform that works for them
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
