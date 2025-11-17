import React from 'react';
import { Goal } from '../utils';
import Cell, { CellProps } from './Cell';

/**
 * Props specific to GoalCell
 */
interface GoalCellProps extends Omit<CellProps, 'children'> {
  /** The goal data to display */
  goal: Goal;
}

/**
 * GoalCell component for displaying the central goal in the matrix
 * Features special styling and layout for the most important element
 */
const GoalCell: React.FC<GoalCellProps> = ({
  goal,
  isSelected = false,
  onClick,
  className = '',
  ...cellProps
}) => {
  const goalClasses = `
    bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700
    text-white shadow-xl border-2 border-blue-400/30
    ${
      isSelected
        ? 'from-blue-600 via-blue-700 to-indigo-800 shadow-2xl ring-4 ring-blue-300/50 scale-105'
        : 'hover:from-blue-600 hover:via-blue-700 hover:to-indigo-800 hover:shadow-2xl hover:scale-102'
    }
    transition-all duration-300 ease-out
    ${className}
  `.trim();

  return (
    <Cell
      {...cellProps}
      isSelected={isSelected}
      onClick={onClick}
      className={goalClasses}
      aria-label={`Goal: ${goal.title}`}
    >
      <div className="flex flex-col items-center justify-center h-full p-4 text-center relative">
        {/* Background pattern for depth */}
        <div className="absolute inset-0 bg-white/10 rounded-md opacity-50"></div>

        {/* Goal icon/emoji with glow effect */}
        <div
          className="text-3xl mb-3 drop-shadow-lg relative z-10"
          role="img"
          aria-label="Target"
        >
          🎯
        </div>

        {/* Goal title with enhanced typography */}
        <div className="font-bold text-xl mb-3 leading-tight relative z-10 drop-shadow-sm">
          {goal.title}
        </div>

        {/* Goal description with better spacing */}
        <div className="text-sm opacity-95 leading-relaxed line-clamp-3 mb-3 relative z-10">
          {goal.description}
        </div>

        {/* Creation date indicator with subtle styling */}
        <div className="text-xs opacity-80 mt-auto px-2 py-1 bg-white/20 rounded-full backdrop-blur-sm relative z-10">
          Created {new Date(goal.createdDate).toLocaleDateString()}
        </div>
      </div>
    </Cell>
  );
};

export default GoalCell;
