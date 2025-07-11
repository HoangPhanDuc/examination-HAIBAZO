import React, { useEffect, useState, useRef } from "react";
import "../assets/css/onepoint.css";

export default function OnePoint({
  x,
  y,
  index,
  removing,
  locked,
  wrong,
  removePoint,
}) {
  const [countdown, setCountdown] = useState(3.0);
  const [frozenOpacity, setFrozenOpacity] = useState(null);
  const [frozenCountdown, setFrozenCountdown] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (removing && !locked) {
      setCountdown(3.0);
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          const next = parseFloat((prev - 0.1).toFixed(1));
          if (next <= 0) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return next;
        });
      }, 100);
    }

    return () => clearInterval(intervalRef.current);
  }, [removing, locked]);

  useEffect(() => {
    if ((locked || wrong) && frozenOpacity === null && countdown < 3) {
      clearInterval(intervalRef.current);
      setFrozenCountdown(countdown);
      setFrozenOpacity(countdown / 3);
    }
  }, [locked, wrong, countdown, frozenOpacity]);

  let currentOpacity;
  if (locked || wrong) {
    currentOpacity = frozenOpacity !== null ? frozenOpacity : 1;
  } else if (removing) {
    currentOpacity = countdown / 3;
  } else {
    currentOpacity = 1;
  }

  return (
    <div
      onClick={removePoint}
      className={`one-point ${removing || wrong ? "effectPointRemove" : ""}`}
      style={{
        top: `${y}px`,
        left: `${x}px`,
        opacity: currentOpacity,
        transition:
          (!locked && removing) || wrong ? "opacity 3s linear" : "none",
      }}
    >
      <div className="d-flex flex-column text-center">
        <div>{index}</div>
        {removing && !locked && (
          <div style={{ fontSize: "0.8em" }}>{countdown.toFixed(1)}s</div>
        )}
        {wrong && <div style={{ fontSize: "0.8em" }}>3.0s</div>}
        {locked && frozenCountdown !== null && (
          <div style={{ fontSize: "0.5em" }}>{frozenCountdown.toFixed(1)}s</div>
        )}
      </div>
    </div>
  );
}
