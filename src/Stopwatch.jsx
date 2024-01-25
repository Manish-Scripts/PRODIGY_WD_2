import React, { useState, useEffect, useRef } from 'react';

const LapButton = ({ onLap }) => {
  return (
    <button onClick={onLap} className="lap-button">
      Lap
    </button>
  );
};

const Stopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);
  const lapListContainerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    // Scroll to the bottom when laps change
    if (lapListContainerRef.current) {
      lapListContainerRef.current.scrollTop = lapListContainerRef.current.scrollHeight;
    }
  }, [laps]);

  function start() {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
  }

  function stop() {
    setIsRunning(false);
  }

  function reset() {
    setElapsedTime(0);
    setLaps([]);
    setIsRunning(false);
  }

  function lap() {
    setLaps([...laps, formatTime()]);
  }

  function formatTime() {
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');
    milliseconds = String(milliseconds).padStart(2, '0');

    return `${minutes}:${seconds}:${milliseconds}`;
  }

  return (
    <>
    <div className="stopwatch">
      <div className="display">{formatTime()}</div>
      <div className="controls">
        <button onClick={start} className="start-button">
          Start
        </button>
        <button onClick={stop} className="stop-button">
          Stop
        </button>
        <button onClick={reset} className="reset-button">
          Reset
        </button>
        <LapButton onLap={lap} />
      </div>
    </div>
      {laps.length > 0 && (
        <div className="lap-list" ref={lapListContainerRef}>
          <table>
            <thead>
              <tr>
                <th>Lap</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap, index) => (
                <tr key={index}>
                  <td>{` ${index + 1}`}</td>
                  <td>{lap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Stopwatch;
