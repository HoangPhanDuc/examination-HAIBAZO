import React, { useEffect, useRef, useState } from "react";
import OnePoint from "./OnePoint";

export default function Points({
  width,
  height,
  points,
  stopGame,
  isAutoPlaying,
  setNextPointIndex,
}) {
  const pointSize = 30;
  const halfSize = pointSize / 2;
  const [pointList, setPointList] = useState([]);
  const timeoutsRef = useRef([]);
  const gameOverRef = useRef(false);
  const autoPlayTimeoutRef = useRef(null);
  const pointListRef = useRef([]);

  // create a list points
  const createPoints = (p, w, h) => {
    const tempPointsList = [];
    for (let i = 0; i < p; i++) {
      const x = Math.floor(Math.random() * (w - pointSize)) + halfSize;
      const y = Math.floor(Math.random() * (h - pointSize)) + halfSize;
      tempPointsList.push({ x, y, index: i + 1, removing: false });
    }
    return tempPointsList;
  };

  // remove point after user click point
  const removePointAfterClick = (indexClickPoint) => {
    if (gameOverRef.current) return;

    setPointList((prev) => {
      const firstNotRemoved = prev.find((p) => !p.removing);
      if (firstNotRemoved && firstNotRemoved.index === indexClickPoint) {
        const updatedList = prev.map((p) =>
          p.index === indexClickPoint ? { ...p, removing: true } : p
        );

        const timeout = setTimeout(() => {
          if (gameOverRef.current) return;
          setPointList((prev) => {
            const newList = prev.filter((p) => p.index !== indexClickPoint);
            if (newList.length === 0) {
              stopGame("all cleared");
            }
            return newList;
          });
        }, 3000);

        timeoutsRef.current.push(timeout);
        return updatedList;
      } else {
        gameOverRef.current = true;
        clearTimeout(autoPlayTimeoutRef.current);
        timeoutsRef.current.forEach((time) => clearTimeout(time));
        const updatedList = prev.map((p) =>
          p.index === indexClickPoint
            ? { ...p, locked: true, wrong: true }
            : { ...p, locked: true }
        );
        stopGame("game over");
        return updatedList;
      }
    });
  };

  // reset points
  useEffect(() => {
    if (!points || width === 0 || height === 0) return;
    const generatedPoints = createPoints(points, width, height);
    gameOverRef.current = false;
    timeoutsRef.current = [];
    pointListRef.current = generatedPoints;
    setPointList(generatedPoints);
  }, [points, width, height]);

  // update ref to always have latest point list
  useEffect(() => {
    pointListRef.current = pointList;
  }, [pointList]);

  // set next point after click
  useEffect(() => {
    const first = pointList.find((p) => !p.removing);
    if (setNextPointIndex) {
      setNextPointIndex(first ? first.index : null);
    }
  }, [pointList, setNextPointIndex]);

  // auto play
  useEffect(() => {
    if (!isAutoPlaying || gameOverRef.current || pointList.length === 0) return;

    const autoPlayNext = () => {
      const nextPoint = pointListRef.current.find((p) => !p.removing);
      if (nextPoint) {
        removePointAfterClick(nextPoint.index);
        autoPlayTimeoutRef.current = setTimeout(autoPlayNext, 1000);
      }
    };

    autoPlayTimeoutRef.current = setTimeout(autoPlayNext, 1000);

    return () => clearTimeout(autoPlayTimeoutRef.current);
  }, [isAutoPlaying]);

  return (
    <div className="position-relative">
      {pointList.map((point) => (
        <OnePoint
          key={point.index}
          x={point.x}
          y={point.y}
          index={point.index}
          removing={point.removing}
          locked={point.locked}
          wrong={point.wrong}
          removePoint={() => removePointAfterClick(point.index)}
        />
      ))}
    </div>
  );
}
