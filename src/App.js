import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import Card from './Components/Card'
import { Button, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Swal from 'sweetalert2'
import Success from '/Users/benjamin/fun-projects/Practice/pokemon/src/images/branden-skeli-bRojCEo0uow-unsplash.jpg'
import Failure from '/Users/benjamin/fun-projects/Practice/pokemon/src/images/lia-xKRv2abDDeg-unsplash.jpg'
import Pokeball from '/Users/benjamin/fun-projects/Practice/pokemon/src/images/pokeball-png-45332 (1).png'
import Finished from '/Users/benjamin/fun-projects/Practice/pokemon/src/images/photo-1605979257913-1704eb7b6246.jpeg'
// import { connect } from 'react-redux'

export default class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      url: 'https://pokeapi.co/api/v2/pokemon?limit=25',
      allPokemon:[],
      loaded: false,
      search: '',
      selectedGen: 'Select Generation',
      playingGame: false,
      card1: '',
      card2: '',
      player1: [],
      player2: [],
      player: 1,
      flipCards: false
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

        getEachPokemon(data.results)
    };
  };

  

  componentDidMount(){
    if(!this.loaded){
      this.getPokemon()
    }
  };

  render() {
    const { allPokemon, loaded, selectedGen, playingGame, search, card1, card2, player1, player2, player, flipCards, url} = this.state

    const handleChange = (value) => {
      this.setState({search: value})
    };

    const searchPokemon = async () => {
      this.setState({
        url: `https://pokeapi.co/api/v2/pokemon/${search}`,
        loading: false
      })
      await this.getPokemon()
      console.log(allPokemon, 'hit')
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
      let arr =  [...allPokemon]
      if(playingGame){
        arr = [...allPokemon, ...allPokemon]
      }
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

    // const resetGame = () => {
    //   this.getPokemon()
    //   // this is where the issue is 
    //   this.setState({
    //     playingGame: true
    //     // allPokemon: [...allPokemon, ...allPokemon]
    //   }, setTimeout(() => shuffle()), 1000)
    // };

    // Memory matching game 

    const playGame = async () => {
      await shuffle()
      // let newUrl = await `https://pokeapi.co/api/v2/pokemon?limit=25&offset=${Math.floor(Math.random() * 328)}`
      // let newUrl = await `https://pokeapi.co/api/v2/pokemon?limit=25}`


      let duplicate = async () => {
        this.setState({
          playingGame: true,
          allPokemon: [...allPokemon, ...allPokemon]
        })
      }
      
      // if(selectedGen !== 'Select Generation'){
        //   this.setState({
          //     url: {newUrl}
          //   }, setTimeout(() => resetGame(), 1000))
          // }
          // else{
            //   duplicate()
            //   // shuffle()
            // }
          
      // console.log(url)
      duplicate() 
    };

    const endGame = () => {
      Swal.fire({
        icon: 'success',
        title: `Player ${player} Wins!`,
        text: 'Game Over',
        imageHeight: 250,
        imageUrl: `${Finished}`,
        timer: 10000
      }).then(() => stopGame())
    };

    const stopGame = async () => {
      await this.setState({
        playingGame: false,
        url: 'https://pokeapi.co/api/v2/pokemon',
        allPokemon: [],
        selectedGen: 'Select Generation',
        card1: '',
        card2: '',
        player: 1,
        player1: [],
        player2: []
      });

      this.getPokemon()
    };

    const updatePlayer = () => {
      if(player === 1){
        this.setState({
          player: 2,
          card1: ''
        })
      }else{
        this.setState({
          player: 1,
          card1: ''
        })
      }
    };

    const handleCard = (name, i) => {
      this.setState({flipCards: false})
      
      let resetCards = async () => {
        if(card1[1] === name && i !== card1[0]){ 
          Swal.fire({
            icon: 'success',
            title: 'Cards Match',
            text: `Player ${player} gets another turn!`,
            imageHeight: 250,
            imageUrl: `${Success}`
          })
          if(player === 1){
            this.setState({player1: [...player1, name]})
          }
          if(player === 2){
            this.setState({player2: [...player2, name]})
          }
        }else{
          await Swal.fire({
            icon: 'error',
            title: "Cards Don't Match",
            text: `Player ${player === 1? '2': '1'} gets a turn!`,
            imageHeight: 250,
            imageUrl: `${Failure}`
          })
            this.setState({flipCards: true})
            updatePlayer()
        }
        this.setState({
          card1: '',
          card2: ''
        })
      }

      if(card1 === ''){
        this.setState({
          card1: [i, name]
        })
      }else{
        this.setState({
          card2: [i, name]
        })
        setTimeout(() => {
          resetCards(name, i)
        }, 100);
      }
    };

    console.log()
    return (
      <div className='App'>
        <div className='title'>
          <img className='pokeball' src={Pokeball} alt='pokeball' />
          <h1 className='heading'>Welcome, Pokemon Trainer!</h1>
          <img className='pokeball' src={Pokeball} alt='pokeball'/>
        </div>
        {playingGame? 
        <div className='player-wrapper'>
          <div className='score'>
            <h5>Player1:</h5>
            <ul className='matches'>{player1.map((name, i) => <li className='matches-item' key={i}>{name}</li>)}</ul>
          </div>
          <h2>Player {player}</h2>
          <div className='score'>
            <h5>Player2:</h5>
            <ul className='matches'>{player2.map((name, i) => <li className='matches-item' key={i}>{name}</li>)}</ul>
          </div>
        </div>
        : null}
        <div className='srch'>
          {/* <InputGroup className="mb-3">
            <FormControl placeholder="Search" aria-label="Search Pokemon" aria-describedby="basic-addon2" onChange={e => handleChange(e.target.value)}/>
            <Button variant="outline-secondary" id="button-addon2" onClick={searchPokemon}>search</Button>
          </InputGroup> */}
        </div>
        <div className='sort-btns'>
          {!playingGame? <Button variant='dark' onClick={sortByNum}>Sort By #</Button>: null} 
          {!playingGame? <Button variant='dark' onClick={aToZ}>Sort A-Z</Button>: null} 
          {!playingGame? <Button variant='dark' onClick={shuffle}>Shuffle</Button>: null}
          {/* {playingGame? <Button variant='dark' onClick={endGame}>end game</Button>: null} */}

          {playingGame? null:
            <DropdownButton id="dropdown-basic-button" title={selectedGen} variant='dark'>
              {(selectedGen !== 'Select Generation')? <Dropdown.Item onClick={stopGame}>Home</Dropdown.Item>: null}
              <Dropdown.Item onClick={() => getGroup(['https://pokeapi.co/api/v2/pokemon?limit=151', 'Gen 1'])}>Gen 1</Dropdown.Item>
              <Dropdown.Item onClick={() => getGroup(['https://pokeapi.co/api/v2/pokemon?limit=100&offset=151', 'Gen 2'])}>Gen 2</Dropdown.Item>
              <Dropdown.Item onClick={() => getGroup(['https://pokeapi.co/api/v2/pokemon?limit=135&offset=251', 'Gen 3'])}>Gen 3</Dropdown.Item>
            </DropdownButton>
          }

          {playingGame? 
            <Button variant='dark' onClick={stopGame}>Stop Playing</Button>
            :
            <Button variant='dark' onClick={playGame}>Play Memory</Button>
          }
        </div>
        <div className='card-wrapper'>
          {loaded? allPokemon.map((pokemon, i) => (
            <Card 
              key={i}
              i={i}
              id={pokemon.id}
              name={pokemon.name}
              img={pokemon.sprites.other.dream_world.front_default}
              types={pokemon.types}
              playingGame={playingGame}
              checkCard={() => handleCard(pokemon.name, i)}
              card1={card1}
              card2={card2}
              flipCards={flipCards}
              player1={player1}
              player2={player2}
              endGame={endGame}
              allPokemon={allPokemon}
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
