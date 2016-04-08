import React, { Component } from 'react';
import Navbar from './Navbar/Navbar.jsx';
import io from 'socket.io-client';
let socket = io('http://localhost:8080');

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar socket={socket}/>
      </div>
    );
  }
}
