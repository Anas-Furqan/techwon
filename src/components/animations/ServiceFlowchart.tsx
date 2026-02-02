import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';

interface FlowchartNode {
  id: string;
  label: string;
  x: number;
  y: number;
  description?: string;
}

interface FlowchartConnection {
  from: string;
  to: string;
}

interface ServiceFlowchartProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    nodes: FlowchartNode[];
    connections: FlowchartConnection[];
    description: string;
    color: string;
  };
}

export default function ServiceFlowchart({ isOpen, onClose, service }: ServiceFlowchartProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const overlay = overlayRef.current;
    const content = contentRef.current;
    const svg = svgRef.current;

    if (!overlay || !content || !svg) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Animate overlay
      tl.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      // Animate content panel (scale from center)
      tl.fromTo(
        content,
        {
          scale: 0.8,
          opacity: 0,
          y: 50,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        '-=0.2'
      );

      // Animate SVG paths (draw effect)
      const paths = svg.querySelectorAll('.flowchart-path');
      paths.forEach((path) => {
        const length = (path as SVGPathElement).getTotalLength?.() || 200;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      tl.to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power2.inOut',
        },
        '-=0.3'
      );

      // Animate nodes
      const nodes = svg.querySelectorAll('.flowchart-node');
      tl.fromTo(
        nodes,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(2)',
        },
        '-=0.8'
      );

      // Animate labels
      const labels = svg.querySelectorAll('.flowchart-label');
      tl.fromTo(
        labels,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.4'
      );
    });

    return () => ctx.revert();
  }, [isOpen]);

  const handleClose = () => {
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!overlay || !content) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(content, {
      scale: 0.9,
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: 'power2.in',
    });

    tl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.2,
      },
      '-=0.1'
    );
  };

  const getPathD = (from: FlowchartNode, to: FlowchartNode): string => {
    const startX = from.x + 80;
    const startY = from.y + 30;
    const endX = to.x;
    const endY = to.y + 30;
    
    // Create curved path
    const midX = (startX + endX) / 2;
    const controlOffset = Math.abs(endY - startY) * 0.5;
    
    if (Math.abs(endY - startY) < 10) {
      // Horizontal connection
      return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
    }
    
    // Curved connection
    return `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`;
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-auto glass-card p-8 rounded-2xl"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <span className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${service.color} text-primary-foreground text-sm font-medium mb-4`}>
            Service Workflow
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            {service.title}
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            {service.description}
          </p>
        </div>

        {/* Flowchart SVG */}
        <div className="relative w-full aspect-[16/9] min-h-[400px]">
          <svg
            ref={svgRef}
            viewBox="0 0 800 450"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--secondary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>

            {/* Connection Paths */}
            {service.connections.map((conn, index) => {
              const fromNode = service.nodes.find((n) => n.id === conn.from);
              const toNode = service.nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              return (
                <g key={`conn-${index}`}>
                  {/* Glow path */}
                  <path
                    d={getPathD(fromNode, toNode)}
                    fill="none"
                    stroke="url(#pathGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="flowchart-path opacity-30"
                    filter="url(#glow)"
                  />
                  {/* Main path */}
                  <path
                    d={getPathD(fromNode, toNode)}
                    fill="none"
                    stroke="url(#pathGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="flowchart-path"
                  />
                  {/* Arrow */}
                  <circle
                    cx={toNode.x - 5}
                    cy={toNode.y + 30}
                    r="4"
                    fill="hsl(var(--accent))"
                    className="flowchart-node"
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {service.nodes.map((node) => (
              <g
                key={node.id}
                className="flowchart-node cursor-pointer"
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                style={{ transformOrigin: `${node.x + 40}px ${node.y + 30}px` }}
              >
                {/* Node background glow */}
                <rect
                  x={node.x - 5}
                  y={node.y - 5}
                  width="170"
                  height="70"
                  rx="16"
                  fill="hsl(var(--primary))"
                  opacity={activeNode === node.id ? 0.2 : 0}
                  filter="url(#glow)"
                  className="transition-opacity duration-300"
                />
                {/* Node background */}
                <rect
                  x={node.x}
                  y={node.y}
                  width="160"
                  height="60"
                  rx="12"
                  fill="hsl(var(--background-card))"
                  stroke={activeNode === node.id ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
                {/* Node gradient overlay */}
                <rect
                  x={node.x}
                  y={node.y}
                  width="160"
                  height="60"
                  rx="12"
                  fill="url(#nodeGradient)"
                  opacity="0.1"
                />
                {/* Node label */}
                <text
                  x={node.x + 80}
                  y={node.y + 35}
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="13"
                  fontWeight="600"
                  fontFamily="Space Grotesk, sans-serif"
                  className="flowchart-label pointer-events-none"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Node Description */}
        <div className="mt-6 min-h-[60px]">
          {activeNode && (
            <div className="text-center animate-fade-in">
              <p className="text-foreground-secondary">
                {service.nodes.find((n) => n.id === activeNode)?.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
