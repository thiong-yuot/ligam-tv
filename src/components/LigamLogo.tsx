import ligamLogoDark from "@/assets/ligam-logo-new.png";
import ligamLogoLight from "@/assets/ligam-logo-light.jpeg";
import { useTheme } from "@/hooks/useTheme";

const LigamLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  const { theme } = useTheme();
  return (
    <div className={`${className} overflow-hidden flex items-center justify-center`}>
      <img
        src={theme === "dark" ? ligamLogoDark : ligamLogoLight}
        alt="Ligam Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default LigamLogo;
