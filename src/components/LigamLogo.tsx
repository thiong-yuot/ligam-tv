import ligamLogo from "@/assets/ligam-logo.png";

const LigamLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`${className} bg-[hsl(220,20%,8%)] rounded-lg overflow-hidden flex items-center justify-center p-0.5`}>
      <img
        src={ligamLogo}
        alt="Ligam Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default LigamLogo;
