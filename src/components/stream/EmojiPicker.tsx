import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJI_CATEGORIES = [
  {
    label: "Smileys",
    emojis: ["😀", "😂", "🤣", "😊", "😍", "🥰", "😘", "😎", "🤩", "😏", "🤔", "😐", "🙄", "😴", "🤯", "😱", "🥳", "😈", "👻", "💀"],
  },
  {
    label: "Reactions",
    emojis: ["👍", "👎", "👏", "🔥", "❤️", "💯", "⭐", "🎉", "🏆", "💎", "🚀", "💪", "🙌", "🤝", "✌️", "👀", "💡", "⚡", "🎯", "🫡"],
  },
  {
    label: "Fun",
    emojis: ["🎮", "🎵", "🎧", "📸", "🍕", "🍿", "☕", "🎬", "🖥️", "💻", "⌨️", "🕹️", "📱", "🎸", "🎤", "🏅", "🌟", "🔮", "🃏", "🎲"],
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
          <Smile className="w-4 h-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-72 p-0 border-border bg-card"
        sideOffset={8}
      >
        {/* Category tabs */}
        <div className="flex border-b border-border px-2 pt-2 gap-1">
          {EMOJI_CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(i)}
              className={cn(
                "text-xs px-2 py-1 rounded-t font-medium transition-colors",
                activeCategory === i
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Emoji grid */}
        <div className="p-2 grid grid-cols-10 gap-0.5 max-h-40 overflow-y-auto">
          {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onEmojiSelect(emoji);
                setOpen(false);
              }}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-secondary transition-colors text-base cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
