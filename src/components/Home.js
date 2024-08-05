import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const handleStartGame = () => {
    navigate("/game", { state: { playerName: name } });
  };
  return (
    <div className="home_main">
      <h1>Welcome to Car Dash</h1>
      <div className="row justify-content-center">
        <div className="col-sm-8 col-md-6 col-lg-6 mt-5">
          <input
            type="text"
            className="form-control fs-2"
            style={{ height: "60px" }}
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <button
        onClick={handleStartGame}
        disabled={!name}
        className="btn start_btn"
      >
        Enter the Game
      </button>
    </div>
  );
}

export default Home;
