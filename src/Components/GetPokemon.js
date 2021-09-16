import React, { Component } from 'react';
import Cards from './Card';


export default class GetPokemon extends Component {
  constructor(){
    super()

    this.state = {
      loading: false,
      url: 'https://pokeapi.co/api/v2/pokemon/1',
      pokeData: {},
    }

    // const getPokemon = async () => {
    //   this.setState({loading: true})
    //   const res = await fetch(this.state.url)
    //   const data = await res.json()
    //     this.setState({
    //       loading: false,
    //       pokeData: data
    //     })
    // }

  };
  
  // componentDidMount(){
  //   getPokemon()
  // }
  
  render() {
    const { url, loading, pokeData } = this.state

    const getPokemon = async () => {
      this.setState({loading: true})
      const res = await fetch(url)
      const data = await res.json()
        this.setState({
          loading: false,
          pokeData: data
        })
    };

    // console.log(pokeData.sprites.other.dream_world.front_default)
    console.log(pokeData)
    return (
      <div>
        <button onClick={getPokemon}>Get Pokemon</button>
        {loading ?  
          <div>
            <h2>...loading</h2>
            {/* <img src={pokeData.sprites.other.dream_world.front_default} alt={pokeData.name} /> */}
          </div>
          : ''
        }
        {/* {Cards} */}
        <h1>{pokeData.name}</h1>
        {/* <img src={pokeData.sprites.other.dream_world.front_default} alt={pokeData.name}/> */}
      </div>
    )
  }
};
