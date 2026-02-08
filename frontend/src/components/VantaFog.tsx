import React, { useEffect, useRef } from 'react';

interface VantaFogProps {
  className?: string;
}

const VantaFog: React.FC<VantaFogProps> = ({ className = '' }) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    const initVanta = () => {
      if (vantaRef.current && (window as any).VANTA && !vantaEffect.current) {
        vantaEffect.current = (window as any).VANTA.FOG({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: 0x0,
          midtoneColor: 0x0,
          lowlightColor: 0x20007,
          baseColor: 0xff5c03,
          THREE: (window as any).THREE,
        });
      }
    };

    const timer = setTimeout(initVanta, 100);

    return () => {
      clearTimeout(timer);
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return <div ref={vantaRef} className={`absolute inset-0 z-0 ${className}`} />;
};

export default VantaFog;
