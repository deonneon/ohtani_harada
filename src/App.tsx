import { useState } from 'react';
import { Grid } from './components';
import { createEmptyMatrix } from './utils';

function App() {
  // Create sample matrix data for testing
  const [matrixData] = useState(() =>
    createEmptyMatrix({
      title: 'Become a Professional Baseball Player',
      description: 'Achieve excellence in baseball through systematic development of physical, mental, and strategic skills'
    })
  );

  const [selectedCellIds, setSelectedCellIds] = useState<string[]>([]);

  const handleCellClick = (cellType: 'goal' | 'area' | 'task', id: string) => {
    console.log(`Clicked ${cellType}:`, id);
  };

  const handleSelectionChange = (newSelection: string[]) => {
    console.log('Selection changed:', newSelection);
    setSelectedCellIds(newSelection);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Harada Method - Ohtani Matrix
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Interactive Matrix Grid</h2>
          <div className="text-gray-600 mb-6 space-y-2">
            {/* Desktop instructions */}
            <div className="hidden sm:block">
              <p>
                <strong>Click</strong> to select cells. <strong>Ctrl+Click</strong> (or <strong>Cmd+Click</strong>) to multi-select. <strong>Shift+Click</strong> for range selection.
              </p>
              <p>
                Use <strong>arrow keys</strong> to navigate, <strong>Space/Enter</strong> to select, <strong>Esc</strong> to clear selection.
              </p>
              <p>
                <strong>Scroll</strong> to zoom, <strong>click and drag</strong> when zoomed to pan. Use zoom controls to adjust view.
              </p>
            </div>

            {/* Mobile instructions */}
            <div className="sm:hidden">
              <p>
                <strong>Tap</strong> focus areas to expand/collapse and view tasks. <strong>Tap</strong> cells to select them.
              </p>
              <p>
                <strong>Pinch</strong> to zoom, <strong>drag</strong> when zoomed to pan. Use zoom controls for precise adjustment.
              </p>
            </div>

            <p className="text-sm opacity-75">
              The interface automatically adapts to your screen size - desktop shows a 9×9 grid, mobile shows an expandable list.
            </p>
          </div>

          <div className="flex justify-center">
            <Grid
              matrixData={matrixData}
              onCellClick={handleCellClick}
              onSelectionChange={handleSelectionChange}
              selectedCellIds={selectedCellIds}
            />
          </div>

          {selectedCellIds.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                Selected {selectedCellIds.length} cell{selectedCellIds.length !== 1 ? 's' : ''}:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedCellIds.map(id => (
                  <code key={id} className="bg-blue-100 px-2 py-1 rounded text-xs">
                    {id.slice(0, 8)}...
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Matrix Statistics</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-blue-800">Goal</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{matrixData.focusAreas.length}</div>
              <div className="text-sm text-green-800">Focus Areas</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{matrixData.tasks.length}</div>
              <div className="text-sm text-yellow-800">Tasks</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-purple-800">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
