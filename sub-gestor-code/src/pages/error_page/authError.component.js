import React from 'react';
import { Link } from 'react-router-dom'; 
import './errors.css';

const AuthErrorPage = () => {

    const errorStyle = {
        textAlign: 'center',
      };

    return (
        <div>
            <h1>Parece que tu sesión de usuario se ha terminado</h1>
            <h3 style={errorStyle}>Es posible que el último cambio que hayas hecho no se haya guardado</h3>
            <div className="errors-relogin">
                <Link to="/signIn">Inicia sesión de nuevo</Link>
            </div>
        </div>
    )
}

export default AuthErrorPage;