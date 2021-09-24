import React from 'react'

const Card = ({id, name, img, types}) => {

  // const typeColor = () => {
  //   console.log(types[0].type.name)
  //   switch(types[0].type.name){
  //     case 'grass': 
  //       return 'lightgreen'
  //       break;
  //     case 'bug':
  //       return 'lightyellow'
  //       break;
  //     default: 
  //       return 'white'
  //   }
  // };

  return (
    <div className='Card'>
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
    </div>
  )
};

export default Card;