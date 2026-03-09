import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Pack, Word } from '../types';
import { DrawingCanvas } from '../components/DrawingCanvas';
import { Volume2, CheckCircle, XCircle, Eye, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export const Dictation: React.FC = () => {
  const { pack } = useOutletContext<{ pack: Pack }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  if (!pack || pack.words.length === 0) {
    return <div className="text-center py-12 text-gray-500">词卡包为空</div>;
  }

  const word = pack.words[currentIndex];

  useEffect(() => {
    // Play audio automatically when word changes
    playAudio();
    setShowAnswer(false);
    setFeedback(null);
  }, [currentIndex]);

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const playSound = (type: 'correct' | 'incorrect') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  };

  const handleCorrect = () => {
    setFeedback('correct');
    playSound('correct');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4ade80', '#22c55e', '#16a34a'],
    });

    setTimeout(() => {
      if (currentIndex < pack.words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert('恭喜你，完成了所有听写！');
        navigate(`/pack/${pack.id}`);
      }
    }, 1500);
  };

  const handleIncorrect = () => {
    setFeedback('incorrect');
    playSound('incorrect');
    setTimeout(() => {
      setFeedback(null);
      setShowAnswer(false);
      playAudio(); // Replay the current word
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative p-8">
        <div className="absolute top-4 right-4 text-sm text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">
          {currentIndex + 1} / {pack.words.length}
        </div>

        <div className="flex flex-col items-center mb-8">
          <button
            onClick={playAudio}
            className="p-4 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors shadow-sm mb-4"
            title="点击重播读音"
          >
            <Volume2 className="w-8 h-8" />
          </button>
          <p className="text-gray-500 font-medium">听发音，写生字词</p>
        </div>

        <AnimatePresence mode="wait">
          {feedback === 'incorrect' ? (
            <motion.div
              key="incorrect"
              initial={{ x: -10 }}
              animate={{ x: [10, -10, 10, -10, 0] }}
              transition={{ duration: 0.4 }}
              className="flex justify-center items-center h-[300px] text-red-500"
            >
              <XCircle className="w-24 h-24" />
            </motion.div>
          ) : feedback === 'correct' ? (
            <motion.div
              key="correct"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex justify-center items-center h-[300px] text-green-500"
            >
              <CheckCircle className="w-24 h-24" />
            </motion.div>
          ) : (
            <motion.div key="drawing" className="flex justify-center">
              <DrawingCanvas width={280} height={280} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex flex-col items-center gap-4">
          {!showAnswer && !feedback ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-md w-full justify-center font-medium"
            >
              <Eye className="w-5 h-5" />
              查看答案
            </button>
          ) : showAnswer && !feedback ? (
            <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-5xl font-bold text-gray-900 mb-6 tracking-widest border-b-2 border-indigo-100 pb-4 w-full text-center">
                {word.text}
              </div>
              <p className="text-gray-600 mb-4 font-medium">你写对了吗？</p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleIncorrect}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors font-medium"
                >
                  <XCircle className="w-5 h-5" />
                  写错了
                </button>
                <button
                  onClick={handleCorrect}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-sm font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  写对了
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
