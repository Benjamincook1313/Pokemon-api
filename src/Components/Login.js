import React, { useState } from 'react'
import './Styles/Login.css' 
import axios from 'axios'
import { InputGroup, FormControl, Button } from 'react-bootstrap'

export default function Login(props) {
  const { closeLogin } = props

  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const handlePassword = (value) => {
    setPassword(value)
  };

  const handleEmail = (value) => {
    setEmail(value)
  };

  const signIn = async () => {
    const res = await axios.get(`/api/User/${password, email}`)
    .catch(err => console.log(err, 'error'))
  }


  return (
    <div className='Login'>
      <p className='close' onClick={closeLogin}>X</p>
      <h1>Login</h1>
      <div className='center'>
        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
          <FormControl
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={e => handleEmail(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
            <FormControl
              placeholder="password"
              aria-label="password"
              type='password'
              aria-describedby="basic-addon1"
              onChange={e => handlePassword(e.target.value)}
            />
        </InputGroup>
      </div>
      <Button variant='dark'>Submit</Button>
      <div>
      </div>
    </div>
  )
};
