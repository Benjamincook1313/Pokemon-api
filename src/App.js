import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import Card from './Components/Card'

export default class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      url: 'https://pokeapi.co/api/v2/pokemon',
      allPokemon:[],
      isLoaded: false
    }

  };
  
  async componentDidMount() {
    const res = await axios.get(this.state.url)
    const data = res.data
    this.setState({
      url: data.next
    })

    const getEachPokemon = (result) => {
      result.forEach(async pokemon => {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        const data = res.data
        await this.setState({
          allPokemon: [...this.state.allPokemon, data]
        })
      })
      this.setState({loaded: true})
    }
    axios.get('https://pokeapi.co/api/v2/pokemon/1').then(res =>{
      console.log(res.data)
    })

    getEachPokemon(data.results)
  };

  render() {
    const { url, allPokemon, loaded} = this.state

    const getMore = async () => {
      // const res = await axios.get(url)
      // const data = res.data
      
      this.setState({loaded: false})

    };
    
    return (
      <div className='App'>
        <h1>Welcome, Pokemon Trainer!</h1>
        <div className='card-wrapper'>
          {loaded? allPokemon.map((pokemon, i) => (
            <Card 
              key={i}
              id={pokemon.id}
              name={pokemon.name}
              img={pokemon.sprites.other.dream_world.front_default}
              type={pokemon.types.forEach(type => type.name)}
            />
            ))
            :'...loading'
          }
        </div>
        <button onClick={getMore}>Get More Pokemon</button>
      </div>
    )
  }
};



