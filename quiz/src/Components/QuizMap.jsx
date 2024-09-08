import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from '../assets/icon.png';
import "../Styles/QuizMap.css"

const customIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [40, 40],
  iconAnchor: [12, 41],
  popupAnchor: [7, -54],
});

function QuizMap() {
  return (
<div className="map-wrapper">
  <MapContainer center={[57.7089, 11.9746]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <Marker position={[57.7089, 11.9746]} icon={customIcon}>
      <Popup>
        Här är Göteborg! <br /> Det är här Quiztopia började.
      </Popup>
    </Marker>
  </MapContainer>
</div>

  );
}

export default QuizMap;
