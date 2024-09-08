import React from 'react';
import QuizMap from '../Components/QuizMap';
import '../Styles/HomePage.css';

function HomePage() {
  return (
    <div>
      <h1>Welcome to Quiztopia</h1>
      <QuizMap />
      <p class="footer">© 2024 Quiztopia. All rights reserved.</p>
    </div>
  );
}

export default HomePage;
