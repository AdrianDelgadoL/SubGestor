import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';

class Navbar extends Component {

    render() {
        return (
            <React.Fragment>

                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link to="/home" class="navbar-brand">SubGestor</Link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav" aria-controls="#nav" aria-expanded="false" aria-label="Toggle navigation" onClick={console.log("navbar button pulsado")}>
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="nav">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <Link to ="/signIn" class="nav-link">Inicia sesión</Link>
                        </li>
                        <li class="nav-item">
                            <Link to ="/signUp" class="nav-link">Regístrate</Link>
                        </li>
                        <li class="nav-item" id="FAQ">
                            <Link to ="/faq" class="nav-link">FAQ</Link>
                        </li>
                        <li className="nav-item" id="createSub">
                            <Link to="/createSub" class="nav-link"> Crear suscripción </Link>
                        </li>
                        {/* Este apartado del navegador solo es para poder ver el desarrollo de esta sección, quitar luego*/}
                        <li class="nav-item" id="detail">
                            <Link to ="/subDetail" class="nav-link">Detalle</Link>
                        </li>

                    </ul>
                </div>
                </nav>
            </React.Fragment>
        )
    }
}

export default Navbar;