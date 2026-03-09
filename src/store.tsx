import React, { createContext, useContext, useEffect, useState } from 'react';
import { Pack, Word } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  packs: Pack[];
  addPack: (title: string, words: Word[]) => void;
  deletePack: (id: string) => void;
  getPack: (id: string) => Pack | undefined;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packs, setPacks] = useState<Pack[]>(() => {
    const saved = localStorage.getItem('chinese-dictation-packs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse packs from local storage', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('chinese-dictation-packs', JSON.stringify(packs));
  }, [packs]);

  const addPack = (title: string, words: Word[]) => {
    const newPack: Pack = {
      id: uuidv4(),
      title,
      words,
      createdAt: Date.now(),
    };
    setPacks((prev) => [newPack, ...prev]);
  };

  const deletePack = (id: string) => {
    setPacks((prev) => prev.filter((p) => p.id !== id));
  };

  const getPack = (id: string) => {
    return packs.find((p) => p.id === id);
  };

  return (
    <AppContext.Provider value={{ packs, addPack, deletePack, getPack }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
