import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icon for the map marker
const blueIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function CreateQuiz() {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentLocation, setCurrentLocation] = useState({ latitude: 57.7046, longitude: 11.9299 });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('You must be logged in to create a quiz.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          setErrorMessage(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setErrorMessage('Error getting location. Defaulting to Göteborg.');
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by your browser. Defaulting to Göteborg.');
    }
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setCurrentLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
        setErrorMessage(null);
      },
    });
    return null;
  };

  const handleAddQuestion = () => {
    if (currentQuestion && currentAnswer && currentLocation) {
      const newQuestion = {
        question: currentQuestion,
        answer: currentAnswer,
        location: {
          latitude: currentLocation.latitude.toString(),
          longitude: currentLocation.longitude.toString(),
        },
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion('');
      setCurrentAnswer('');
    } else {
      setErrorMessage('Please complete all fields and select a location on the map.');
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      setErrorMessage('Please add at least one question');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const quizData = {
        name: quizName,
        questions: questions.map(q => ({
          question: q.question,
          answer: q.answer,
          location: q.location
        }))
      };

      const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create quiz');
      }

      setQuizName('');
      setQuestions([]);
      alert('Quiz created successfully!');
    } catch (error) {
      setErrorMessage('Error creating quiz');
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Create a New Quiz</h2>
        {errorMessage && <p>{errorMessage}</p>}
        <p>Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleCreateQuiz}>
        <h2>Create a New Quiz</h2>
        {errorMessage && <p>{errorMessage}</p>}
        <input
          type="text"
          placeholder="Quiz Name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          required
        />
        <h3>Add Questions</h3>
        <input
          type="text"
          placeholder="Enter question"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter answer"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          required
        />

        <div className="map-container">
          <MapContainer center={[currentLocation.latitude, currentLocation.longitude]} zoom={13}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler />
            {questions.map((q, index) => (
              <Marker
                key={index}
                position={[parseFloat(q.location.latitude), parseFloat(q.location.longitude)]}
                icon={blueIcon}
              >
                <Popup>{q.question} - {q.answer}</Popup>
              </Marker>
            ))}
            <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={blueIcon}>
              <Popup>Selected Location</Popup>
            </Marker>
          </MapContainer>
        </div>

        <button type="button" onClick={handleAddQuestion}>Add Question</button>
        <h4>Questions:</h4>
        <ul>
          {questions.map((q, index) => (
            <li key={index}>
              <p>Question: {q.question}</p>
              <p>Answer: {q.answer}</p>
              <p>Location: (Lat: {q.location.latitude}, Long: {q.location.longitude})</p>
            </li>
          ))}
        </ul>
        <button type="submit">Create Quiz</button>
      </form>
    </div>
  );
}

export default CreateQuiz;
