import { useRef, useEffect, ReactNode, CSSProperties } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  style?: CSSProperties;
  onClick?: () => void;
  href?: string;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.5,
  style,
  onClick,
  href,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const inner = innerRef.current;
    if (!button || !inner) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(button, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: 'power3.out',
      });

      gsap.to(inner, {
        x: deltaX * 0.3,
        y: deltaY * 0.3,
        duration: 0.4,
        ease: 'power3.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)',
      });

      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  const content = (
    <div ref={innerRef} className="magnetic-inner">
      {children}
    </div>
  );

  if (href) {
    return (
      <div ref={buttonRef} className={`magnetic-button ${className}`} style={style}>
        <a href={href} className="magnetic-link">
          {content}
        </a>
      </div>
    );
  }

  return (
    <div
      ref={buttonRef}
      className={`magnetic-button ${className}`}
      style={style}
      onClick={onClick}
    >
      {content}
    </div>
  );
}
