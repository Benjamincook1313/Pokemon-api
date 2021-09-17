import React from 'react'

const Card = ({id, name, img, type}) => {
  return (
    <div className='Card'>
      <p>#0{id}</p>
      <div className='img-container'>
        <img className='poke-img' src={img} alt={name} />
      </div>
      <h2>{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
      <p>type: {type}</p>
    </div>
  )
};

export default Card;