import React, { useState, useEffect } from 'react';
import api from '../Services/api';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/quiz');  // Ensure this endpoint matches your API documentation
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes', error);
        setErrorMessage('Failed to load quizzes. Please try again later.');
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
      <h2>Available Quizzes</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <ul>
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <li key={quiz.id}>{quiz.name} by {quiz.creator}</li>
          ))
        ) : (
          <p>No quizzes available</p>
        )}
      </ul>
    </div>
  );
}

export default QuizList;
