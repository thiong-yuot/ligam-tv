import { Heart, Sparkles, Crown, Rocket } from "lucide-react";

interface HighlightedTipProps {
  senderName: string;
  giftName: string;
  giftIcon: string;
  amount: number;
  message?: string;
}

const giftIcons: Record<string, React.ElementType> = {
  heart: Heart,
  sparkle: Sparkles,
  crown: Crown,
  rocket: Rocket,
};

const giftColors: Record<string, string> = {
  heart: "from-pink-500/20 to-pink-600/20 border-pink-500/50",
  sparkle: "from-yellow-500/20 to-amber-500/20 border-yellow-500/50",
  crown: "from-amber-500/20 to-orange-500/20 border-amber-500/50",
  rocket: "from-primary/20 to-amber-500/20 border-primary/50",
};

const HighlightedTip = ({ senderName, giftName, giftIcon, amount, message }: HighlightedTipProps) => {
  const IconComponent = giftIcons[giftIcon] || Heart;
  const colorClass = giftColors[giftIcon] || giftColors.heart;

  return (
    <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClass} border animate-slideIn`}>
      <div className="flex items-center gap-2 mb-1">
        <IconComponent className="w-4 h-4" />
        <span className="font-semibold text-primary">{senderName}</span>
        <span className="text-muted-foreground text-sm">
          sent a {giftName} (${amount.toFixed(2)})
        </span>
      </div>
      {message && (
        <p className="text-foreground text-sm pl-6">{message}</p>
      )}
    </div>
  );
};

export default HighlightedTip;