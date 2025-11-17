import React, { useState } from 'react';
import type { MatrixData } from '../types';
import type { ExportOptions } from '../utils/export';
import {
  exportMatrix,
  DEFAULT_EXPORT_OPTIONS,
} from '../utils/export';

interface ExportModalProps {
  isOpen: boolean;
  matrixData: MatrixData;
  gridElement: HTMLElement | null;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  matrixData,
  gridElement,
  onClose,
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>(
    DEFAULT_EXPORT_OPTIONS
  );
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!matrixData || !gridElement) {
      setError('Matrix data or grid element is missing');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      await exportMatrix(matrixData, gridElement, exportOptions);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const updateOption = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setExportOptions((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="export-modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            Export Matrix
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close export modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="png"
                  checked={exportOptions.format === 'png'}
                  onChange={(e) =>
                    updateOption('format', e.target.value as 'png')
                  }
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  PNG Image (High Quality)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="jpeg"
                  checked={exportOptions.format === 'jpeg'}
                  onChange={(e) =>
                    updateOption('format', e.target.value as 'jpeg')
                  }
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  JPEG Image (Smaller File)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={exportOptions.format === 'pdf'}
                  onChange={(e) =>
                    updateOption('format', e.target.value as 'pdf')
                  }
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  PDF Document (Detailed)
                </span>
              </label>
            </div>
          </div>

          {/* Content Type (PDF only) */}
          {exportOptions.format === 'pdf' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content to Include
              </label>
              <select
                value={exportOptions.contentType}
                onChange={(e) =>
                  updateOption(
                    'contentType',
                    e.target.value as 'full' | 'summary' | 'completed-only'
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="full">Full Matrix (All details)</option>
                <option value="summary">Summary (Goal and areas only)</option>
                <option value="completed-only">Completed Tasks Only</option>
              </select>
            </div>
          )}

          {/* Quality Slider (Image formats only) */}
          {(exportOptions.format === 'png' ||
            exportOptions.format === 'jpeg') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality: {Math.round((exportOptions.quality || 0.95) * 100)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={exportOptions.quality || 0.95}
                onChange={(e) =>
                  updateOption('quality', parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher quality = larger file size
              </p>
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="export-title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Custom Title
            </label>
            <input
              id="export-title"
              type="text"
              value={exportOptions.title}
              onChange={(e) => updateOption('title', e.target.value)}
              placeholder="Harada Method Matrix"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeTitle ?? true}
                onChange={(e) => updateOption('includeTitle', e.target.checked)}
                className="text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Include title and date
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeFooter ?? true}
                onChange={(e) =>
                  updateOption('includeFooter', e.target.checked)
                }
                className="text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Include footer with page numbers
              </span>
            </label>
          </div>

          {/* Preview Info */}
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Export Preview
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <strong>Format:</strong> {exportOptions.format.toUpperCase()}
              </p>
              {exportOptions.format === 'pdf' && (
                <p>
                  <strong>Content:</strong>{' '}
                  {exportOptions.contentType === 'full'
                    ? 'Full matrix details'
                    : exportOptions.contentType === 'summary'
                      ? 'Goal and areas summary'
                      : 'Completed tasks only'}
                </p>
              )}
              {(exportOptions.format === 'png' ||
                exportOptions.format === 'jpeg') && (
                <p>
                  <strong>Quality:</strong>{' '}
                  {Math.round((exportOptions.quality || 0.95) * 100)}%
                </p>
              )}
              <p>
                <strong>Title:</strong> {exportOptions.title}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Exporting...
              </div>
            ) : (
              `Export as ${exportOptions.format.toUpperCase()}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
