import React, { Component } from "react";
// npm install react-bootstrap bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// npm install react-router-dom
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import routes from './config/routes.js';
import {AuthProvider} from "./context/context";
import AppRoute from "./components/AppRoutes";

// Import de los componentes utilizados
import Navbar from "./components/navbar.component";

class App extends Component {
  constructor(props) {
    super(props);

  }
    
  render() {
    return (
      <AuthProvider>
        <Router>
          <Navbar />
          <Switch>
            {routes.map((route) => (
              <AppRoute
              key={route.path}
              path={route.path}
              component={route.component}
              isPrivate={route.isPrivate}
            />
            ))}
          </Switch>
        </Router>
      </AuthProvider>
    );
  }
}

export default App;
