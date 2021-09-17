import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Card from './Components/Card';

export default class App extends Component {
  constructor(){
    super()

    this.state = {
      message: '',
      loading: false,
      loaded: false,
      url: 'https://pokeapi.co/api/v2/pokemon?limit=20',
      pokeData: []
    }

  };
  
  componentDidMount() {
    axios.get('/api/get')
    .then(res =>  this.setState({
        message: res.data.message
      })
      ).catch(err => console.error(err))
      console.log('connected to server')
  };

  render() {

    const { pokeData, url } = this.state

    const getPokemon = async () => {
      const res = await fetch(url)
      const data = await res.json()
      this.setState({ 
        url: data.next,
        loading: true
      })

      const allPokemon = (result) => {
        result.forEach(async pokemon => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
          const data = await res.json()
          // console.log(data.name)
          this.setState({
            pokeData: [...pokeData, data],
            loaded: true
          })
        })
        this.setState({loading: false})
      };

        allPokemon(data.results)
    };
            // <Card 
            //   id = {pokemon.id}
            //   name = {pokemon.name}
            //   img = {pokemon.sprites.other.dream_world.front_default}
            //   type = {pokemon.types[0].type.name}
            //   key = {i}
            // />

    return (
      <div className='App'>
        <h4>{this.state.message}</h4>
        <button onClick={getPokemon}>Get Pokemon</button>
          <ol>
            { pokeData.map((pokemon, i) => 
              <li key={i}>
                {pokemon.name}
                {console.log(pokemon.name)}
              </li>
            )}
          </ol>   
      </div>
    )
  }
};



