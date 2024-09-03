import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../Styles/Map.css';

function QuizMap() {
  return (
    <MapContainer center={[57.7089, 11.9746]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[57.7089, 11.9746]}>
        <Popup>
          Här är Göteborg! <br /> Det är här Quiztopia började.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default QuizMap;
