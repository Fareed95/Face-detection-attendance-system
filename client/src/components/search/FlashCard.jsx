import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

export default function FlashCard({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState('');

  const nextCard = () => {
    setDirection('slide-left');
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      setDirection('');
    }, 300);
  };

  const prevCard = () => {
    setDirection('slide-right');
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
      setDirection('');
    }, 300);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto p-6 bg-gray-800 rounded-xl">
      <div className="relative h-[300px] perspective-1000">
        <div
          className={`
            absolute inset-0 
            transition-all duration-500 transform-gpu preserve-3d
            ${isFlipped ? 'rotate-y-180' : ''}
            ${direction === 'slide-left' ? 'translate-x-full opacity-0' : ''}
            ${direction === 'slide-right' ? '-translate-x-full opacity-0' : ''}
          `}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden">
            <div className="h-full p-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center">
              <span className="text-sm text-white/60 mb-4">Question {currentIndex + 1} of {cards.length}</span>
              <h3 className="text-2xl font-bold text-white text-center">
                {cards[currentIndex].question}
              </h3>
              <button
                onClick={() => setIsFlipped(true)}
                className="mt-6 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Reveal Answer
              </button>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className="h-full p-8 rounded-xl bg-white flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500 mb-4">Answer</span>
              <p className="text-lg text-center text-gray-800">
                {cards[currentIndex].answer}
              </p>
              <button
                onClick={() => setIsFlipped(false)}
                className="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 text-sm flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Back to Question
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={prevCard}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextCard}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
} 