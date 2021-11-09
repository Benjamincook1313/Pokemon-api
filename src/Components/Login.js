import React from 'react'
import './Styles/Login.css' 
import { InputGroup, FormControl } from 'react-bootstrap'

export default function Login({closeLogin}) {
  return (
    <div className='Login'>
      <p className='close' onClick={closeLogin}>X</p>
      <h1>Login</h1>
        <div className='center'>
          <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">user name</InputGroup.Text>
            <FormControl
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text id="basic-addon1">password</InputGroup.Text>
              <FormControl
                placeholder="password"
                aria-label="password"
                type='password'
                aria-describedby="basic-addon1"
              />
          </InputGroup>
        </div>
      <div>
      </div>
    </div>
  )
};
