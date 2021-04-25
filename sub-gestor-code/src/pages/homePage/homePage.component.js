import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './homePage.css'
import Tarjetas from '../../components/Tarjetas.components'

export default class HomePage extends Component {
    render() {
        return (
            <div className="homePage">
                <h2>SubGestor</h2>
                <div className="text">
                    <h1>Gestiona tus suscripciones</h1>
                    <h3>De forma senzilla e intuitiva, mantén el control de tus servicios contratados</h3>
                    <Link to ="/signUp" className="nav-link">Regístate</Link>
                    <p> o</p>
                    <Link to ="/signIn" className="nav-link">Inicia sesión</Link>
                </div>
                <div className="cards">
                    <Tarjetas/>
                </div>
            </div>
            
        )
    }
}