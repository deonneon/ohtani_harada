import React from 'react';

/**
 * Base props for all cell components
 */
export interface CellProps {
  /** Unique identifier for the cell */
  id: string;
  /** Whether this cell is currently selected */
  isSelected?: boolean;
  /** Click handler for the cell */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Content to render inside the cell */
  children: React.ReactNode;
}

/**
 * Base Cell component that provides common cell functionality
 * and styling foundation for all cell types
 */
const Cell: React.FC<CellProps> = ({
  id,
  isSelected = false,
  onClick,
  className = '',
  children,
}) => {
  const baseClasses = `
    relative rounded-lg border-2 transition-all duration-300 ease-out
    flex items-center justify-center overflow-hidden
    ${onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 touch-manipulation min-h-[44px] min-w-[44px]' : ''}
    ${isSelected ? 'ring-4 ring-blue-400/60 ring-offset-2 shadow-lg' : ''}
    backdrop-blur-sm
    ${className}
  `.trim();

  return (
    <div
      className={baseClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={onClick ? 'Clickable cell' : undefined}
      data-cell-id={id}
    >
      {children}
    </div>
  );
};

export default Cell;
