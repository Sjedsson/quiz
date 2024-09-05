import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          setErrorMessage(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          if (error.code === error.PERMISSION_DENIED) {
            setErrorMessage('Geolocation permission denied. Defaulting to Eriksberg, Göteborg.');
          } else {
            setErrorMessage('Error getting location. Defaulting to Eriksberg, Göteborg.');
          }
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by your browser. Defaulting to Eriksberg, Göteborg.');
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
      console.error('All fields must be filled and a location must be selected');
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
      const token = localStorage.getItem('token'); // Assuming you handle token storage

      for (let i = 0; i < questions.length; i++) {
        const quizData = {
          name: quizName,
          question: questions[i].question,
          answer: questions[i].answer,
          location: questions[i].location,
        };

        console.log('Sending quiz data:', quizData);

        const response = await api.post('/quiz/question', quizData, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to add quiz question');
        }
      }

      setQuizName('');
      setQuestions([]);
      alert('Quiz created successfully!');
    } catch (error) {
      console.error('Error creating quiz', error);
      setErrorMessage('Error creating quiz');
    }
  };

  return (
    <div>
      <form onSubmit={handleCreateQuiz}>
        <h2>Create a New Quiz</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
