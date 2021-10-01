import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import Card from './Components/Card'
import { Button, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Swal from 'sweetalert2'

export default class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      url: 'https://pokeapi.co/api/v2/pokemon',
      allPokemon:[],
      loaded: false,
      search: '',
      selectedGen: 'Select Generation',
      playingGame: false
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
      axios.get('https://pokeapi.co/api/v2/pokemon/54').then(res =>{
        console.log(res.data)
      })

      getEachPokemon(data.results)

    };

  };
  
  async componentDidMount() {

    this.getPokemon()

  };

  render() {
    const { allPokemon, loaded, selectedGen, playingGame} = this.state

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

    // function that shuffles the order of the pokemon cards

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

    // get pokemon by generation 1 2 3 

    const getGen = async (newUrl) => {
      await this.setState({
        url: newUrl[0], 
        allPokemon: [],
        selectedGen: newUrl[1]
      })
      this.getPokemon()
    };

    // Memory matching game 

    const memoryGame = () => {
      if(selectedGen !== 'Select Generation'){

      }
      Swal.fire({
        title: 'Select a generation before playing',
        timer: 3000,
        icon: 'info',
        showConfirmButton: false
      })
    };


    return (
      <div className='App'>
        <h1>Welcome, Pokemon Trainer!</h1>
        <div className='srch-mmry'>
          <InputGroup className="mb-3">
            <FormControl placeholder="Search" aria-label="Search Pokemon" aria-describedby="basic-addon2" onChange={handleChange}/>
            <Button variant="outline-secondary" id="button-addon2">search</Button>
          </InputGroup>
        </div>
        <div className='sort-btns'>
          {!playingGame? <Button variant='dark' onClick={sortByNum}>Sort By #</Button>: null}
          {!playingGame? <Button variant='dark' onClick={aToZ}>Sort A-Z</Button>: null}
          <Button variant='dark' onClick={scramble}>Shuffle</Button>
          <DropdownButton id="dropdown-basic-button" title={selectedGen} variant='dark'>
            <Dropdown.Item href="#/action-1" onClick={() => getGen(['https://pokeapi.co/api/v2/pokemon?limit=151', 'Gen 1'])}>Gen 1</Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={() => getGen(['https://pokeapi.co/api/v2/pokemon?limit=100&offset=151', 'Gen 2'])}>Gen 2</Dropdown.Item>
            <Dropdown.Item href="#/action-3" onClick={() => getGen(['https://pokeapi.co/api/v2/pokemon?limit=135&offset=251', 'Gen 3'])}>Gen 3</Dropdown.Item>
          </DropdownButton>
          <Button variant='dark' onClick={memoryGame}>Play Memory</Button>
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



