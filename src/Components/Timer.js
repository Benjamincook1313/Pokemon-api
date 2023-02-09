import React, { useState, useEffect } from 'react'
import { Clock, Num } from './Styles/Style'

function Timer(props) {

  const { startTime, playingGame, setFinalTime } = props

  const [start, setStart] = useState(false)
  const [time, setTime] = useState(0)

  let min = ('0' + Math.floor((time / 60000) % 60)).slice(-2)
  let sec = ('0' + Math.floor((time / 1000) % 60)).slice(-2)
  let ms = ('0' + (time / 10) % 100).slice(-2)

  useEffect(() => {
    let interval = null;

    if(start){
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10)
        setFinalTime(`${min}:${sec}:${ms}`)
      }, 10)
      
    }else clearInterval(interval)
    
    if(startTime && playingGame) setStart(true)
    
    if(!playingGame) setTime(0)
    
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
        <Num>{min}:</Num>
        <Num>{sec}:</Num>
        <Num>{ms}</Num>
      </Clock>
    </div>
  );
}

export default Timer;
