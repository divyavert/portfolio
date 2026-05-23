'use client';

import { useRef } from 'react';
import type { Skill } from '@/lib/sanity/types';
import { 
  Code2, Database, Server,
  // Frontend
  Layout, Smartphone, Globe, Palette,
  // Backend  
  CloudCog, Lock, Zap,
  // DevOps
  Container, GitBranch, Workflow,
  // Tools
  Terminal, FileCode, Package
} from 'lucide-react';

interface PuzzlePieceProps {
  skill: Skill;
  puzzleShape: string;
  isAssembled: boolean;
  scatterPosition?: { x: number; y: number; rotation: number; scale: number };
  gridArea?: string;
  adjacentPieceIds: string[];
  onMouseEnter?: (skillId: string) => void;
  onMouseLeave?: () => void;
}

// Icon mapping for skills
const getSkillIcon = (skillName: string) => {
  const name = skillName.toLowerCase();
  
  // Frontend
  if (name.includes('react') || name.includes('vue') || name.includes('angular')) return Layout;
  if (name.includes('mobile') || name.includes('react native')) return Smartphone;
  if (name.includes('next') || name.includes('web')) return Globe;
  if (name.includes('css') || name.includes('tailwind') || name.includes('design')) return Palette;
  
  // Backend
  if (name.includes('node') || name.includes('express') || name.includes('nest')) return Server;
  if (name.includes('database') || name.includes('sql') || name.includes('mongo')) return Database;
  if (name.includes('api') || name.includes('graphql') || name.includes('rest')) return Zap;
  if (name.includes('auth') || name.includes('security')) return Lock;
  if (name.includes('cloud') || name.includes('aws') || name.includes('azure') || name.includes('firebase')) return CloudCog;
  
  // DevOps
  if (name.includes('docker') || name.includes('kubernetes')) return Container;
  if (name.includes('git') || name.includes('github')) return GitBranch;
  if (name.includes('ci') || name.includes('jenkins') || name.includes('pipeline')) return Workflow;
  
  // Tools
  if (name.includes('terminal') || name.includes('bash') || name.includes('shell')) return Terminal;
  if (name.includes('vscode') || name.includes('editor') || name.includes('sanity')) return FileCode;
  if (name.includes('npm') || name.includes('yarn') || name.includes('package')) return Package;
  
  // Default
  return Code2;
};

// Category color mappings with CSS variable values for SVG fills
const categoryColors: Record<string, { 
  border: string; 
  text: string; 
  glow: string;
  fill: string; // HSL value for SVG
}> = {
  frontend: {
    border: 'from-secondary via-secondary/50 to-transparent',
    text: 'text-secondary',
    glow: 'shadow-[0_0_30px_hsl(var(--secondary)/0.4)]',
    fill: 'hsl(var(--secondary))',
  },
  Frontend: {
    border: 'from-secondary via-secondary/50 to-transparent',
    text: 'text-secondary',
    glow: 'shadow-[0_0_30px_hsl(var(--secondary)/0.4)]',
    fill: 'hsl(var(--secondary))',
  },
  backend: {
    border: 'from-accent-green via-accent-green/50 to-transparent',
    text: 'text-accent-green',
    glow: 'shadow-[0_0_30px_hsl(var(--accent-green)/0.4)]',
    fill: 'hsl(var(--accent-green))',
  },
  Backend: {
    border: 'from-accent-green via-accent-green/50 to-transparent',
    text: 'text-accent-green',
    glow: 'shadow-[0_0_30px_hsl(var(--accent-green)/0.4)]',
    fill: 'hsl(var(--accent-green))',
  },
  devops: {
    border: 'from-tertiary via-tertiary/50 to-transparent',
    text: 'text-tertiary',
    glow: 'shadow-[0_0_30px_hsl(var(--tertiary)/0.4)]',
    fill: 'hsl(var(--tertiary))',
  },
  Concepts: {
    border: 'from-tertiary via-tertiary/50 to-transparent',
    text: 'text-tertiary',
    glow: 'shadow-[0_0_30px_hsl(var(--tertiary)/0.4)]',
    fill: 'hsl(var(--tertiary))',
  },
  tools: {
    border: 'from-primary via-primary/50 to-transparent',
    text: 'text-primary',
    glow: 'shadow-[0_0_30px_hsl(var(--primary)/0.4)]',
    fill: 'hsl(var(--primary))',
  },
  Tools: {
    border: 'from-primary via-primary/50 to-transparent',
    text: 'text-primary',
    glow: 'shadow-[0_0_30px_hsl(var(--primary)/0.4)]',
    fill: 'hsl(var(--primary))',
  },
  Languages: {
    border: 'from-muted via-muted/50 to-transparent',
    text: 'text-muted-foreground',
    glow: 'shadow-[0_0_20px_hsl(var(--muted)/0.3)]',
    fill: 'hsl(var(--muted))',
  },
  other: {
    border: 'from-muted via-muted/50 to-transparent',
    text: 'text-muted-foreground',
    glow: 'shadow-[0_0_20px_hsl(var(--muted)/0.3)]',
    fill: 'hsl(var(--muted))',
  },
};

/**
 * Edge configuration for puzzle pieces
 * Each shape type defines which edges have tabs (outward) or blanks (inward)
 * 'tab' = protrusion, 'blank' = indentation, 'flat' = no connection
 */
type EdgeType = 'tab' | 'blank' | 'flat';
interface EdgeConfig {
  top: EdgeType;
  right: EdgeType;
  bottom: EdgeType;
  left: EdgeType;
}

const getEdgeConfig = (shapeType: number): EdgeConfig => {
  const configs: EdgeConfig[] = [
    // Shape 1: Top-Left Corner
    { top: 'flat', right: 'tab', bottom: 'blank', left: 'flat' },
    // Shape 2: Top-Right Corner
    { top: 'flat', right: 'flat', bottom: 'tab', left: 'blank' },
    // Shape 3: Bottom-Left Corner
    { top: 'tab', right: 'blank', bottom: 'flat', left: 'flat' },
    // Shape 4: Bottom-Right Corner
    { top: 'blank', right: 'flat', bottom: 'flat', left: 'tab' },
    // Shape 5: Edge Top
    { top: 'flat', right: 'tab', bottom: 'tab', left: 'blank' },
    // Shape 6: Edge Bottom
    { top: 'blank', right: 'tab', bottom: 'flat', left: 'blank' },
    // Shape 7: Edge Left
    { top: 'tab', right: 'tab', bottom: 'blank', left: 'flat' },
    // Shape 8: Edge Right
    { top: 'blank', right: 'flat', bottom: 'tab', left: 'tab' },
    // Shape 9: Center (all connections)
    { top: 'tab', right: 'blank', bottom: 'tab', left: 'blank' },
  ];
  return configs[(shapeType - 1) % configs.length];
};

/**
 * SVG Tab Component - renders a tab that extends outward from the piece
 */
const PuzzleTab = ({ 
  position, 
  fillColor,
  cardboardColor,
}: { 
  position: 'top' | 'right' | 'bottom' | 'left';
  fillColor: string;
  cardboardColor: string;
}) => {
  // Tab dimensions - larger for visibility
  const tabWidth = 32;
  const tabHeight = 18;
  
  // Position styles for each edge
  const positionStyles: Record<string, React.CSSProperties> = {
    top: {
      top: -tabHeight + 3,
      left: '50%',
      transform: 'translateX(-50%)',
    },
    bottom: {
      bottom: -tabHeight + 3,
      left: '50%',
      transform: 'translateX(-50%) rotate(180deg)',
    },
    left: {
      left: -tabHeight + 3,
      top: '50%',
      transform: 'translateY(-50%) rotate(-90deg)',
    },
    right: {
      right: -tabHeight + 3,
      top: '50%',
      transform: 'translateY(-50%) rotate(90deg)',
    },
  };

  return (
    <div 
      className="absolute pointer-events-none z-20"
      style={positionStyles[position]}
    >
      <svg 
        width={tabWidth} 
        height={tabHeight} 
        viewBox={`0 0 ${tabWidth} ${tabHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}
      >
        {/* Tab shape - rounded nub extending outward */}
        <path
          d={`
            M 0,${tabHeight}
            C 0,${tabHeight - 5} 2,${tabHeight - 8} 6,${tabHeight - 10}
            C 10,${tabHeight - 14} ${tabWidth / 2 - 2},0 ${tabWidth / 2},0
            C ${tabWidth / 2 + 2},0 ${tabWidth - 10},${tabHeight - 14} ${tabWidth - 6},${tabHeight - 10}
            C ${tabWidth - 2},${tabHeight - 8} ${tabWidth},${tabHeight - 5} ${tabWidth},${tabHeight}
            Z
          `}
          fill={cardboardColor}
        />
        {/* Inner lighter area for 3D effect */}
        <path
          d={`
            M 4,${tabHeight}
            C 4,${tabHeight - 4} 6,${tabHeight - 6} 9,${tabHeight - 8}
            C 12,${tabHeight - 11} ${tabWidth / 2 - 1},3 ${tabWidth / 2},3
            C ${tabWidth / 2 + 1},3 ${tabWidth - 12},${tabHeight - 11} ${tabWidth - 9},${tabHeight - 8}
            C ${tabWidth - 6},${tabHeight - 6} ${tabWidth - 4},${tabHeight - 4} ${tabWidth - 4},${tabHeight}
            Z
          `}
          fill="#d4b896"
        />
        {/* Category color tint on top */}
        <path
          d={`
            M 8,${tabHeight}
            C 8,${tabHeight - 3} 10,${tabHeight - 5} 12,${tabHeight - 6}
            C 14,${tabHeight - 8} ${tabWidth / 2},5 ${tabWidth / 2},5
            C ${tabWidth / 2},5 ${tabWidth - 14},${tabHeight - 8} ${tabWidth - 12},${tabHeight - 6}
            C ${tabWidth - 10},${tabHeight - 5} ${tabWidth - 8},${tabHeight - 3} ${tabWidth - 8},${tabHeight}
            Z
          `}
          fill={fillColor}
          opacity={0.25}
        />
      </svg>
    </div>
  );
};

/**
 * SVG Blank Component - renders an indentation (where a tab would fit)
 * This shows as a shadow/cutout effect on the edge
 */
const PuzzleBlank = ({ 
  position,
  cardboardColor,
}: { 
  position: 'top' | 'right' | 'bottom' | 'left';
  cardboardColor: string;
}) => {
  // Blank dimensions (matches tab for interlocking)
  const blankWidth = 32;
  const blankDepth = 14;
  
  // Position styles for each edge - positioned to overlay the edge
  const positionStyles: Record<string, React.CSSProperties> = {
    top: {
      top: -2,
      left: '50%',
      transform: 'translateX(-50%)',
    },
    bottom: {
      bottom: -2,
      left: '50%',
      transform: 'translateX(-50%) rotate(180deg)',
    },
    left: {
      left: -2,
      top: '50%',
      transform: 'translateY(-50%) rotate(-90deg)',
    },
    right: {
      right: -2,
      top: '50%',
      transform: 'translateY(-50%) rotate(90deg)',
    },
  };

  return (
    <div 
      className="absolute pointer-events-none z-5"
      style={positionStyles[position]}
    >
      <svg 
        width={blankWidth} 
        height={blankDepth} 
        viewBox={`0 0 ${blankWidth} ${blankDepth}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer shadow for depth */}
        <path
          d={`
            M 0,0
            C 0,4 2,6 6,8
            C 10,11 ${blankWidth / 2 - 2},${blankDepth} ${blankWidth / 2},${blankDepth}
            C ${blankWidth / 2 + 2},${blankDepth} ${blankWidth - 10},11 ${blankWidth - 6},8
            C ${blankWidth - 2},6 ${blankWidth},4 ${blankWidth},0
            Z
          `}
          fill="black"
          opacity={0.2}
        />
        {/* Inner shadow for more depth */}
        <path
          d={`
            M 4,0
            C 4,3 5,4 8,6
            C 11,8 ${blankWidth / 2 - 1},${blankDepth - 2} ${blankWidth / 2},${blankDepth - 2}
            C ${blankWidth / 2 + 1},${blankDepth - 2} ${blankWidth - 11},8 ${blankWidth - 8},6
            C ${blankWidth - 5},4 ${blankWidth - 4},3 ${blankWidth - 4},0
            Z
          `}
          fill="black"
          opacity={0.1}
        />
      </svg>
    </div>
  );
};

// Cardboard-like color for the puzzle piece base
const CARDBOARD_COLOR = '#c4a882';
const CARDBOARD_DARK = '#a08968';

export function PuzzlePiece({
  skill,
  puzzleShape,
  isAssembled,
  scatterPosition,
  gridArea,
  adjacentPieceIds,
  onMouseEnter,
  onMouseLeave,
}: PuzzlePieceProps) {
  const pieceRef = useRef<HTMLDivElement>(null);
  const Icon = getSkillIcon(skill.name);
  const colors = categoryColors[skill.category] || categoryColors.other;

  // Determine size based on proficiency
  const sizeClass = skill.proficiency >= 90 ? 'min-h-[160px]' :
                     skill.proficiency >= 80 ? 'min-h-[140px]' :
                     'min-h-[120px]';

  // Fixed dimensions for scattered state
  const scatteredDimensions = {
    width: '180px',
    minHeight: '130px',
  };

  // Get shape type from puzzleShape string and edge configuration
  const shapeType = parseInt(puzzleShape.split('-')[2]) || 5;
  const edgeConfig = getEdgeConfig(shapeType);
  
  // Use consistent rounded corners for the main card
  const borderRadius = '16px';

  return (
    <div
      ref={pieceRef}
      data-skill-id={skill._id}
      className={`puzzle-piece group ${sizeClass} relative transition-all duration-300`}
      style={{
        gridArea: isAssembled ? gridArea : undefined,
        transform: !isAssembled && scatterPosition
          ? `translate(${scatterPosition.x}px, ${scatterPosition.y}px) rotate(${scatterPosition.rotation}deg) scale(${scatterPosition.scale})`
          : undefined,
        position: !isAssembled ? 'absolute' : 'relative',
        left: !isAssembled ? '50%' : undefined,
        top: !isAssembled ? '50%' : undefined,
        width: !isAssembled ? scatteredDimensions.width : undefined,
        minHeight: !isAssembled ? scatteredDimensions.minHeight : undefined,
        willChange: 'transform',
        // Allow tabs to overflow outside the grid cell
        overflow: 'visible',
      }}
      onMouseEnter={() => onMouseEnter?.(skill._id)}
      onMouseLeave={() => onMouseLeave?.()}
    >
      {/* Main piece wrapper - overflow visible for tabs */}
      <div className="relative w-full h-full" style={{ minHeight: 'inherit', overflow: 'visible' }}>
        
        {/* Jigsaw Tab/Blank Overlays */}
        {edgeConfig.top === 'tab' && (
          <PuzzleTab position="top" fillColor={colors.fill} cardboardColor={CARDBOARD_COLOR} />
        )}
        {edgeConfig.top === 'blank' && (
          <PuzzleBlank position="top" cardboardColor={CARDBOARD_DARK} />
        )}
        {edgeConfig.right === 'tab' && (
          <PuzzleTab position="right" fillColor={colors.fill} cardboardColor={CARDBOARD_COLOR} />
        )}
        {edgeConfig.right === 'blank' && (
          <PuzzleBlank position="right" cardboardColor={CARDBOARD_DARK} />
        )}
        {edgeConfig.bottom === 'tab' && (
          <PuzzleTab position="bottom" fillColor={colors.fill} cardboardColor={CARDBOARD_COLOR} />
        )}
        {edgeConfig.bottom === 'blank' && (
          <PuzzleBlank position="bottom" cardboardColor={CARDBOARD_DARK} />
        )}
        {edgeConfig.left === 'tab' && (
          <PuzzleTab position="left" fillColor={colors.fill} cardboardColor={CARDBOARD_COLOR} />
        )}
        {edgeConfig.left === 'blank' && (
          <PuzzleBlank position="left" cardboardColor={CARDBOARD_DARK} />
        )}

        {/* Cardboard base layer */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{ 
            borderRadius,
            background: `linear-gradient(145deg, ${CARDBOARD_COLOR} 0%, ${CARDBOARD_DARK} 100%)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)',
          }}
        />

        {/* Inner card content */}
        <div 
          className={`absolute inset-[3px] bg-surface-container flex flex-col items-center justify-center gap-2 p-4 relative overflow-hidden transition-all duration-300 group-hover:bg-surface-container-high`}
          style={{ 
            borderRadius: '13px',
          }}
        >
          {/* Cardboard grain texture */}
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
            }}
          />

          {/* Subtle fiber lines for cardboard feel */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(139, 119, 101, 0.5) 2px,
                rgba(139, 119, 101, 0.5) 3px
              )`,
              backgroundSize: '8px 8px',
            }}
          />

          {/* Category color accent line */}
          <div 
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r ${colors.border} rounded-full opacity-60`}
          />

          {/* Icon */}
          <Icon className={`w-9 h-9 md:w-11 md:h-11 ${colors.text} transition-transform duration-300 group-hover:scale-110 relative z-10 flex-shrink-0`} />

          {/* Skill Name */}
          <h3 className="text-sm md:text-base font-body font-semibold text-center leading-tight relative z-10 group-hover:text-foreground transition-colors line-clamp-2">
            {skill.name}
          </h3>

          {/* Hover glow overlay */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.glow} blur-xl -z-10`} />
        </div>

        {/* External glow on hover (assembled only) */}
        {isAssembled && (
          <div 
            className={`absolute -inset-2 opacity-0 group-hover:opacity-60 transition-opacity duration-300 ${colors.glow} blur-xl -z-10`}
            style={{ borderRadius }}
          />
        )}
      </div>
    </div>
  );
}
