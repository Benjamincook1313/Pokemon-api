import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import Card from './Components/Card'
// import Login from './Components/Login'
import { Button, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Swal from 'sweetalert2'
import Success from '/Users/benjamin/fun-projects/Practice/pokemon/src/images/branden-skeli-bRojCEo0uow-unsplash.jpg'
import Failure from '/Users/benjamin/fun-projects/Practice/pokemon/src/images/lia-xKRv2abDDeg-unsplash.jpg'
import Pokeball from '/Users/benjamin/fun-projects/Practice/pokemon/src/images/pokeball-png-45332 (1).png'
import Finished from '/Users/benjamin/fun-projects/Practice/pokemon/src/images/photo-1605979257913-1704eb7b6246.jpeg'

export default class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      url: 'https://pokeapi.co/api/v2/pokemon?limit=25',
      allPokemon:[],
      loaded: false,
      search: '',
      selectedGen: 'Select Generation',
      selectedType: 0,
      playingGame: false,
      card1: '',
      card2: '',
      player1: [],
      player2: [],
      player: 1,
      players: 1,
      flipCards: false,
      loggingIn: false,
      loggedIn: false,
      // second: 0,
      // min: 0,
      // hour: 0,

    }

    this.getPokemon = async () => {
      const res = await axios.get(this.state.url).catch(err => console.log(err, 'error'))
      const data = res.data
      
      this.setState({url: data.next})

      const getEachPokemon = (result) => {
        result.forEach(async pokemon => {
          const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`).catch(err => console.log('error', err))
          const data = res.data

          this.setState({allPokemon: [...this.state.allPokemon, data]})
        })
        
        this.setState({loaded: true})
      }

      getEachPokemon(data.results)

      // const test = async () => {
      //   const res = await axios.get(`https://pokeapi.co/api/v2/type/3`).catch(err => console.log('error', err))
      //   const data = res.data
      //   console.log(data)
      // }

      // test()
    };

    this.getType = async (type) => {
      await this.setState({selectedType: type[1], loaded: false, allPokemon: [], selectedGen: 'Select Generation'})
      const res = await axios.get(`${type[0]}`).catch(err => console.log(err, 'error'))
      const data = res.data

      const getEachPokemon = (result) => {
        result.forEach( async pokemon => {
          const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemon.name}`).catch(err => console.log('error', err))
          const data = res.data
          if(data.sprites.other.dream_world.front_default){
            this.setState({allPokemon: [...this.state.allPokemon, data]})
          }
        })

        this.setState({loaded: true})
      }

      getEachPokemon(data.pokemon)
    };

    this.numOfRows = () => {
      let length = 30
      let num = 1
      let rows = [] 
      for(let i=0; i<length; i++){
        rows = [...rows, num]
        num++
      }
      this.setState({
        rows: rows
      })
    }

  };


  componentDidMount(){
    if(!this.loaded){
      this.getPokemon()
    }

    this.numOfRows()

    console.log('Component Mounted')
  };

  render() {
    const { 
      allPokemon, loaded, selectedGen, selectedType, 
      playingGame, search, card1, card2, player1, player2, 
      player, flipCards, loggingIn, loggedIn, players
    } = this.state

    const handleChange = (value) => {
      this.setState({search: `${value.toLowerCase()}`})
    };

    const searchPokemon = async () => {
      if(search !== ''){
        await this.setState({ allPokemon: [], loaded: false })
        try {
          const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${search}`)
          const data = res.data
          this.setState({ allPokemon: [...this.state.allPokemon, data] })
        } catch (err){
          console.log(err)
          Swal.fire({
            icon: 'error',
            title: 'Try Again',
            text: `Pokemon Not Found!`,
            imageHeight: 250,
            imageUrl: `${Failure}`,
            showConfirmButton: false,
            timer: 2000
          })
        }
        this.setState({loaded: true})
      }
    };

    // Sort By Functions

    const aToZ = () => {
      const sortedPokemon = allPokemon.sort((poke, mon) => {
        if(poke.name < mon.name ) return -1 
        if(mon.name < poke.name ) return 1 
        else return 0
      })
      this.setState({allPokemon: sortedPokemon})
    };

    const sortByNum = () => {
      const sortedPokemon = allPokemon.sort((poke, mon) => {
        if(poke.id < mon.id ) return -1 
        if(mon.id < poke.id ) return 1 
        else return 0
      })

      this.setState({allPokemon: sortedPokemon})
    };

    const shuffle = () => {
      let arr =  [...allPokemon]
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

    const getGroup = async (newUrl) => {
      await this.setState({
        url: newUrl[0], 
        allPokemon: [],
        selectedGen: newUrl[1],
        loaded: false,
        selectedType: 'Select Type'
      })

      this.getPokemon()
    };


    // Memory Game Functions

    const playGame = async () => {
      let arr = await [...allPokemon, ...allPokemon]
      for(let i=0; i < arr.length; i++){
        let temp = arr[i]
        let randomNum = Math.floor(Math.random() * arr.length)
        arr[i] = arr[randomNum]
        arr[randomNum] = temp
      }
      this.setState({
        playingGame: true,
        allPokemon: arr
      })
    };

    const endGame = () => {
      Swal.fire({
        icon: 'success',
        title: (players === 2)? `Player ${player} Wins!`: null,
        text: 'Game Over',
        imageHeight: 250,
        imageUrl: `${Finished}`,
        timer: 10000
      })
      // .then(() => stopGame())
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
        player2: [],
        selectedType: 'Select Type',
        players: 1
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
      
      const resetCards = async () => {
        if(card1[1] === name && i !== card1[0]){ 
          Swal.fire({
            icon: 'success',
            title: 'Cards Match',
            text: (players === 2)? `Player ${player === 1? '2': '1'} gets a turn!`: null,
            imageHeight: 250,
            imageUrl: `${Success}`,
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
             text: (players === 2)? `Player ${player === 1? '2': '1'} gets a turn!`: null,
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

    // Authenication

    // const toggleSignIn = () => {
    //   this.setState({ loggingIn: true})
    // };

    // const signIn = () => {

    // };

    // const signOut = () => {

    // };

    // console.log(allPokemon.length)

    return (
      <div className='App'>
        <div className='top'>
          {/* {loggedIn?
            <Button variant='light' size='sm' onClick={signOut}>Sign Out</Button>:
            <Button variant='light' size='sm' onClick={toggleSignIn}>Sign In</Button>
          } */}
        </div>
        {/* {loggingIn? 
          <Login 
            closeLogin={() => this.setState({loggingIn: false})}
          />
          : null
        } */}
        <div className='title'>
          <img className='pokeball' src={Pokeball} alt='pokeball' />
          <h1 className='heading'>Welcome, Pokemon Trainer!</h1>
          <img className='pokeball' src={Pokeball} alt='pokeball'/>
        </div>
        {playingGame && (players === 2)? 
        <div className='player-wrapper'>
          <div className='score'>
            <h5 >Player 1:</h5>
            <ul className='matches'>{player1.map((name, i) => <li className='matches-item' key={i}>{name}</li>)}</ul>
          </div>
          <div className='App'>
            <h2 className='player'>Player {player}'s turn </h2>
            <Button variant='dark' onClick={stopGame}>Stop Playing</Button>
          </div>
          <div className='score'>
            <h5>Player 2:</h5>
            <ul className='matches'>{player2.map((name, i) => <li className='matches-item' key={i}>{name}</li>)}</ul>
          </div>
        </div>
        : null}
        {(players === 1) && playingGame?
          <div className='btns'>
            <Button style={{margin: '10px'}} variant='dark' onClick={() => this.setState({players: 2})}>2 players</Button>
            <Button style={{margin: '10px'}} variant='dark' onClick={stopGame}>Stop Playing</Button>
          </div>
          : null
        }
        <div className='srch'>
          {!playingGame? 
            <InputGroup className="mb-3">
              <FormControl placeholder="Search" aria-label="Search Pokemon" aria-describedby="basic-addon2" onChange={e => handleChange(e.target.value)}/>
              <Button variant="outline-secondary" id="button-addon2" onClick={searchPokemon}>search</Button>
            </InputGroup>: null
            }
        </div>
        <div className='sort-btns'>
          {playingGame? null:
            <DropdownButton id="dropdown-basic-button" title={'Sort By'} variant='dark'>
              <Dropdown.Item onClick={aToZ}>A-Z</Dropdown.Item>
              <Dropdown.Item onClick={sortByNum}>#</Dropdown.Item>
              <Dropdown.Item onClick={shuffle}>Shuffle</Dropdown.Item>
            </DropdownButton>
          }
          
          {playingGame? null:
            <DropdownButton id="dropdown-basic-button" title={selectedGen} variant='dark'>
              {(selectedGen !== 'Select Generation')? <Dropdown.Item onClick={stopGame}>Home</Dropdown.Item>: null}
              <Dropdown.Item onClick={() => getGroup(['https://pokeapi.co/api/v2/pokemon?limit=151', 'Gen 1'])}>Gen 1</Dropdown.Item>
              <Dropdown.Item onClick={() => getGroup(['https://pokeapi.co/api/v2/pokemon?limit=100&offset=151', 'Gen 2'])}>Gen 2</Dropdown.Item>
              <Dropdown.Item onClick={() => getGroup(['https://pokeapi.co/api/v2/pokemon?limit=135&offset=251', 'Gen 3'])}>Gen 3</Dropdown.Item>
            </DropdownButton>
          }
          
          {playingGame? null:
            <DropdownButton id="dropdown-basic-button" title={(selectedType === 0) ? 'Select Type': selectedType} variant='dark'>
              {(selectedGen !== 'Select Generation')? <Dropdown.Item onClick={stopGame}>Home</Dropdown.Item>: null}
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/1', 'Normal'])}>Normal</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/2', 'Fighting'])}>Fighting</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/3', 'Flying'])}>Flying</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/4', 'Poison'])}>Poison</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/5', 'Ground'])}>Ground</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/6', 'Rock'])}>Rock</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/7', 'Bug'])}>Bug</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/8', 'Ghost'])}>Ghost</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/9', 'Steel'])}>Steel</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/10', 'Fire'])}>Fire</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/11', 'Water'])}>Water</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/12', 'Grass'])}>Grass</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/13', 'Electric'])}>Electric</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/14', 'Psychic'])}>Psychic</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/15', 'Ice'])}>Ice</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/16', 'Dragon'])}>Dragon</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/17', 'Dark'])}>Dark</Dropdown.Item>
              <Dropdown.Item onClick={() => this.getType(['https://pokeapi.co/api/v2/type/18', 'Fairy'])}>Fairy</Dropdown.Item>

            </DropdownButton>
          }

          {playingGame? 
            // <Button variant='dark' onClick={stopGame}>Stop Playing</Button>
            null:
            <Button variant='dark' onClick={playGame}>Play Memory</Button>
          }
        </div>
        <div className='wrapper'>
          <div className='num-wrapper'>
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
                  loggedIn={loggedIn}
                />
              )):'...loading'
            }
          </div>
        </div>
        {playingGame?
          null:
          <Button variant='secondary' style={{ marginTop: '20px' }} onClick={this.getPokemon}>Get More Pokemon</Button>
        }
        <div className='bottom'></div>
      </div>
    )
  };
};