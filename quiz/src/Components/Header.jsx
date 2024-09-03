import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/create-quiz">Create Quiz</Link></li>
          <li><Link to="/quiz-list">Quiz List</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
