import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 
import {useAuthDispatch, useAuthState} from '../context/context'
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = (props) => {
    const userDetails = useAuthState()
    const isLogged = Boolean(userDetails.token)
    const dispatch = useAuthDispatch()
    const logout = () => {
        dispatch({ type: 'LOGOUT'})
    }

    return (
        <React.Fragment>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link to="/" class="navbar-brand">SubGestor</Link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav" aria-controls="#nav" aria-expanded="false" aria-label="Toggle navigation" onClick={console.log("navbar button pulsado")}>
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="nav">
                <ul class="navbar-nav mr-auto">
                    {!isLogged && (
                        <li class="nav-item">
                            <Link to ="/signIn" class="nav-link">Inicia sesión</Link>
                        </li>
                    )}
                     {!isLogged && (
                        <li class="nav-item">
                            <Link to ="/signUp" class="nav-link">Regístrate</Link>
                        </li>
                    )}
                    <li class="nav-item" id="FAQ">
                        <Link to ="/faq" class="nav-link">FAQ</Link>
                    </li>
                    {isLogged && (
                        <li class="nav-item">
                            <Link to ="/" onClick={logout} class="nav-link">Logout</Link>
                        </li>
                    )}
                </ul>
            </div>
            </nav>
        </React.Fragment>
    )
    
}

export default Navbar;