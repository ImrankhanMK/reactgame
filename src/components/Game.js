import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
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

const Game = () => {
  //props
  const location = useLocation();
  const playerName = location.state.playerName;
  //resources
  const levelConfigurations = [
    { user: bicycle, barrier: barrierImg, speed: 2 },
    { user: horse, barrier: barrierImg, speed: 1.8 },
    { user: bike, barrier: barrierImg, speed: 1.8 },
    { user: car, barrier: barrierImg, speed: 1.8 },
    { user: van, barrier: barrierImg, speed: 1.8 },
    { user: amb, barrier: barrierImg, speed: 1.8 },
    { user: bus, barrier: barrierImg, speed: 1.8 },
    { user: dmpt, barrier: barrierImg, speed: 1.8 },
    { user: lorry, barrier: barrierImg, speed: 1.8 },
    { user: euro, barrier: barrierImg, speed: 1.8 },
  ];
  //useref
  const barrierRef = useRef(null);
  const userRef = useRef(null);
  const startBtn = useRef(null);
  //state management
  const [user, setUser] = useState(20);
  const [barrier, setBarrier] = useState(20);
  const [gameOver, setGameOver] = useState(false  );
  const [score, setScore] = useState(0);
  const [reqScore, setReqScore] = useState(3);
  const [isStarted, setIsStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [animationKey, setAnimationKey] = useState(0);
  const [garage,setGarage] = useState([]);
  // const [iterationCount, setIterationCount] = useState(0);
  //running man left right movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 39) {
        // Right arrow key
        setUser((prevLeft) => Math.min(prevLeft + 150, 170));
      } else if (e.keyCode === 37) {
        // Left arrow key
        setUser((prevLeft) => Math.max(prevLeft - 150, 20));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  //barrier animation
  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomLeft = Math.random() > 0.5 ? "170px" : "20px";
      setBarrier(randomLeft);
    }, 2000); // Change position every 2 seconds
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    if (barrierRef.current) {
      barrierRef.current.style.left = barrier;
    }
  }, [barrier]);
  //game over functionality
  useEffect(() => {
    const checkCollision = () => {
      if (userRef.current && barrierRef.current) {
        var userComputedStyle = parseInt(window.getComputedStyle(userRef.current).getPropertyValue("left"));
        var barrierComputedStyle = parseInt(window.getComputedStyle(barrierRef.current).getPropertyValue("left"));
        var barrierComputedTopStyle = parseInt(window.getComputedStyle(barrierRef.current).getPropertyValue("top"));
        if((barrierComputedStyle===(userComputedStyle))&&(barrierComputedTopStyle > 260)&&(barrierComputedTopStyle < 450)){
          setGameOver(true);
        }
      }
    };

    const collisionInterval = setInterval(checkCollision, 10);
    return () => clearInterval(collisionInterval);
  }, [user, barrier]);

  useEffect(() => {
    if (gameOver) {
      if (barrierRef.current) {
        barrierRef.current.style.animationPlayState = "paused";
      }
    }
  }, [gameOver]);
  //score
  useEffect(() => {
    const handleAnimationIteration = () => {
      setScore((prevScore) => prevScore + 1);
      setReqScore(reqScore-1);
      if (score >= 3) {
        setScore(0);
        setReqScore(3);
        setLevel(level + 1);
        setGarage((prevGarage) => [...prevGarage, `${levelConfigurations[level-1].user}`]);
        setIsStarted(false);
        setAnimationKey((prevKey) => prevKey + 1);
        // if (barrierRef.current) {
        //   barrierRef.current.style.animationPlayState = "paused";
        // }
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
  //start and pause
  const startAndPause = (e) => {
    e.preventDefault();
    if (isStarted) {
      barrierRef.current.style.animationPlayState = "paused";
    } else {
      barrierRef.current.style.animationPlayState = "running";
    }

    setIsStarted(!isStarted);
  };

  return (
    <div id="game" className="game_main">
      <div className="game_body d-flex">
        {/* game div  */}
        <div className="game_play d-flex">
          <h1 className="text-white d-inline">Level {level}</h1>
          {gameOver ? (
            <div className="text-white">
            {gameOver ? <div className="game-over">Game Over</div> : ""} 
            <h1>Nice play</h1>
            </div>
            
          ) : (
            <div className="game_pitch">
              <div
                className="barrier"
                key={animationKey}
                ref={barrierRef}
                style={{
                  position: "absolute",
                  left: `${barrier}px`,
                  animation: `move 2s linear infinite`,
                  animationPlayState: "paused",
                }}
              >
                <img src={barrierImg} alt="" height="100" />
              </div>
              <div
                className="running_man"
                ref={userRef}
                style={{ position: "absolute", left: `${user}px`, bottom: "0" }}
              >
                <div>
                  <span className="text-white border p-1">{playerName}</span>
                </div>
                <img
                  src={levelConfigurations[level - 1].user}
                  alt=""
                  height="100"
                  width="100"
                />
              </div>
            </div>
          )}
        </div>
        {/* score div  */}
        <div className="game_score text-white">
          <h1 className="m-0 text-white text-center">
            Welcome to the Game ,
            <span className="text-danger">{playerName}</span> !
          </h1>
          <div className="d-flex justify-content-evenly gap-3 mb-3">
            <div className="border w-100">
              <p className="bg-danger text-center">Playing Level</p>
              <p>Level : {level}</p>
              <p>Score : {score}</p>
              <p>Required Remaning Score To Level Up :{reqScore}</p>
              <p>Resource :</p>
              <img
                  src={levelConfigurations[level - 1].user}
                  alt="image"
                  height="100"
                  width="100"
                />
            </div>
            <div className="border w-100">
              <p className="bg-danger text-center">next level rewards</p>
              <p>Upcoming Level : {level+1}</p>
              <p>total Score complete Level : 10</p>
              <p>Level Reward :</p>
              <img
                  src={levelConfigurations[level].user}
                  alt="image"
                  height="100"
                  width="100"
                />
              <p>Rating On Level Completion : 0.5</p>
            </div>
          </div>
          <div className="border">
            <p className="bg-danger text-center">garage<span>[ Your winnings ]</span></p>
            {garage.length == 0 ? (<p>No winnings</p>):(
              <div className="d-flex">
              {garage.map((item,key) => (
                <div>
                <img
                  src={garage[key]}
                  alt=""
                  height="80"
                  width="80"
                />
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div>
          <botton
            className="btn btn-success"
            onClick={(e) => startAndPause(e)}
            ref={startBtn}
          >
            {isStarted ? "Pause" : "Start"}
          </botton>
        </div>
      </div>
      {/* <h2 className="text-white">Score: {score}</h2> */}
    </div>
  );
};

export default Game;
