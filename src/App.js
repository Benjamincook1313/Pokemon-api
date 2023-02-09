import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
import { Poke, Score } from './Components/Styles/Style'
import Card from './Components/Card'
import Timer from './Components/Timer'
import { Button, InputGroup, FormControl, DropdownButton, Dropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Swal from 'sweetalert2'
import Success from './images/branden-skeli-bRojCEo0uow-unsplash.jpg'
import Failure from './images/lia-xKRv2abDDeg-unsplash.jpg'
import Pokeball from './images/pokeball-png-45332 (1).png'
import Finished from './images/photo-1605979257913-1704eb7b6246.jpeg'

export default class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      url: 'https://pokeapi.co/api/v2/pokemon?limit=25',
      allPokemon: [],
      loaded: false,
      search: '',
      selectedGen: 'Select Generation',
      selectedType: 0,
      playingGame: false,
      card1: '',
      card2: '',
      name1: 'Player 1',
      name2: "Player 2",
      matches1: [],
      matches2: [],
      player: 1,
      players: 1,
      flipCards: false,
      startTime: false,
      finalTime: ''
    }

    this.getPokemon = async () => {
      const res = await axios.get(this.state.url).catch(err => console.log(err, 'error'))
      const data = res.data
      
      this.setState({url: data.next})

      const getEachPokemon = (result) => {
        result.map(async pokemon => {
          const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`).catch(err => console.log('error', err))
          const {data} = res

          this.setState({allPokemon: [...this.state.allPokemon, data]})
        })
        
        this.setState({loaded: true})
      }

      getEachPokemon(data.results)
    }

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
    }

    
  };

  componentDidMount(){
    if(!this.loaded){
      this.getPokemon()
    }
    // console.log('Component Mounted')
  };

  render() {
    // console.log("App Rendered");
    const { 
      allPokemon, loaded, selectedGen, selectedType, 
      playingGame, search, card1, card2, name1, name2, matches1, matches2,
      player, flipCards, players, startTime, finalTime
    } = this.state

    const handleChange = (value) => {
      this.setState({search: `${value.toLowerCase()}`})
    };

    const searchPokemon = async (e) => {
      e.preventDefault()

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

    const playGame = async () => {
      let arr = await [...allPokemon, ...allPokemon]
      for(let i=0; i < arr.length; i++){
        let temp = arr[i]
        let randomNum = Math.floor(Math.random() * arr.length)
        arr[i] = arr[randomNum]
        arr[randomNum] = temp
      }

      this.setState({playingGame: true, allPokemon: arr})
    };



    const endGame = () => {

      const whoWon = () => {
        if(matches1.length > matches2.length) return name1
        else if(matches1.length === matches2.length) return 'Draw'
        else return name2
      }

      Swal.fire({
        icon: 'success',
        title: `Winner!`,
        text: (players === 2)? whoWon(): `Time: ${finalTime}`,
        imageHeight: 250,
        imageUrl: `${Finished}`,
        timer: 10000
      })
      
      resetGame();
    };

    const resetGame = () => {
      this.setState({
        selectedGen: 'Select Generation',
        card1: '',
        card2: '',
        player: 1,
        matches1: [],
        matches2: [],
        selectedType: 'Select Type',
        players: 1,
        startTime: false
      }, shuffle())
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
        name1: "",
        name2: "",
        matches1: [],
        matches2: [],
        selectedType: 'Select Type',
        players: 1,
        startTime: false,
        finalTime: ''
      });

      this.getPokemon()
    };

    const updatePlayer = () => {
      console.log("Player updated");
      if(player === 1) this.setState({player: 2, card1: ''})
      else this.setState({player: 1, card1: ''})
    };

    const handleCard = (name, i) => {
      this.setState({flipCards: false})
      
      const resetCards = async () => {
        if(card1[1] === name && i !== card1[0]){ 
          Swal.fire({
            icon: 'success',
            title: 'Cards Match',
            text: (players === 2)&& `${player === 1? name1: name2} gets another turn!`,
            imageHeight: 250,
            imageUrl: `${Success}`,
            timer: 2000,
            showConfirmButton: false
          })

          if(player === 1) this.setState({matches1: [...matches1, name]})
          if(player === 2) this.setState({matches2: [...matches2, name]})

        }else{
          await Swal.fire({
            icon: 'error',
            title: "Cards Don't Match",
            text: (players === 2)&& `${player === 1? name2: name1} gets a turn!`,
            imageHeight: 250,
            imageUrl: `${Failure}`,
            timer: 2000,
            showConfirmButton: false
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
        this.setState({card1: [i, name]})
      }else{
        this.setState({card2: [i, name]})
        setTimeout(() => {
          resetCards(name, i)
        }, 100);
      }
    };

    const setFinalTime = (time) => {
      this.setState({finalTime: time})
    };

    const twoPlayers = async () => {
      const {value: name1} = await Swal.fire({
        title: 'Player 1',
        input: 'text',
        inputPlaceholder: 'name',
        inputAttributes: {
          autocapitalize: 'on',
        }
      })

      const {value: name2} = await Swal.fire({
        title: 'Player 2',
        input: 'text',
        inputPlaceholder: 'name',
        inputAttributes: {
          autocapitalize: 'on',
        }
      })

      this.setState({players: 2, name1: name1, name2: name2});

    }

    return (
      <div className='App'>
        <span className='top'></span>

        <header className='title'>
          <Poke src={Pokeball} alt='pokeball' />
          <h1 className='heading'>Welcome, Pokemon Trainer!</h1>
          <Poke src={Pokeball} alt='pokeball'/>
        </header>

        {(playingGame && (players === 2)) && 
          <div className='player-wrapper'>
            <Score>
              <h5>{name1}</h5>
              <ul className='matches'>{matches1.map((pokemon, i) => <li className='matches-item' key={i}>{pokemon}</li>)}
              </ul>
            </Score>
            <section className='p2-center'>
              <h2 className='player'>{player === 1? name1: name2}'s turn </h2>
              <span className='p2-btns'>
                <Button variant='dark' onClick={stopGame}>Stop Playing</Button>
                <Button  variant='dark' onClick={resetGame}>Reset Game</Button>
              </span>
            </section>
            <Score>
              <h5>{name2}</h5>
              <ul className='matches'>{matches2.map((name, i) => <li className='matches-item' key={i}>{name}</li>)}</ul>
            </Score>
          </div>
        }

        {((players === 1) && playingGame) &&
          <div className='btns'>
            <Button variant='dark' size="md" onClick={twoPlayers}>2 players</Button>
            <div className='btns-center'>
              <Button className='resetBtn' variant='dark' size='md' onClick={resetGame}>Reset Game</Button>
              <Timer startTime={startTime} playingGame={playingGame} setFinalTime={setFinalTime}/>
            </div>
            <Button variant='dark' size="md" onClick={stopGame}>Stop Playing</Button>
          </div>
        }

        <div className='srch'>
          {!playingGame &&
             <form >
              <InputGroup className="mb-3">
                <FormControl autoCorrect='' placeholder="Search" aria-label="Search Pokemon" aria-describedby="basic-addon2" onChange={e => handleChange(e.target.value)}/>
                <Button type="submit" variant="outline-secondary" id="button-addon2" onClick={(e) => searchPokemon(e)}>search</Button>
              </InputGroup>
             </form>           
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

          {!playingGame && <Button variant='dark' onClick={playGame}>Play Memory</Button>}

        </div>

        <div className='wrapper'>
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
                  name1={name1}
                  name2={name2}
                  matches1={matches1}
                  matches2={matches2}
                  endGame={endGame}
                  allPokemon={allPokemon}
                  startTime={() =>  this.setState({startTime: true})}
                  stopTime={() => this.setState({startTime: false})}
                  timeStarted={startTime}
                />
              )):'...loading'
            }
          </div>
        </div>

        {!playingGame &&
          <Button variant='secondary' style={{ marginTop: '20px' }} onClick={this.getPokemon}>Get More Pokemon</Button>
        }

        <span className='bottom'></span>
      </div>
    )
  };
};