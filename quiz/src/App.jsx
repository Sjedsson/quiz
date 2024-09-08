import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import CreateQuizPage from './Pages/CreateQuizPage';
import QuizListPage from './Pages/QuizListPage';
import Header from './Components/Header';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/create-quiz" element={<CreateQuizPage />} />
        <Route path="/quiz-list" element={<QuizListPage />} />
      </Routes>
    </div>
  );
}

export default App;
