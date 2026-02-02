const HighlightedTip = ({ senderName, giftName, giftIcon, amount, message }) => {
  return (
    <div className="p-3 rounded-lg bg-gradient-to-r from-primary/20 to-amber-500/20 border border-primary/50 animate-slideIn">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{giftIcon}</span>
        <span className="font-semibold text-primary">{senderName}</span>
        <span className="text-muted-foreground text-sm">
          sent a {giftName} (${amount.toFixed(2)})
        </span>
      </div>
      {message && (
        <p className="text-foreground text-sm pl-7">{message}</p>
      )}
    </div>
  );
};

export default HighlightedTip;
