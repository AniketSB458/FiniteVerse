import React, { useMemo } from 'react';
import { motion } from 'motion/react';

type Node = {
  id: string;
  label: string;
  isAccept: boolean;
  isStart: boolean;
  x?: number;
  y?: number;
};

type Edge = {
  from: string;
  to: string;
  symbols: string[];
};

type GraphProps = {
  nodes: Node[];
  edges: Edge[];
  highlightedNodeIds?: string[];
  width?: number;
  height?: number;
};

export function GraphCanvas({ nodes, edges, highlightedNodeIds = [] }: GraphProps) {
  const width = 500;
  const height = 500;
  const radius = Math.min(width, height) / 3.2;
  const cx = width / 2;
  const cy = height / 2;

  // Compute node positions on a circle if not provided
  const positionedNodes = useMemo(() => {
    return nodes.map((n, i) => {
      if (n.x !== undefined && n.y !== undefined) return n;
      const angle = (Math.PI * 2 * i) / (nodes.length || 1) - Math.PI / 2;
      return {
        ...n,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  }, [nodes, cx, cy, radius]);

  const getNode = (id: string) => positionedNodes.find(n => n.id === id);

  const edgePaths = useMemo(() => {
    return edges.map(e => {
      const source = getNode(e.from);
      const target = getNode(e.to);
      if (!source || !target) return null;

      const sx = source.x!;
      const sy = source.y!;
      const tx = target.x!;
      const ty = target.y!;

      let d = '';
      let textX = 0;
      let textY = 0;

      if (e.from === e.to) {
        // Self loop
        const cp1x = sx - 35;
        const cp1y = sy - 70;
        const cp2x = sx + 35;
        const cp2y = sy - 70;
        d = `M ${sx - 10} ${sy - 15} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${sx + 10} ${sy - 15}`;
        textX = sx;
        textY = sy - 60;
      } else {
        // Check for bidirectional edge to curve
        const isBidirectional = edges.some(other => other.from === e.to && other.to === e.from);
        
        if (isBidirectional) {
          const dx = tx - sx;
          const dy = ty - sy;
          const midX = (sx + tx) / 2;
          const midY = (sy + ty) / 2;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;
          const offset = 30; // curve offset
          const cx = midX + nx * offset;
          const cy = midY + ny * offset;
          
          d = `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
          textX = cx + nx * 10;
          textY = cy + ny * 10;
        } else {
          // Straight line
          d = `M ${sx} ${sy} L ${tx} ${ty}`;
          textX = (sx + tx) / 2;
          textY = (sy + ty) / 2 - 10;
        }
      }

      return { ...e, d, textX, textY, isBidirectional: e.from !== e.to && edges.some(other => other.from === e.to && other.to === e.from) };
    }).filter(Boolean);
  }, [edges, positionedNodes]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="23" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--edge-base)" />
          </marker>
          <marker id="arrow-highlight" viewBox="0 0 10 10" refX="23" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--edge-active)" />
          </marker>
        </defs>

        {edgePaths.map((ep, i) => {
          if (!ep) return null;
          const isHighlighted = highlightedNodeIds.includes(ep.from) || highlightedNodeIds.includes(ep.to);
          return (
            <g key={`edge-${i}`}>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                d={ep.d}
                fill="none"
                stroke={isHighlighted ? "var(--edge-active)" : "var(--edge-base)"}
                strokeWidth={isHighlighted ? 3 : 2}
                markerEnd={isHighlighted ? "url(#arrow-highlight)" : "url(#arrow)"}
                className="transition-colors duration-300"
              />
              <motion.text
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x={ep.textX}
                y={ep.textY}
                fill={isHighlighted ? "var(--edge-active)" : "var(--text-muted)"}
                fontSize="14"
                fontWeight="500"
                textAnchor="middle"
                className="select-none font-mono"
              >
                {ep.symbols.join(', ')}
              </motion.text>
            </g>
          );
        })}

        {positionedNodes.map(n => {
          const isHighlighted = highlightedNodeIds.includes(n.id);
          return (
            <motion.g 
              key={n.id} 
              initial={{ x: cx, y: cy, opacity: 0 }}
              animate={{ x: n.x, y: n.y, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              {n.isAccept && (
                <circle r="25" fill="none" stroke={isHighlighted ? "var(--accent-alt)" : "var(--edge-base)"} strokeWidth="2" className="transition-colors duration-300" />
              )}
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                r="20"
                fill="var(--node-bg)"
                stroke={isHighlighted ? (n.isAccept ? "var(--accent-alt)" : "var(--edge-active)") : "var(--edge-base)"}
                strokeWidth={isHighlighted ? "3" : "2"}
                className="transition-colors duration-300 shadow-sm drop-shadow-md"
              />
              <text y="5" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--text-main)" className="select-none pointer-events-none transition-colors duration-300">
                {n.label}
              </text>
              {n.isStart && (
                <path d="M -45 0 L -25 0" stroke="var(--edge-base)" strokeWidth="2" markerEnd="url(#arrow)" className="transition-colors duration-300" />
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
