import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
            <Link to="/" className="navbar-brand">SubGestor</Link>
            <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#nav" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                <Link to ="/signIn" className="nav-link">Inicia sessió</Link>
                </li>
                <li className="navbar-item">
                <Link to ="/signUp" className="nav-link">Resgitra't</Link>
                </li>
            </ul>
            </div>
        </nav>
        )
    }
}