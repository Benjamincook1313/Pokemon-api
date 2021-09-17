import React from 'react'

const Card = ({id, name, img, type, key}) => {
  return (
    <div className='card'>
      <h2>{name}</h2>
    </div>
  )
};

export default Card;