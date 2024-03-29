import React, { useState, useEffect } from 'react'
import './Styles/Card.css'
import CardBack from '../images/pokemon card.jpeg'

export default function Card({ 
  i, id, name, img, types, playingGame, checkCard, card1, card2, 
  flipCards, matches1, matches2, endGame, allPokemon, startTime, 
  stopTime, timeStarted
}) {

  const [showCard, setShowCard] = useState(true)
  const [startGame, setStartGame] = useState(false)

  useEffect(() => {
    if(playingGame && !startGame) setShowCard(false)

    if(!playingGame){
      setShowCard(true)
      setStartGame(false)
    }

    if(card1[0] === i && flipCards) setShowCard(false)
    if(card2[0] === i && flipCards) setShowCard(false)

    if((matches1.length + matches2.length) === (allPokemon.length / 2) && playingGame && startGame && (matches1.length + matches2.length) !== 0){
      endGame()
      stopTime()
      setStartGame(false)
    }

    if(!timeStarted && startGame){
      setStartGame(false)
      setShowCard(false)
    }

  }, [playingGame, startGame, flipCards, card1, card2, i, matches1, matches2, endGame, allPokemon, stopTime, startTime])

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


  const selectCard = () => {
    if(!startGame){
      setStartGame(true)
      startTime()
    }
    if(!showCard){
      setShowCard(true)
      checkCard()
    }
  };

  return (
    <div className={`${playingGame? 'Card small': 'Card'}`} style={{background: `${getColors()}`}} onClick={selectCard}>
      {showCard? 
        <div className='card-info'>
          <div className='card-top'>
            <p style={{margin: '0px'}}>#0{id}</p>
          </div>
          <div className='img-container'>
            <img className='poke-img' src={img} alt={name} />
          </div>
          <h2 className={playingGame? 'card-small': 'card-name'}>{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
            {types.length > 1?
              <p style={{margin: '0px 5px'}}>type: {`${types[0].type.name} / ${types[1].type.name}`}</p>:
              <p style={{margin: '0px 5px'}}>type: {types[0].type.name}</p>
            }
        </div>: 
        <div>
          <img className='card-back small' src={CardBack} alt='Pokemon Card'/>
        </div>
      }
    </div>
  )
};