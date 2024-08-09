import React, {useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/home.css";

function Home() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const handleStartGame = () => {
    let processedName = name;
    const parts = name.split(" ");
    if (parts.length > 1) {
      processedName = parts[0];
    }
    if (processedName.length > 12) {
      processedName = processedName.substring(0, 12);
    }

    navigate("/game", { state: { playerName: processedName } });
  };

  return (
    <>
    <div className="home_main">
      <h1>Welcome to Car Dash</h1>
      <div className="row justify-content-center">
        <div className="mt-5">
          <input
            type="text"
            className="form-control fs-2 w-75 m-auto player-name"
            // style={{ height: "60px" }}
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
    <div className="mobile-message text-danger">
        <p>Sorry, this game is only available on desktop and tablet devices.</p>
        <p>Please visit our site from a larger screen to play the game.</p>
      </div>
    </>
  );
}

export default Home;
