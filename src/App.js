import React, { useState } from "react";
import MainView from "./component/MainView";
import Map from "./component/Map";
import "./App.css";

function App() {
  const [showMap, setShowMap] = useState(true);

  const handleShowMapToggle = () => setShowMap((prevShowMap) => !prevShowMap);

  return (
    <div className="App">
      <Map showMap={showMap} />
      <MainView showMaps={showMap} onShowMapToggle={handleShowMapToggle} />
    </div>
  );
}

export default App;
