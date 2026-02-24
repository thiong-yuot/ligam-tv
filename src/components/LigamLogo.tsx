import ligamLogo from "@/assets/ligam-logo-new.png";

const LigamLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`${className} overflow-hidden flex items-center justify-center bg-transparent`}>
      <img
        src={ligamLogo}
        alt="Ligam Logo"
        className="w-full h-full object-contain dark:invert-0 invert"
      />
    </div>
  );
};

export default LigamLogo;
