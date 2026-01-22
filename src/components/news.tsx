import React, { useState } from 'react';

interface NewsItem {
  id: number;
  text: string;
}

const NewsCarousel: React.FC = () => {
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const newsItems: string[] = [
    "Welcome to the ElderLine Portal! We are here to support you with any questions or concerns you may have.","Stay connected with us for the latest updates and announcements.","National Helpline for Senior Citizens: 14567"  ];

  // Duplicate items for seamless loop
  const displayItems: string[] = [...newsItems, ...newsItems];

  return (
    <div className="rounded-xl px-4 bg-gradient-to-r bg-[#007bff] shadow-lg mb-4">
      <div className="max-w-8xl px-4 py-3">
        <div className="flex items-center gap-4">
          {/* NEW Badge */}
          <div className="flex-shrink-0">
            <div className="bg-green-400 text-white font-bold px-3 py-1 rounded text-sm uppercase shadow-md">
              NEW
            </div>
          </div>

          {/* Scrolling News Container */}
          <div 
            className="flex-1 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative">
              <style>{`
                @keyframes scroll-left {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                
                .scrolling-text {
                  animation: scroll-left 30s linear infinite;
                }
                
                .scrolling-text.paused {
                  animation-play-state: paused;
                }
              `}</style>
              
              <div className={`flex gap-12 scrolling-text ${isPaused ? 'paused' : ''}`}>
                {displayItems.map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex-shrink-0 whitespace-nowrap"
                  >
                    <span className="text-white font-medium text-sm md:text-base">
                      {item}
                    </span>
                    <span className="text-yellow-400 mx-6">•</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NewsCarousel;