import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import "../App.css";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;
//
function Map({ showMap }) {
  const [markersData, setMarkersData] = useState({});
  const socketRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("https://jsramverk-trian-khsa16.azurewebsites.net");

    socketRef.current.on("message", (data) => {
      setMarkersData((prevMarkers) => {
        const updatedMarkers = { ...prevMarkers };

        if (updatedMarkers.hasOwnProperty(data.trainnumber)) {
          updatedMarkers[data.trainnumber].position = data.position;
        } else {
          updatedMarkers[data.trainnumber] = {
            position: data.position,
            trainnumber: data.trainnumber
          };
        }

        return updatedMarkers;
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="map" style={{ display: showMap ? "block" : "none" }}>
      <MapContainer
        center={[62.173276, 14.942265]}
        zoom={5}
        style={{ height: "100vh", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {Object.values(markersData).map((marker) => (
          <Marker key={marker.trainnumber} position={marker.position}>
            <Popup>{marker.trainnumber}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
