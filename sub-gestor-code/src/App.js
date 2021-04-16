import React, { Component } from "react";
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {hello: ""};
  }

  componentDidMount() {
      axios.get('http://localhost:4000/hello/')
          .then(response => {
              this.setState({ hello: response.data[0].name });
          })
          .catch(function (error){
              console.log(error);
          })
  }
  
  render() {
    return (
      
        <div className="container">
          <h2>MERN-Stack Hello App</h2>
          <p> { this.state.hello }</p>
        </div>
      
    );
  }
}

export default App;
