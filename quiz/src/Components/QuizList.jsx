import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('You must be logged in to view quizzes.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Fetching quizzes with token:', token);

        const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error fetching quizzes:', errorData);
          throw new Error(errorData.message || 'Failed to fetch quizzes');
        }

        const data = await response.json();
        console.log('Fetched quizzes:', data);

        setQuizzes(data.quizzes);
        setErrorMessage(null);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setErrorMessage('Failed to load quizzes. Please try again later.');
      }
    };

    if (isAuthenticated) {
      fetchQuizzes();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Available Quizzes</h2>
        {errorMessage && <p>{errorMessage}</p>}
        <p>Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Available Quizzes</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <ul>
        {quizzes.length > 0 ? (
          quizzes.map((quiz, index) => (
            <li key={index}>
              <strong>Quiz ID:</strong> {quiz.quizId ? quiz.quizId : 'No ID'}<br />
              <strong>Created by:</strong> {quiz.username ? quiz.username : 'Unknown'}<br />
              <strong>Number of Questions:</strong> {quiz.questions.length}
            </li>
          ))
        ) : (
          <p>No quizzes available</p>
        )}
      </ul>
    </div>
  );
}

export default QuizList;
