import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSyncAlt, faCog } from '@fortawesome/free-solid-svg-icons';
import './style.css';

function PomodoroTimer() {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [minutes, setMinutes] = useState(workDuration);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsRunning(false);
          if (workDuration > 0) {
            setMinutes(workDuration);
          } else {
            setMinutes(breakDuration);
          }
        }
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, minutes, seconds, workDuration, breakDuration]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(workDuration);
    setSeconds(0);
  };

  const toggleSettingsModal = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const getCircleColor = () => {
    const totalSeconds = minutes * 60 + seconds;
    const totalTime = workDuration * 60;
    const percentage = totalSeconds / totalTime;

    const green = Math.min(Math.floor(255 * (1 - percentage * 2)), 255);
    const red = Math.min(Math.floor(255 * (percentage * 2 - 1)), 255);

    return `linear-gradient(to bottom, rgb(${green}, 255, 0), rgb(${red}, 0, 0))`;
  };

  return (
    <section>
      <div className="container">

        <div className="painel">
          <p id="work" className={workDuration === minutes ? 'active' : ''} onClick={() => setMinutes(workDuration)}>work</p>
          <p id="break" className={breakDuration === minutes ? 'active' : ''} onClick={() => setMinutes(breakDuration)}>break</p>
        </div>

        <div className="timer">
          <div className="circle" style={{ background: getCircleColor() }}>
            <div className="time">
              <p id="minutes">{minutes < 10 ? `0${minutes}` : minutes}</p>
              <p>:</p>
              <p id="seconds">{seconds < 10 ? `0${seconds}` : seconds}</p>
            </div>
          </div>
        </div>

        <div className="controls">
          <button id="start" onClick={startTimer}><FontAwesomeIcon icon={faPlay} /></button>
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
                value={workDuration}
                onChange={(e) => setWorkDuration(parseInt(e.target.value))}
              />
              <label htmlFor="breakDuration">Break Duration (minutes):</label>
              <input
                type="number"
                id="breakDuration"
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value))}
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
