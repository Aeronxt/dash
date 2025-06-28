import { useEffect, useRef } from "react";
import "./Iridescence.css";

interface IridescenceProps {
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

export default function Iridescence({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  ...rest
}: IridescenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Set CSS custom properties for dynamic control
    container.style.setProperty('--speed', speed.toString());
    container.style.setProperty('--amplitude', amplitude.toString());
    container.style.setProperty('--color-r', color[0].toString());
    container.style.setProperty('--color-g', color[1].toString());
    container.style.setProperty('--color-b', color[2].toString());

    let mouseX = 0.5;
    let mouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseReact) return;
      
      const rect = container.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
      
      container.style.setProperty('--mouse-x', mouseX.toString());
      container.style.setProperty('--mouse-y', mouseY.toString());
    };

    if (mouseReact) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (mouseReact) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [color, speed, amplitude, mouseReact]);

  return (
    <div
      ref={containerRef}
      className="iridescence-container"
      {...rest}
    >
      <div className="iridescence-gradient"></div>
      <div className="iridescence-overlay"></div>
    </div>
  );
} 