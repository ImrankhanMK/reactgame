import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import './App.css'
import Game from "./components/Game";
import Scorecard from "./components/Scorecard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/score_card" element={<Scorecard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
