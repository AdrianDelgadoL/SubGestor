import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">SubGestor</Link>
                <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="navbar-item">
                    <Link to ="/signIn" className="nav-link">Sign In</Link>
                    </li>
                    <li className="navbar-item">
                    <Link to ="/signUp" className="nav-link">Sign Up</Link>
                    </li>
                </ul>
                </div>
            </nav>
        )
    }
}