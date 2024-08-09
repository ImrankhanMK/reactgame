import React, { useEffect, useState, useRef } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import "../css/game.css";
import horse from "../images/horse.png";
import barrierImg from "../images/barrier.png";
import bicycle from "../images/bicycle.png";
import bike from "../images/bike.png";
import car from "../images/car.png";
import van from "../images/van.png";
import amb from "../images/ambulance.png";
import bus from "../images/bus.png";
import dmpt from "../images/gartruck.png";
import lorry from "../images/lorry.png";
import euro from "../images/euro.png";
import sound from '../sounds/play.mpeg'
import gameover from '../sounds/gameover.mp3'

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const playerName = location.state.playerName;
  

  const levelConfigurations = [
    { user: bicycle, name: "Bicycle" },
    { user: horse, name: "Horse" },
    { user: bike, name: "Bike" },
    { user: car, name: "Car" },
    { user: van, name: "Van" },
    { user: amb, name: "Ambulence" },
    { user: bus, name: "Bus" },
    { user: dmpt, name: "Dump Truck"},
    { user: lorry, name: "Lorry"},
    { user: euro, name: "Truck"},
    { user: "last level", name: "Truck" },
  ];

  const positions = [10, 39, 67];

  const barrierRef = useRef(null);
  const racerRef = useRef(null);
  const intervalRef = useRef(null); // Reference to hold the interval ID
  const btnRef = useRef(null);
  const indicatorRef = useRef(null);
  const spinnerRef = useRef(null);
  const audioRef = useRef(null);
  const gameOverAudioRef = useRef(null);

  const [racer, setRacer] = useState(0);
  const [barrier, setBarrier] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [reqScore, setReqScore] = useState(10);
  const [isStarted, setIsStarted] = useState(false);
  const [garage, setGarage] = useState([]);
  const [rating, setRating] = useState(0);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [speed , setSpeed] = useState(2);
  const [time,setTime] = useState(2000);
  const [status,setStaus] = useState(false)

  const scoreCard = (e) => {

    navigate("/score_card" , { state: { playerName: playerName , level : level, score : score, winnings : garage.length , rating :rating ,complete : isGameCompleted } });
  }

  useEffect(() => {
    if (audioRef.current) {
      if (isStarted && !gameOver && !isGameCompleted) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset to the beginning
      }
    }
  }, [isStarted, gameOver, isGameCompleted]);
  useEffect(() => {
    if (gameOver && gameOverAudioRef.current) {
      gameOverAudioRef.current.play();
    }
  }, [gameOver]);
  // Handle racer movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If the game is over or completed, do nothing
      if (gameOver || isGameCompleted) return;
    
      // Handle key presses
      if (e.keyCode === 39) {
        // Right arrow key
        setRacer((prevIndex) => Math.min(prevIndex + 1, positions.length - 1));
      } else if (e.keyCode === 37) {
        // Left arrow key
        setRacer((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (e.keyCode === 38 || e.keyCode === 40) {
        // Up or down arrow keys
        playPause();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isStarted]);

  // Handle barrier movement
  useEffect(() => {
    if (isStarted) {
      intervalRef.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * positions.length);
        setBarrier(randomIndex);
      }, time);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isStarted, isGameCompleted]);

  useEffect(() => {
    if (barrierRef.current) {
      barrierRef.current.style.left = `${positions[barrier]}%`;
    }
  }, [barrier]);

  useEffect(() => {
    const checkCollision = () => {
      if (!racerRef.current || !barrierRef.current) return;

      const racerRect = racerRef.current.getBoundingClientRect();
      const barrierRect = barrierRef.current.getBoundingClientRect();

      if (
        racerRect.left < barrierRect.right &&
        racerRect.right > barrierRect.left &&
        racerRect.top < barrierRect.bottom &&
        racerRect.bottom > barrierRect.top
      ) {
        setGameOver(true);
        setIsStarted(false);
        setStaus(false)
        // setStaus(!status);
        btnRef.current.style.display = "none";
        spinnerRef.current.style.animationPlayState = "paused"
      }
    };

    if (!gameOver && !isGameCompleted) {
      const collisionInterval = setInterval(checkCollision, 10);
      return () => clearInterval(collisionInterval);
    }
  }, [racer, barrier, gameOver, isGameCompleted]);

  // Handle score update and level change
  useEffect(() => {
    const handleAnimationIteration = () => {
      setScore((prevScore) => prevScore + 1);
      setReqScore(reqScore - 1);
      
      if (score >= 9) {
        if (level === levelConfigurations.length) {
          // Player has completed all levels
          setIsGameCompleted(true);
          setIsStarted(false); // Stop the game
        } else {
          setScore(0);
          setReqScore(10);
          setSpeed(speed - 0.2)
          setTime(time -200)
          if (level <= 9) {
            setLevel(level + 1);
            indicatorRef.current.style.display = "block" ;

          } else if (level >= 10) {
            setIsGameCompleted(!isGameCompleted);
          }

          setGarage((prevGarage) => [
            ...prevGarage,
            `${levelConfigurations[level - 1].user}`,
          ]);
          setIsStarted(!isStarted);
          setRating(rating + 0.5);
        }
      }
    };

    if (barrierRef.current) {
      barrierRef.current.addEventListener(
        "animationiteration",
        handleAnimationIteration
      );
    }

    return () => {
      if (barrierRef.current) {
        barrierRef.current.removeEventListener(
          "animationiteration",
          handleAnimationIteration
        );
      }
    };
  }, [score]);

  // Start or pause the game
  const playPause = () => {
    setIsStarted(!isStarted);
    setStaus(!status);
    indicatorRef.current.style.display = "none" ;
    barrierRef.current.style.animationPlayState = !isStarted
      ? "running"
      : "paused";
    spinnerRef.current.style.animationPlayState = (!isStarted )
    ? "running"
      : "paused";
    if (!isStarted) {
      intervalRef.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * positions.length);
        setBarrier(randomIndex);
      }, {time});
    } else {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <>
     <audio ref={audioRef} src={sound} loop />
     <audio ref={gameOverAudioRef} src={gameover} />
    <div id="game" className="game-main">
    
      {gameOver ? (
        <div className="text-white" style={{ flex: "1" }}>

          <div class="game-over-screen">
            <div class="game-over-content">
              <h1 class="game-over-title">Game Over</h1>
              <div class="game-over-buttons">
                <button class="btn btn-primary mb-2" onClick={(e) =>scoreCard(e)}>
                  Score Card
                </button>
                <button class="btn btn-danger mx-2 mb-2" onClick={(e)=> window.location.reload() }>
                  Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : isGameCompleted ? (
        <div className="text-white" style={{ flex: "1" }}>
          <div class="game-over-screen">
            <div class="game-over-content">
            <h1>Congratulations!</h1>
            <h2>You have completed all levels!</h2>
              <div class="game-over-buttons">
                <button class="btn btn-primary" onClick={(e) =>scoreCard(e)}>
                  Score Card
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="game-track">
          <div>
            <img
              className="barrier-img"
              src={barrierImg}
              alt="image"
              height="80"
              width="70"
              style={{
                animation: isStarted ? `move ${speed}s linear infinite` : "none",
                left: `${positions[barrier]}%`,
                animationPlayState: "paused",
              }}
              ref={barrierRef}
            />
          </div>
          <div >
            
            <img
              src={levelConfigurations[level - 1].user}
              style={{ left: `${positions[racer]}%` }}
              className="race-img"
              ref={racerRef}
              alt="racing resource"
              height="100"
              width="100"
            />
          </div>
          <div>
            <p className="level-indicator" ref={indicatorRef}>level {level}</p>
          </div>
        </div>
      )}

      <div className="game-stats p-3">
        <div className="mb-3">
          <h1 className="animated-text text-center">
            Welcome to the play ,
            <span className="text-danger text-capitalize"> {playerName} </span>..!
          </h1>
        </div>
        <div className="d-flex text-white justify-content-between">
          <div className="curlevCards">
            <h5>LEVEL</h5>
            <p>{level}</p>
          </div>
          <div className="curlevCards">
            <h5>SCORE</h5>
            <p>{score}</p>
          </div>
          <div className="curlevCards">
            <h5>Resource</h5>
            <img
              src={levelConfigurations[level - 1].user}
              alt="image"
              height="80"
              width="80"
            />
          </div>
          <div className="curlevCards">
            <h5>Play Status</h5>
            <div className="spinner" ref={spinnerRef}></div>
            <h5 className="m-0">{status ? "palying" : "Ideal"}</h5>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-3 text-white bg-black border next-level-info">
          <h4 className="p-2 m-0">
            Next Level :{" "}
            {level <= 9 ? (
              <span className="text-danger">{level + 1}</span>
            ) : (
              "last level"
            )}
          </h4>
          <h4 className="p-2 m-0">
            Required Score To Level Up :{" "}
            <span className="text-danger">{reqScore}</span>
          </h4>
        </div>
        <div className="text-white d-flex justify-content-evenly mt-3 next-level-rating">
          <div className="d-flex justify-content-center align-items-center p-2 border bg-black">
            <h4>Next level Reward : </h4>
            {level <= 9 ? (
              <img
                src={levelConfigurations[level].user}
                alt="image"
                height="80"
                width="80"
              />
            ) : (
              "Last level"
            )}
          </div>
          <div className="p-2 border d-flex justify-content-center align-items-center flex-column bg-black">
            <h4>Curent Rating</h4>
            <p className="m-0">{rating} / 5</p>
          </div>
        </div>
        <div>
          <div className="border text-white mt-3 ">
            <p className="bg-danger text-center m-0 p-2">
              garage<span> [ Your winnings ]</span>
            </p>
            {garage.length == 0 ? (
              <div
                className="d-flex justify-content-center align-items-center bg-black m-0 "
                style={{ height: "80px" }}
              >
                <p className="m-0">No winnings</p>
              </div>
            ) : (
              <div className="d-flex bg-black garage" style={{ height: "80px" }}>
                {garage.map((item, key) => (
                  <div>
                    <img src={garage[key]} alt="image" height="80" width="80" className="garage-img" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="d-flex text-white mt-3 play-btns">
            <div className="flex-fill">
              <div className="d-flex justify-content-evenly align-items-center">
                <h3 className="m-0 bg-gradient px-2 py-1 border">
                  Play <i className="bi bi-caret-up-fill text-danger"></i>
                </h3>
                <h3 className="m-0 bg-gradient px-2 py-1 border">
                  Pause <i className="bi bi-caret-down-fill text-danger"></i>
                </h3>
                <h3 className="m-0 bg-gradient px-2 py-1 border">
                  Left <i className="bi bi-caret-left-fill text-danger"></i>
                </h3>
                <h3 className="m-0 bg-gradient px-2 py-1 border">
                  Right <i className="bi bi-caret-right-fill text-danger"></i>
                </h3>
              </div>
            </div>
            <div className="d-flex align-items-center start-btn">
              <button
                className={!isStarted ? "btn btn-success" : "btn btn-warning"}
                style={{ width: "100px" }}
                onClick={playPause}
                ref={btnRef}
              >
                {isStarted ? "Pause" : "Start"}
              </button>
              <button className='btn btn-danger mx-2' style={{width:"100px"}} 
                onClick={(e) => navigate("/")}>Exit</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="mobile-message text-danger">
        <p>Sorry, this game is only available on desktop and tablet devices.</p>
        <p>Please visit our site from a larger screen to play the game.</p>
      </div>
    </>
  );
};

export default Game;
