import React from 'react';
import GamePage from './components/pages/GamePage';
import StartPage from './components/pages/StartPage';
import GameOverPage from './components/pages/GameOverPage';
import LeaderboardPage from './components/pages/LeaderboardPage';
import { Route, BrowserRouter, Routes } from "react-router-dom"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<StartPage />} />
        <Route path='/gamePage' element={<GamePage />} />
        <Route path='/startPage' element={<StartPage />} />
        <Route path='/gameOver' element={<GameOverPage />} />
        <Route path='/leaderboard' element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter >

  );
}
