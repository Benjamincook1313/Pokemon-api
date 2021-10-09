import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import Card from './Components/Card'
import { Button, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
// import Swal from 'sweetalert2'
// import { connect } from 'react-redux'

export default class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      url: 'https://pokeapi.co/api/v2/pokemon',
      allPokemon:[],
      loaded: false,
      search: '',
      selectedGen: 'Select Generation',
      playingGame: false,
      card1: '',
      card2: '',
      player1: [],
      player2: []
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
      axios.get('https://pokeapi.co/api/v2/pokemon/weedle').then(res =>{
        console.log(res.data)
      })

      getEachPokemon(data.results)

    };

  };
  
  componentDidMount() {
    if(!this.loaded){
      this.getPokemon()
    }
    console.log('component mounted')
  };

  render() {
    const { allPokemon, loaded, selectedGen, playingGame, search} = this.state

    const handleChange = (value) => {
      this.setState({search: value})
    };

    const searchPokemon = () => {
      this.setState({
        url: `https://pokeapi.co/api/v2/pokemon/${search}`
      })
      this.getPokemon()
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

    // shuffles the order of the pokemon cards

    const shuffle = () => {
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

    // get pokemon by generations 1 2 3 

    const getGroup = async (newUrl) => {
      await this.setState({
        url: newUrl[0], 
        allPokemon: [],
        selectedGen: newUrl[1],
        loaded: false
      })

      this.getPokemon()
    };

    // Memory matching game 

    // const playGame = () => {
    //   this.setState({
    //     playingGame: true,
    //     allPokemon: [...allPokemon, ...allPokemon]
    //   })
    // };

    // checks cards selected for match if they do match send player the match 

    // const checker = () => {
    //   if(card1 === card2){
    //     this.setState([...matches, card1[0]])
        
    //     for(let i=0; i <=allPokemon.length; i++){

    //     }
    //   }
    // };

    // const stopGame = async () => {
    //   await this.setState({
    //     playingGame: false,
    //     url: 'https://pokeapi.co/api/v2/pokemon',
    //     allPokemon: [],
    //     selectedGen: 'Select Generation'
    //   });

    //   this.getPokemon()
    // }

    return (
      <div className='App'>
        <h1>Welcome, Pokemon Trainer!</h1>
        <div className='srch'>
          <InputGroup className="mb-3">
            <FormControl placeholder="Search" aria-label="Search Pokemon" aria-describedby="basic-addon2" onChange={handleChange}/>
            <Button variant="outline-secondary" id="button-addon2" onClick={searchPokemon()}>search</Button>
          </InputGroup>
        </div>
        <div className='sort-btns'>

          {/* {!playingGame?  */}
            <Button variant='dark' onClick={sortByNum}>Sort By #</Button>
          {/* : null} */}
          {/* {!playingGame?  */}
            <Button variant='dark' onClick={aToZ}>Sort A-Z</Button>
          {/* : null} */}
          <Button variant='dark' onClick={shuffle}>Shuffle</Button>

          {playingGame? null:
            <DropdownButton id="dropdown-basic-button" title={selectedGen} variant='dark'>
              <Dropdown.Item href="#/action-1" onClick={() => getGroup(['https://pokeapi.co/api/v2/pokemon?limit=151', 'Gen 1'])}>Gen 1</Dropdown.Item>
              <Dropdown.Item href="#/action-2" onClick={() => getGroup(['https://pokeapi.co/api/v2/pokemon?limit=100&offset=151', 'Gen 2'])}>Gen 2</Dropdown.Item>
              <Dropdown.Item href="#/action-3" onClick={() => getGroup(['https://pokeapi.co/api/v2/pokemon?limit=135&offset=251', 'Gen 3'])}>Gen 3</Dropdown.Item>
            </DropdownButton>
          }

          {/* {playingGame? 
            <Button variant='dark' onClick={stopGame}>Stop Playing</Button>
            :
            <Button variant='dark' onClick={playGame}>Play Memory</Button>
          } */}
        </div>
        <div className='card-wrapper'>
          {loaded? allPokemon.map((pokemon, i) => (
            <Card 
              key={i}
              id={pokemon.id}
              name={pokemon.name}
              img={pokemon.sprites.other.dream_world.front_default}
              types={pokemon.types}
              playingGame={playingGame}
            />
            ))
            :'...loading'
          }
        </div>
        {playingGame?
          null:
          <Button variant='secondary' onClick={this.getPokemon}>Get More Pokemon</Button>
        }
      </div>
    )
  };
};


// function mapStateToProps(reduxState) {
//   return reduxState
// }

// export default connect(mapStateToProps, {})(App);
