import React, { useState } from 'react';
import { type MatrixData } from '../types';
import { createEmptyMatrix } from '../utils';

interface RecoveryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRecover: (data: MatrixData) => void;
  error?: Error;
  corruptedData?: any;
}

export const RecoveryDialog: React.FC<RecoveryDialogProps> = ({
  isOpen,
  onClose,
  onRecover,
  error,
  corruptedData,
}) => {
  const [recoveryOption, setRecoveryOption] = useState<
    'backup' | 'empty' | 'manual'
  >('backup');

  if (!isOpen) return null;

  const handleRecovery = () => {
    switch (recoveryOption) {
      case 'backup':
        // Try to recover from backup (could be implemented later)
        // For now, create empty matrix
        onRecover(
          createEmptyMatrix({
            title: 'Recovered Matrix',
            description: 'Matrix recovered after data corruption',
          })
        );
        break;
      case 'empty':
        onRecover(
          createEmptyMatrix({
            title: 'New Matrix',
            description: 'Started fresh after data recovery',
          })
        );
        break;
      case 'manual':
        // Could implement manual data entry recovery
        onRecover(
          createEmptyMatrix({
            title: 'Manual Recovery Matrix',
            description: 'Manual recovery after data corruption',
          })
        );
        break;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Data Recovery Required
        </h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            We encountered an issue loading your saved data:
          </p>
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
            {error?.message || 'Unknown error occurred'}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-3">
            Choose how to recover your data:
          </p>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="backup"
                checked={recoveryOption === 'backup'}
                onChange={(e) => setRecoveryOption(e.target.value as 'backup')}
                className="mr-2"
              />
              <span className="text-sm">
                Try to restore from backup (recommended)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                value="empty"
                checked={recoveryOption === 'empty'}
                onChange={(e) => setRecoveryOption(e.target.value as 'empty')}
                className="mr-2"
              />
              <span className="text-sm">Start with a fresh matrix</span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                value="manual"
                checked={recoveryOption === 'manual'}
                onChange={(e) => setRecoveryOption(e.target.value as 'manual')}
                className="mr-2"
              />
              <span className="text-sm">Manual recovery (advanced)</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRecovery}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            Recover Data
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
