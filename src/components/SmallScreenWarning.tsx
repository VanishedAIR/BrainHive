"use client";

import { useEffect, useState } from "react";

interface SmallScreenWarningProps {
  children: React.ReactNode;
}

export function SmallScreenWarning({ children }: SmallScreenWarningProps) {
  const [isVerySmallScreen, setIsVerySmallScreen] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    const checkScreenSize = () => {
      setIsVerySmallScreen(window.innerWidth < 360);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Return null during initial render to prevent flash
  if (isVerySmallScreen === null) return null;

  if (isVerySmallScreen) {
    return (
      <div className="fixed inset-0 bg-card z-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-bold text-primary">Screen Too Small</h2>
          <p className="text-muted-foreground">
            Your screen is too small to properly view this application.
          </p>
          <div className="w-full h-1 bg-primary/20 rounded-full overflow-hidden">
            <div className="h-full w-[360px] bg-primary scale-x-[30%] origin-left"></div>
          </div>
          <p className="text-sm text-muted-foreground">Minimum width: 360px</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
