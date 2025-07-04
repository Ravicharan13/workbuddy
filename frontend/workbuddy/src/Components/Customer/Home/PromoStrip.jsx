import React from 'react';

function PromoStrip() {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-700 text-center py-3 px-4 text-yellow-800 dark:text-white text-sm font-medium">
      🎉 New customers get 15% OFF their first booking — Use code <span className="font-bold">WELCOME15</span>
    </div>
  );
}

export default PromoStrip;
