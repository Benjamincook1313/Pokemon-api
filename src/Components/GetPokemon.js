import React, { Component } from 'react';
import Card from './Card';


export default class GetPokemon extends Component {
  constructor(){
    super()

    this.state = {
      loaded: false,
      url: 'https://pokeapi.co/api/v2/pokemon/1',
      pokeData: {},
    }

  };
  
  
  render() {
    const { url, loaded, pokeData } = this.state

    const getPokemon = async () => {
      const res = await fetch(url)
      const data = await res.json()
        this.setState({
          loaded: true,
          pokeData: data
        })
    };

    // const createCard = pokeData.map((pokemon, i) => {
    //   <Card 
    //     id={pokeData.id}
    //     name={pokeData.name}
    //     img={pokeData.sprites.other.dream_world.front_default}
    //     type={pokeData.types[0].type.name}
    //     key={i}
    //   />
    // });

    console.log(pokeData)
    return (
      <div>
        <button onClick={getPokemon}>Get Pokemon</button>
        {loaded ?  
          <div>
            <img src={pokeData.sprites.other.dream_world.front_default} alt={pokeData.name} />
          </div>: 
          <h3>...loading</h3>
        }
        {/* {createCard} */}
        <h1>{pokeData.name}</h1>
        {/* <h2>{pokeData.id}</h2> */}
        {/* <img src={pokeData.sprites.other.dream_world.front_default} alt={pokeData.name}/> */}
      </div>
    )
  }
};
