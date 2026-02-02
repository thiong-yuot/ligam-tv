import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeaturedSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string | null;
  cta: string;
  badge: string;
  badgeIcon: React.ElementType;
  gradient: string;
}

const slides: FeaturedSlide[] = [
  {
    id: "1",
    title: "New Arrivals",
    subtitle: "Fresh Picks",
    description: "Discover the latest products from top sellers",
    image: null,
    cta: "Shop New",
    badge: "Just Landed",
    badgeIcon: Sparkles,
    gradient: "from-muted/50 to-transparent",
  },
  {
    id: "2",
    title: "Trending Now",
    subtitle: "Best Sellers",
    description: "See what everyone's buying this week",
    image: null,
    cta: "View Trending",
    badge: "Hot",
    badgeIcon: TrendingUp,
    gradient: "from-muted/50 to-transparent",
  },
  {
    id: "3",
    title: "Flash Sale",
    subtitle: "Up to 50% Off",
    description: "Limited time deals on popular items",
    image: null,
    cta: "Shop Deals",
    badge: "Sale",
    badgeIcon: Tag,
    gradient: "from-muted/50 to-transparent",
  },
];

const FeaturedCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];
  const BadgeIcon = slide.badgeIcon;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-card border border-border">
      {/* Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-r", slide.gradient)} />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between p-8 md:p-12 min-h-[240px]">
        <div className="max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-foreground text-sm font-medium mb-4">
            <BadgeIcon className="w-4 h-4 text-primary" />
            {slide.badge}
          </div>

          {/* Text */}
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
            {slide.subtitle}
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            {slide.title}
          </h2>
          <p className="text-muted-foreground mb-6">
            {slide.description}
          </p>

          {/* CTA */}
          <Button size="lg" className="glow-sm">
            {slide.cta}
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="hidden lg:flex items-center justify-center w-64 h-64">
          <div className="relative">
            <div className="relative w-48 h-48 rounded-2xl bg-muted border border-border flex items-center justify-center">
              <BadgeIcon className="w-20 h-20 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === currentSlide
                ? "w-6 bg-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
