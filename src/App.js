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
      search: ''
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

    const handleChange = (value) => {
      this.setState({search: value})
    };

    // sorts pokemon cards A - Z

    const aToZ = () => {
      const sortedPokemon = allPokemon.sort((poke, mon) => {
        if(poke.name < mon.name ) return -1 
        if(mon.name < poke.name ) return 1 
        else return 0
      })
      this.setState({allPokemon: sortedPokemon})
    };

    // sort pokemon cards by number

    const sortByNum = () => {
      const sortedPokemon = allPokemon.sort((poke, mon) => {
        if(poke.id < mon.id ) return -1 
        if(mon.id < poke.id ) return 1 
        else return 0
      })
      this.setState({allPokemon: sortedPokemon})
    };

    // function that scrambles the order of the pokemon cards

    const scramble = () => {
      let arr = [...allPokemon]
      for(let i=0; i < arr.length; i++){
        let temp = arr[i]
        let randomNum = Math.floor(Math.random() * arr.length)
        arr[i] = arr[randomNum]
        arr[randomNum] = temp
      }
      this.setState({
        allPokemon: arr
      })
    };

    // get all  1st generation pokemon


    return (
      <div className='App'>
        <h1>Welcome, Pokemon Trainer!</h1>
        <div className='sort-btns'>
          <Button variant='secondary' onClick={sortByNum}>Sort By #</Button>
          <Button variant='secondary' onClick={aToZ}>A - Z</Button>
          <Button variant='primary' onClick={scramble}>Scramble</Button>
          <Button variant='secondary' >Original 150</Button>
          <Button variant='secondary' >Memory</Button>
          <input onChange={handleChange} placeholder='search'></input>
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
  };
};



