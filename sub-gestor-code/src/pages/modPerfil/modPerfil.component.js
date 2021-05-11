import React, {useState} from 'react';
import './modPerfil.css';
import axios from "axios";
import {useAuthState} from '../../context/context';
import {useAuthDispatch} from '../../context/context';

const Perfil = (props) => { 
    
    const userDetails = useAuthState();
    const dispatch = useAuthDispatch();
    
    /* Función para borrar el usuario */
    const eliminarPerfil = () => {
        axios.delete('http://localhost:4000/user', {headers: {"x-auth-token": userDetails.token}})
        .then(response => {
            console.log(response.data)
            dispatch({ type: 'LOGOUT' })
            props.history.push('/');
        })
    }
    

    return (
        <div className="modPerfil-wrapper">
          <h2>Perfil</h2>
            <div className="modPerfil-container">
                <h1 className="modPerfil-email">{userDetails.user}</h1>
                <hr className="modPerfil-separator"/>
                <div className="modPerfil-datos">
                    <p>Moneda por defecto:</p>
                    <select className="modPerfil-select">
                        <option>EUR</option>
                        <option>USD</option>
                        <option>GBP</option>
                    </select>
                    <p>Frecuencia:</p>
                    <select className="modPerfil-select">
                        <option>Por defecto</option>
                        <option>Anual</option>
                        <option>Mensual</option>
                    </select>
                    <form method="get" action="" className="homePage-form">
                        <button className="modPerfil-datos-button" type="submit">Modificar perfil</button>
                    </form>
                </div>
                <hr className="modPerfil-separator"/>
                <div className="modPerfil-bottom">
                    <div className="modPerfil-bottom-pswbutton">
                        <button className="modPerfil-bottom-psw" type="submit">Cambiar contraseña</button>
                    </div>
                    <div className="modPerfil-bottom-removebtn">
                        <button onClick={eliminarPerfil} className="modPerfil-bottom-remove">Eliminar perfil</button>
                    </div>
                </div>
            </div>
        </div>
  );
}

export default Perfil;