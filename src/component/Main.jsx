import React, { useEffect, useRef, useState } from "react";
import "../assets/css/main.css";
import Button from "./Button";
import Points from "./Points";

export default function Main() {
  const [totalTime, setTotalTime] = useState(0);
  const mapRef = useRef(null);
  const timeRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [point, setPoint] = useState(null);
  const [message, setMessage] = useState("let's play");
  const [stateGame, setStateGame] = useState(false);
  const [keyPoint, setKeyPoint] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [nextPointIndex, setNextPointIndex] = useState(null);
  const [isGameEnded, setIsGameEnded] = useState(false);

  const handleInputPoint = (e) => {
    setInputValue(e.target.value);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  const calculateTotalTime = () => {
    timeRef.current = setInterval(() => {
      setTotalTime((prev) => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);
  };

  // handle total time and take pointa from input
  const handlePlay = () => {
    const pointValue = parseInt(inputValue);
    if (isNaN(pointValue) || pointValue <= 0) return;
    clearInterval(timeRef.current);
    setIsAutoPlaying(false);
    setTotalTime(0);
    setPoint(pointValue);
    setKeyPoint((prev) => prev + 1);
    setMessage("let's play");
    setIsGameEnded(false);

    if (!stateGame) {
      setStateGame(true);
    }
    calculateTotalTime();
  };

  // function stop time when all points were clearly or stop game if user click button incorrectly
  const stopGame = (mess) => {
    clearInterval(timeRef.current);
    setMessage(mess);
    setStateGame(false);
    setIsAutoPlaying(false);
    setIsGameEnded(true);
    setPoint(null);
  };

  const getMessageClass = (message) => {
    if (message === "all cleared") return "message-success";
    if (message === "game over") return "message-fail";
    return "";
  };

  // get map from DOM
  useEffect(() => {
    if (mapRef.current) {
      const width = mapRef.current.offsetWidth;
      const height = mapRef.current.offsetHeight;
      setMapSize({ width, height });
    }
  }, []);

  return (
    <div className="w-100 h-100 position-relative">
      <div className="position-absolute top-50 start-50 translate-middle p-3 main-layout d-flex flex-column">
        <div
          className={`h5 text-uppercase text-start ${getMessageClass(message)}`}
        >
          {message}
        </div>
        <div className="d-flex">
          <label>Point:</label>
          <input
            onChange={handleInputPoint}
            className="ms-5"
            type="number"
            min={1}
          />
        </div>
        <div className="d-flex">
          <div>Time:</div>
          <div className="ms-5">{totalTime}s</div>
        </div>
        <div className="text-start m-0 mt-1 mb-1 d-flex">
          <div className="me-1">
            <Button
              content={isGameEnded || stateGame ? "Restart" : "Play"}
              handleTime={handlePlay}
            />
          </div>
          {stateGame && !isGameEnded && (
            <div className="ms-1">
              <Button
                content={isAutoPlaying ? "Auto Play Off" : "Auto Play On"}
                handleTime={toggleAutoPlay}
              />
            </div>
          )}
        </div>
        <div
          ref={mapRef}
          className="border border-1 border-black w-100 flex-grow-1 map-border mb-2"
        >
          <Points
            key={keyPoint}
            width={mapSize.width}
            height={mapSize.height}
            points={point}
            stopGame={stopGame}
            isAutoPlaying={isAutoPlaying}
            setNextPointIndex={setNextPointIndex}
          />
        </div>
        {nextPointIndex !== null && (
          <div className="mt-1 next-index">Next: {nextPointIndex}</div>
        )}
      </div>
    </div>
  );
}
