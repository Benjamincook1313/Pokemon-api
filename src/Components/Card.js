import React, { useState, useEffect } from 'react'
import CardBack from '/Users/benjamin/fun-projects/Practice/pokemon/src/images/pokemon card.jpeg'

const Card = ({id, name, img, types, playingGame}) => {

  const [showCard, setShowCard] = useState(true)
  const [startGame, setStartGame] = useState(false)

  useEffect(() => {
    if(playingGame && !startGame){
      setShowCard(false)
    }
    if(!playingGame){
      setShowCard(true)
      setStartGame(false)
    }
  }, [playingGame, startGame])

  const typeColor = (str) => {
    switch(str){
      case 'normal': 
        return '#A8A77A'
      case 'fire':  
        return '#EE8130'
      case 'water':  
        return '#6390F0'
      case 'electric':  
        return '#F7D02C'
      case 'grass':  
        return '#7AC74C'
      case 'ice':  
        return '#96D9D6'
      case 'fighting':  
        return '#C22E28'
      case 'poison':  
        return '#A33EA1'
      case 'ground':  
        return '#E2BF65'
      case 'flying':  
        return '#A98FF3'
      case 'psychic':  
        return '#F95587'
      case 'bug':  
        return '#A6B91A'
      case 'rock':  
        return '#B6A136'
      case 'ghost':  
        return '#735797'
      case 'dragon':  
        return '#6F35FC'
      case 'dark':  
        return '#705746'
      case 'steel':  
        return '#B7B7CE'
      case 'fairy':  
        return '#D685AD'
      default: 
        return ['white']
    }
  };

  const getColors = () => {
    if(!types[1]){
      return typeColor(`${types[0].type.name}`)
    }else{
      let color1 = typeColor(`${types[0].type.name}`)
      let color2 = typeColor(`${types[1].type.name}`)
      return `linear-gradient(90deg, ${color1}, ${color2})`
    }
  };

  const handleFlip = () => {
    setShowCard(!showCard)
    if(!startGame){
      setStartGame(true)
    }
  };

  return (
    <div className='Card' style={{background: `${getColors()}`}} onClick={handleFlip}>
      {showCard? 
        <div className='card-info'>
          <p>#0{id}</p>
          <div className='img-container'>
            <img className='poke-img' src={img} alt={name} />
          </div>
          <h2>{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
          {types.length > 1?
            <p>
              Type: {`${types[0].type.name}/${types[1].type.name}`}
            </p>
            :<p>Type: {types[0].type.name}</p>
          }
        </div>: 
        <div>
          {/* <h1>Pokemon Memory</h1> */}
          <img className='card-back' src={CardBack} alt='Pokemon Card'/>
        </div>
      }
    </div>
  )
};

export default Card;