import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import icon from '../assets/icon.png';
import '../Styles/QuizList.css';

const blueIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [7, -54],
});

Modal.setAppElement('#root');

function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchQuizzes = async () => {
    if (!token) return;
    try {
      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      const data = await response.json();
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error.message);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [token]);

  const openModal = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  if (!token) {
    return (
      <div className="login-prompt-container">
        <h2>You need to log in to see the quiz list</h2>
        <button onClick={() => navigate('/login')} className="login-button">
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>All Quizzes</h2>
      <div className="quiz-list">
        {quizzes.map((quiz, index) => (
          <div key={`${quiz.quizId}-${index}`} className="quiz-item">
            <h3>Quiz ID: {quiz.quizId}</h3>
            <p>Created by: {quiz.username} (User ID: {quiz.userId})</p>

            <div className="button-container">
              <button onClick={() => openModal(quiz)} className="show-more-button">
                Show More
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedQuiz && (
          <div>
            <div className="modal-header">
              <h2>Quiz Details: {selectedQuiz.quizId}</h2>
              <button onClick={closeModal} className="close-button">Close</button>
            </div>
            <p>Created by User ID: {selectedQuiz.userId}</p>
            {selectedQuiz.questions && selectedQuiz.questions.length > 0 ? (
              <div>
                <div className="map-container">
                  <MapContainer
                    center={[
                      parseFloat(selectedQuiz.questions[0]?.location?.latitude || 0),
                      parseFloat(selectedQuiz.questions[0]?.location?.longitude || 0),
                    ]}
                    zoom={13}
                    className="map-container"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {selectedQuiz.questions.map((question, index) => {
                      const { location } = question;
                      if (location && location.latitude && location.longitude) {
                        return (
                          <Marker
                            key={`${location.latitude}-${location.longitude}-${index}`}
                            position={[parseFloat(location.latitude), parseFloat(location.longitude)]}
                            icon={blueIcon}
                          >
                            <Popup>{question.question} - {question.answer}</Popup>
                          </Marker>
                        );
                      }
                      return null;
                    })}
                  </MapContainer>
                </div>
                <h4>Questions:</h4>
                <div className="questions-list">
                  {selectedQuiz.questions.map((question, index) => (
                    <div key={`${question.question}-${index}`} className="question-item">
                      <p>Question: {question.question}</p>
                      <p>Answer: {question.answer}</p>
                      <p>
                        Location: (Lat: {question.location?.latitude}, Long: {question.location?.longitude})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No questions available</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default QuizListPage;
