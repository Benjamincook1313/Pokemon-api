import React, { Component } from 'react'

export default class Card extends Component {
  constructor(props){
    super(props)
    
    
  };
  
  
  render() {
    
    const {id, name, img, type} = this.props

    return (
      <div className='card'>
        <img src={img} alt={name} />
      </div>
    )
  }
};


