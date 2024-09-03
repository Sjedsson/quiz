import React, { useState } from 'react';
import api from '../Services/api';

function CreateQuiz() {
  const [quizName, setQuizName] = useState('');

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quizzes', { name: quizName });
      setQuizName('');
      alert('Quiz created successfully!');
    } catch (error) {
      console.error('Error creating quiz', error);
    }
  };

  return (
    <form onSubmit={handleCreateQuiz}>
      <h2>Create a new Quiz</h2>
      <input
        type="text"
        placeholder="Quiz Name"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        required
      />
      <button type="submit">Create Quiz</button>
    </form>
  );
}

export default CreateQuiz;
