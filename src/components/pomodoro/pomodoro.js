import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSyncAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import './style.css';

function PomodoroTimer() {
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft > 0) {
            return prevTimeLeft - 1;
          } else {
            setIsWorkTime((prevIsWorkTime) => {
              if (prevIsWorkTime) {
                return false; // Switch to break time
              } else {
                return true; // Switch to work time
              }
            });
            return isWorkTime ? breakDuration : workDuration;
          }
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, workDuration, breakDuration, isWorkTime]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkTime(true);
    setTimeLeft(workDuration);
  };

  const toggleSettingsModal = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const getCircleColor = () => {
    const totalTime = isWorkTime ? workDuration : breakDuration;
    const remainingTime = timeLeft;
    const percentage = remainingTime / totalTime;

    const green = Math.min(Math.floor(255 * (1 - percentage * 2)), 255);
    const red = Math.min(Math.floor(255 * (percentage * 2 - 1)), 255);

    return `linear-gradient(to bottom, rgb(${green}, 255, 0), rgb(${red}, 0, 0))`;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <section>
      <div className="container">
        <h1>pomodoro</h1>

        <div className="painel">
          <p id="work" className={isWorkTime ? 'active' : ''} onClick={() => { setIsWorkTime(true); setTimeLeft(workDuration); }}>work</p>
          <p id="break" className={!isWorkTime ? 'active' : ''} onClick={() => { setIsWorkTime(false); setTimeLeft(breakDuration); }}>break</p>
        </div>

        <div className="timer">
          <div className="circle" style={{ background: getCircleColor() }}>
            <div className="time">
              <p>{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        <div className="controls">
          {isRunning ? (
            <button id="pause" onClick={pauseTimer}><FontAwesomeIcon icon={faPause} /></button>
          ) : (
            <button id="start" onClick={startTimer}><FontAwesomeIcon icon={faPlay} /></button>
          )}
          <button id="reset" onClick={resetTimer}><FontAwesomeIcon icon={faSyncAlt} /></button>
          <button id="settings" onClick={toggleSettingsModal}><FontAwesomeIcon icon={faCog} /></button>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <h2>Set Timer Durations</h2>
              <label htmlFor="workDuration">Work Duration (minutes):</label>
              <input
                type="number"
                id="workDuration"
                value={workDuration / 60}
                onChange={(e) => setWorkDuration(parseInt(e.target.value) * 60)}
              />
              <label htmlFor="breakDuration">Break Duration (minutes):</label>
              <input
                type="number"
                id="breakDuration"
                value={breakDuration / 60}
                onChange={(e) => setBreakDuration(parseInt(e.target.value) * 60)}
              />
              <button onClick={toggleSettingsModal}>Save</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PomodoroTimer;
