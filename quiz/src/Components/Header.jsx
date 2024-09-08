import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearToken, getToken } from '../Services/auth';
import '../Styles/Header.css'

function Header() {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/create-quiz">Create Quiz</Link></li>
          <li><Link to="/quiz-list">Quiz List</Link></li>
          {token ? (
            <li><button onClick={handleLogout}>Logout</button></li>
          ) : (
            <li><Link to="/login">Login</Link></li> 
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
