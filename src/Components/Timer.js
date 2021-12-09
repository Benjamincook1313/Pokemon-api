import React, { useState, useEffect } from 'react'
import { Clock, Num } from './Styles/Style'

function Timer(props) {

  const { startTime, playingGame } = props

  const [start, setStart] = useState(false)
  const [time, setTime] = useState(0)

  useEffect(() => {
    let interval = null;

    if(start){
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10)
      }, 10)
    }else{
      clearInterval(interval)
    }
    if(startTime && playingGame && startTime){
      setStart(true)
    }
    if(!playingGame){
      setTime(0)
    }
    if(!startTime){
      setStart(false)
      clearInterval(interval)
      setTime(0)
    }

    return () => clearInterval(interval)
  }, [start, startTime, time, playingGame])

  return (
    <div className='Timer'>
      <Clock>
        <Num>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</Num>
        <Num>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}:</Num>
        <Num>{('0' + (time / 10) % 100).slice(-2)}</Num>
      </Clock>
    </div>
  );
}

export default Timer;
