import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function RouteProgress() {
  const isLoading = useRouterState({ select: (s) => s.isLoading || s.isTransitioning });
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isLoading) {
      setVisible(true);
      setWidth(15);
      timer = setTimeout(() => setWidth(70), 120);
    } else if (visible) {
      setWidth(100);
      timer = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 280);
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  if (!visible) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-gold via-gold-light to-gold transition-[width,opacity] duration-300 ease-out shadow-[0_0_8px_rgba(212,175,55,0.6)]"
        style={{ width: `${width}%`, opacity: width === 100 ? 0 : 1 }}
      />
    </div>
  );
}