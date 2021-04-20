import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Navbar extends Component {

    render() {
        return (
            <React.Fragment>

                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link to="/" class="navbar-brand">SubGestor</Link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav" aria-controls="#nav" aria-expanded="false" aria-label="Toggle navigation" onClick={console.log("navbar button pulsado")}>
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="nav">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <Link to ="/signIn" class="nav-link">Inicia sessió</Link>
                        </li>
                        <li class="nav-item">
                            <Link to ="/signUp" class="nav-link">Resgitra't</Link>
                        </li>
                        <li class="FAQ">
                            <Link to ="/FAQ" class="nav-link">FAQ</Link>
                        </li>
                    </ul>
                </div>
                </nav>
            </React.Fragment>
        )
    }
}