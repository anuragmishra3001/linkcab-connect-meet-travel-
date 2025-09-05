import { useState } from 'react';

const DevModeIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 px-4 z-50 shadow-lg">
      <div className="flex items-center justify-center space-x-2">
        <span className="font-bold">🚧 DEVELOPMENT MODE</span>
        <span className="text-sm">
          Using mock data - no backend required
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 bg-black text-yellow-500 px-2 py-1 rounded text-xs hover:bg-gray-800 transition-colors"
        >
          Hide
        </button>
      </div>
    </div>
  );
};

export default DevModeIndicator;
