import ligamLogo from "@/assets/ligam-logo.png";

const LigamLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <img
      src={ligamLogo}
      alt="Ligam Logo"
      className={className}
    />
  );
};

export default LigamLogo;
