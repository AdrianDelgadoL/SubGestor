import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './homePage.css'



export default class HomePage extends Component {
    render() {
        return (
            <div className="homePage">
                <div className="text">
                    <h1>Gestiona les teves subscripcions</h1>
                    <h3>De manera fàcil i intuitiva, mantén el control dels teus serveis contractats</h3>
                    <Link to ="/signup" className="nav-link">Registra't</Link>
                </div>
            </div>
            
        )
    }
}