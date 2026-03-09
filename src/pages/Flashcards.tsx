import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Pack, Word } from '../types';
import { HanziWriterComponent } from '../components/HanziWriterComponent';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Flashcards: React.FC = () => {
  const { pack } = useOutletContext<{ pack: Pack }>();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!pack || pack.words.length === 0) {
    return <div className="text-center py-12 text-gray-500">词卡包为空</div>;
  }

  const word = pack.words[currentIndex];

  const handleNext = () => {
    if (currentIndex < pack.words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8; // Slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    } else {
      alert('您的浏览器不支持语音播报功能。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
        <div className="absolute top-4 right-4 text-sm text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">
          {currentIndex + 1} / {pack.words.length}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={word.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-8 flex flex-col items-center"
          >
            {/* Pinyin and Audio */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-medium text-gray-600 tracking-widest">{word.pinyin}</span>
              <button
                onClick={playAudio}
                className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                title="播放读音"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Main Character/Word Display */}
            <div className="mb-8 flex justify-center">
              {word.type === 'character' ? (
                <HanziWriterComponent character={word.text} width={180} height={180} />
              ) : (
                <div className="text-6xl font-bold text-gray-900 tracking-widest py-8">
                  {word.text}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="w-full space-y-6 text-left">
              {word.type === 'character' && word.radical && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">偏旁部首</h4>
                  <p className="text-lg text-gray-800">{word.radical}</p>
                </div>
              )}

              {word.relatedWords && word.relatedWords.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">组词</h4>
                  <div className="flex flex-wrap gap-2">
                    {word.relatedWords.map((w, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-700 text-sm shadow-sm">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {word.sentence && (
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <h4 className="text-sm font-semibold text-indigo-400 mb-1 uppercase tracking-wider">造句</h4>
                  <p className="text-gray-800 leading-relaxed">{word.sentence}</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between w-full max-w-md mt-8 px-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          上一个
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === pack.words.length - 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
        >
          下一个
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
