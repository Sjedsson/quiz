import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from '../assets/icon.png';
import '../Styles/QuizMap.css'

const markerIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [7, -54],
});

function CreateQuiz() {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentLocation, setCurrentLocation] = useState({ latitude: null, longitude: null });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          setIsLoadingLocation(false);
          setErrorMessage(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setErrorMessage('Error getting location. Defaulting to Göteborg.');
          setIsLoadingLocation(false);
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by your browser.');
      setIsLoadingLocation(false);
    }
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setCurrentLocation({
          latitude: e.latlng.lat.toString(),
          longitude: e.latlng.lng.toString(),
        });
        setErrorMessage(null);
      },
    });
    return null;
  };

  const handleAddQuestion = () => {
    if (currentQuestion && currentAnswer && currentLocation.latitude && currentLocation.longitude) {
      const newQuestion = {
        question: currentQuestion,
        answer: currentAnswer,
        location: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
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
          location: q.location,
        })),
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

  if (!isLoadingLocation && !currentLocation.latitude) {
    return (
      <div>
        <h2>Create a New Quiz</h2>
        <p>{errorMessage}</p>
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

        {isLoadingLocation ? (
          <p>Loading your location...</p>
        ) : (
          <div className="map-container">
            <MapContainer center={[parseFloat(currentLocation.latitude), parseFloat(currentLocation.longitude)]} zoom={13}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapClickHandler />
              {questions.map((q, index) => (
                <Marker
                  key={index}
                  position={[parseFloat(q.location.latitude), parseFloat(q.location.longitude)]}
                  icon={markerIcon}
                >
                  <Popup>{q.question} - {q.answer}</Popup>
                </Marker>
              ))}
              <Marker position={[parseFloat(currentLocation.latitude), parseFloat(currentLocation.longitude)]} icon={markerIcon}>
                <Popup>Här är din plats!</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

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
