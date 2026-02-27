import { useEffect } from "react";
import ligamLogoDark from "@/assets/ligam-logo-new.png";
import ligamLogoLight from "@/assets/ligam-logo-light.jpeg";
import { useTheme } from "@/hooks/useTheme";

// Preload both logos so switching is instant
const preloadImages = [ligamLogoDark, ligamLogoLight];
preloadImages.forEach((src) => {
  const img = new Image();
  img.src = src;
});

const LigamLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? ligamLogoDark : ligamLogoLight;

  return (
    <div className={`${className} overflow-hidden flex items-center justify-center`}>
      <img
        key={theme}
        src={logoSrc}
        alt="Ligam Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default LigamLogo;
