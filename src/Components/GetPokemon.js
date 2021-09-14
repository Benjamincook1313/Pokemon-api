import React, { Component } from 'react';
import axios from 'axios';
import Card from './Card';


export default class GetPokemon extends Component {
  constructor(props){
    super(props)

    this.state = {
      loading: false,
      pokeData: {},
    }

  };

  // componentDidUpdate(){
  //   data? :''
  // };
  
  render() {
    const { loading, pokeData } = this.state

    // const card = data.map(() => {
    //   <Card />
    // });

    const getPokemon = async () => {
      this.setState({loading: true})
      let res = await axios.get('https://pokeapi.co/api/v2/pokemon/1')
      console.log(res, 'hit')
      res.data? this.setState({
        loading: false,
        pokeData: res
      }) 
        : ''
      .catch(err => console.error(err))
    };

    

    return (
      <div>
        <button onClick={getPokemon}>Get Pokemon</button>
        {loading ?  
          <div>
            <h2>...loading</h2>
          </div>
          : ''
        }
        {/* {card} */}
        {pokeDate? pokeData.data.species: ''}
      </div>
    )
  }
};
