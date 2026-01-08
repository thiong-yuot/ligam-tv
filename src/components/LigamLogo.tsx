import ligamLogo from "@/assets/ligam-logo.png";

const LigamLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`${className} bg-transparent rounded-lg overflow-hidden flex items-center justify-center`}>
      <img
        src={ligamLogo}
        alt="Ligam Logo"
        className="w-full h-full object-contain"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

export default LigamLogo;
