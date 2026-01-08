import { Heart, Sparkles, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const gifts = [
  { icon: Heart, name: "Heart", price: "$1", color: "text-pink-500" },
  { icon: Sparkles, name: "Sparkle", price: "$5", color: "text-yellow-500" },
  { icon: Crown, name: "Crown", price: "$10", color: "text-amber-500" },
  { icon: Rocket, name: "Rocket", price: "$20", color: "text-primary" },
];

const VirtualGifts = () => {
  return (
    <section id="virtual-gifts" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Support Your Favorite Creators
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Send virtual gifts during streams to show your support. Creators earn from gifts while viewers get exclusive perks.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Multiple gift options at different price points
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Instant delivery and creator notifications
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Exclusive badges for top supporters
              </li>
            </ul>

            <Link to="/shop">
              <Button variant="default" size="lg">
                Buy Gift Packs
              </Button>
            </Link>
          </div>

          {/* Right - Gift Cards */}
          <div className="grid grid-cols-2 gap-4">
            {gifts.map((gift, index) => (
              <div
                key={gift.name}
                className="bg-card border border-border rounded-xl p-6 text-center hover-lift cursor-pointer animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center ${gift.color}`}>
                  <gift.icon className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-1">
                  {gift.name}
                </h3>
                <p className="text-primary font-bold text-xl">{gift.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualGifts;
