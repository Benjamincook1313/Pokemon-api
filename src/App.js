import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import Card from './Components/Card'
import { Button } from 'react-bootstrap'

export default class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      url: 'https://pokeapi.co/api/v2/pokemon',
      allPokemon:[],
      loaded: false,
      showMemory: false
    }

    this.getPokemon = async () => {
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

  };
  
  async componentDidMount() {

    this.getPokemon()

  };

  render() {
    const { allPokemon, loaded} = this.state

    const aToZ = () => {
      const sortedPokemon = allPokemon.sort((poke, mon) => {
        if(poke.name < mon.name ) return -1 
        if(mon.name < poke.name ) return 1 
        else return 0
      })
      this.setState({allPokemon: sortedPokemon})
    }

    const sortByNum = () => {
      const sortedPokemon = allPokemon.sort((poke, mon) => {
        if(poke.id < mon.id ) return -1 
        if(mon.id < poke.id ) return 1 
        else return 0
      })
      this.setState({allPokemon: sortedPokemon})
    }

    return (
      <div className='App'>
        <h1>Welcome, Pokemon Trainer!</h1>
        <div className='sort-btns'>
          <Button variant='secondary' onClick={aToZ}>Sort A - Z</Button>
          <Button variant='secondary' onClick={sortByNum}>Sort by #</Button>
          <Button variant='secondary' >Play Memory</Button>
        </div>
        <div className='card-wrapper'>
          {loaded? allPokemon.map((pokemon, i) => (
            <Card 
              key={i}
              id={pokemon.id}
              name={pokemon.name}
              img={pokemon.sprites.other.dream_world.front_default}
              types={pokemon.types}
            />
            ))
            :'...loading'
          }
        </div>
        <Button variant='secondary' onClick={this.getPokemon}>Get More Pokemon</Button>
      </div>
    )
  }
};



