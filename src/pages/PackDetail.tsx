import React, { useState } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../store';
import { BookA, PencilLine, ArrowLeft } from 'lucide-react';

export const PackDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPack } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const pack = getPack(id || '');

  if (!pack) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">词卡包不存在</h2>
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const isFlashcards = location.pathname.endsWith('/flashcards') || location.pathname === `/pack/${id}`;
  const isDictation = location.pathname.endsWith('/dictation');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </button>
          <h1 className="text-lg font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-md">
            {pack.title}
          </h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl w-full mx-auto p-4 pb-24">
        <Outlet context={{ pack }} />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button
            onClick={() => navigate(`/pack/${id}/flashcards`)}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
              isFlashcards ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <BookA className={`w-6 h-6 mb-1 ${isFlashcards ? 'fill-indigo-50' : ''}`} />
            <span className="text-xs font-medium">词卡</span>
          </button>
          <button
            onClick={() => navigate(`/pack/${id}/dictation`)}
            className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
              isDictation ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <PencilLine className={`w-6 h-6 mb-1 ${isDictation ? 'fill-indigo-50' : ''}`} />
            <span className="text-xs font-medium">听写</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
