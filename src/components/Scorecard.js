import React from 'react';
import { useLocation,useNavigate } from "react-router-dom";
import horse from "../images/horse.png";
import bicycle from "../images/bicycle.png";
import bike from "../images/bike.png";
import car from "../images/car.png";
import van from "../images/van.png";
import amb from "../images/ambulance.png";
import bus from "../images/bus.png";
import dmpt from "../images/gartruck.png";
import lorry from "../images/lorry.png";
import euro from "../images/euro.png";
import '../css/scorecard.css';

function Scorecard() {
    const location = useLocation();
    const navigate = useNavigate();
    const playerName = location.state?.playerName || "Unknown Player";
    const level = location.state?.level || 0;
    const rating = location.state?.rating || 0;
    const score = location.state?.score || 0;
    const garage = location.state?.winnings || [];
    const complete = location.state?.complete || 0;
    
    const numItemsToDisplay = typeof garage === 'number' ? garage : garage.length;

    const levelConfigurations = [
        { user: bicycle, name: "Bicycle" },
        { user: horse, name: "Horse" },
        { user: bike, name: "Bike" },
        { user: car, name: "Car" },
        { user: van, name: "Van" },
        { user: amb, name: "Ambulance" },
        { user: bus, name: "Bus" },
        { user: dmpt, name: "Dump Truck" },
        { user: lorry, name: "Lorry" },
        { user: euro, name: "Truck" },
        { user: "last level", name: "Truck" },
    ];

    return (
        <>
        <div className='scorecard-main d-flex flex-column justify-content-center align-items-center'>
            <h1>{playerName}'s Score card</h1>
            <h2>Levels Played :<span className='score-dis'> {level} </span>/<span className='base-dis'> 10 </span></h2>
            <h2>Completed Levels :<span className='score-dis'> {complete ? 10 : level-1 } </span></h2>
            <h2>Last Level Score : <span className='score-dis'> {complete ? 10 : score} </span></h2>
            <h2>Total score : <span className='score-dis'>{(level-1) *10 + score}</span> /<span className='base-dis'> 100 </span></h2>
            <h2>Rating : <span className='score-dis'> {rating} </span>/<span className='base-dis'> 5 </span></h2>
            <h2 className='mt-3 bg-gradient px-4 py-2 border border-danger rounded-2'>Winnings</h2>
            <div className='scorecard-win d-flex g-1 flex-wrap'>
                {Array.from({ length: numItemsToDisplay }, (_, index) => {
                    const config = levelConfigurations[index];
                    return config ? (
                        <div key={index} className="item">
                            <img 
                                src={config.user} 
                                alt={config.name} 
                                height="70" 
                                width="70" 
                            />
                            <p>{config.name}</p>
                        </div>
                    ) : (
                        <p key={index}>Invalid item at index {index}</p>
                    );
                })}
            </div>
            <div className='d-flex justify-content-center align-items-center mt-2 gap-3'>
                <button className='btn btn-primary' style={{width:"100px"}} onClick={(e) =>  navigate("/game", { state: { playerName: playerName } })}>Replay</button>
                <button className='btn btn-danger' style={{width:"100px"}} 
                onClick={(e) => navigate("/")}>Exit</button>
            </div>
        </div>
        <div className="mobile-message text-danger">
        <p>Sorry, this game is only available on desktop and tablet devices.</p>
        <p>Please visit our site from a larger screen to play the game.</p>
      </div>
        </>
    );
}

export default Scorecard;
