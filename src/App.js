import React, { Component } from 'react';
import axios from 'axios';

export default class App extends Component {
  constructor(){
    super()

    this.state = {
      count: 1,
      message: ''
    }

  };
  
  componentDidMount() {
    axios.get('/api/get')
    .then(res =>  this.setState({
        message: res.data.message
      })
    ).catch(err => console.error(err))
  };

  render() {


    const increment = () => {
      this.setState({
        count: this.state.count + 1
      })
    };

    const decrement = () => {
      this.setState({
        count: this.state.count - 1
      })
    };

    const getPokemon = async () => {
      const res = await axios.get('/https://pokeapi.co/api/v2/Pokemon')
      .catch(err => console.error(err))
      console.log(res)
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column',alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh'}}>
        <h4>{this.state.count}</h4>
        <button onClick={() => increment()}>+</button>
        <button onClick={() => decrement()}>-</button>
        <h4>{this.state.message}</h4>
        <button onClick={getPokemon}>get pokemon data</button>
      </div>
    )
  }
};



