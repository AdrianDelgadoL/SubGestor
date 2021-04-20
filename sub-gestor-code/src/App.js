import React, { Component } from "react";
import axios from 'axios';
// npm install react-bootstrap bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// npm install react-router-dom
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import de los componentes utilizados
import Navbar from "./components/navbar.component";
import signUp from "./components/registro/signUp.component";
import signIn from "./components/signIn.component";
import FAQ from "./components/FAQ.component";


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
        <Router>
            <Navbar />
            <Route path="/signIn" exact component={signIn} />
            <Route path="/signUp" exact component={signUp} />
            <Route path="/FAQ" exact component={FAQ} />
        </Router>
    );
  }
}

export default App;
