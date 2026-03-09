/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store';
import { Home } from './pages/Home';
import { PackDetail } from './pages/PackDetail';
import { Flashcards } from './pages/Flashcards';
import { Dictation } from './pages/Dictation';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pack/:id" element={<PackDetail />}>
            <Route index element={<Flashcards />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="dictation" element={<Dictation />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}
