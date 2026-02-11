import React, { useEffect, useRef, useCallback } from 'react';

interface VantaFogProps {
  className?: string;
}

const VantaFog: React.FC<VantaFogProps> = ({ className = '' }) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  const initVanta = useCallback(() => {
    if (vantaRef.current && (window as any).VANTA && !vantaEffect.current) {
      try {
        vantaEffect.current = (window as any).VANTA.FOG({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: 0x585858,
          midtoneColor: 0x2a2a2a,
          lowlightColor: 0x111111,
          baseColor: 0x0a0a0a,
          blurFactor: 0.7,
          speed: 0.8,
          zoom: 0.6,
          THREE: (window as any).THREE,
        });
      } catch (e) {
        console.warn('[VantaFog] Init failed:', e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(initVanta, 100);

    // Handle resize to prevent Vanta from breaking when window changes
    const handleResize = () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.resize();
        } catch {
          // If resize fails, recreate the effect
          try {
            vantaEffect.current.destroy();
          } catch { /* ignore */ }
          vantaEffect.current = null;
          setTimeout(initVanta, 50);
        }
      }
    };

    // Handle visibility change - reinit if tab becomes visible again
    const handleVisibility = () => {
      if (!document.hidden && !vantaEffect.current) {
        initVanta();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch { /* ignore */ }
        vantaEffect.current = null;
      }
    };
  }, [initVanta]);

  return (
    <div
      ref={vantaRef}
      className={`fixed inset-0 z-0 opacity-80 pointer-events-none ${className}`}
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default VantaFog;
