import React from 'react';
import { type FocusArea } from '../utils';
import Cell, { type CellProps } from './Cell';

/**
 * Props specific to AreaHeaderCell
 */
interface AreaHeaderCellProps extends Omit<CellProps, 'children'> {
  /** The focus area data to display */
  focusArea: FocusArea;
}

/**
 * Area icons mapping for visual representation
 */
const AREA_ICONS: Record<string, string> = {
  'Physical Development': '💪',
  'Mental Preparation': '🧠',
  'Skill Acquisition': '🎯',
  'Strategic Planning': '📋',
  'Performance Execution': '⚡',
  'Recovery & Maintenance': '🔄',
  'Relationship Building': '🤝',
  'Personal Growth': '🌱',
};

/**
 * AreaHeaderCell component for displaying focus area headers in the matrix
 * Each focus area represents a major category of tasks
 */
const AreaHeaderCell: React.FC<AreaHeaderCellProps> = ({
  focusArea,
  isSelected = false,
  onClick,
  className = '',
  ...cellProps
}) => {
  const areaClasses = `
    bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600
    text-white shadow-lg border-2 border-green-300/40
    ${
      isSelected
        ? 'from-emerald-500 via-green-600 to-teal-700 shadow-xl ring-3 ring-green-300/60 scale-105'
        : 'hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 hover:shadow-xl hover:scale-102'
    }
    transition-all duration-300 ease-out
    ${className}
  `.trim();

  // Get the appropriate icon for this area
  const icon = AREA_ICONS[focusArea.title] || '📌';

  return (
    <Cell
      {...cellProps}
      isSelected={isSelected}
      onClick={onClick}
      className={areaClasses}
      aria-label={`Focus Area: ${focusArea.title}`}
    >
      <div className="flex flex-col items-center justify-center h-full p-3 text-center relative">
        {/* Background pattern for depth */}
        <div className="absolute inset-0 bg-white/15 rounded-md"></div>

        {/* Area icon with enhanced styling */}
        <div
          className="text-2xl mb-2 drop-shadow-md relative z-10"
          role="img"
          aria-label={`${focusArea.title} icon`}
        >
          {icon}
        </div>

        {/* Area title with better typography */}
        <div className="font-bold text-sm mb-2 leading-tight relative z-10 drop-shadow-sm">
          {focusArea.title}
        </div>

        {/* Area description with improved spacing */}
        <div className="text-xs opacity-95 leading-relaxed line-clamp-2 relative z-10">
          {focusArea.description}
        </div>
      </div>
    </Cell>
  );
};

export default AreaHeaderCell;
