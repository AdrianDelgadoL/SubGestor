import React, {useState} from 'react';
import './modPerfil.css';
import axios from "axios";
import {useAuthState} from '../../context/context';
import {useAuthDispatch} from '../../context/context';

const Perfil = (props) => { 
    
    const userDetails = useAuthState();
    const dispatch = useAuthDispatch();
    const [currency, setCurrency] = useState(null);
    const [frequency, setFrequency] = useState(null);
    
    
    /* Función para borrar el usuario */
    const eliminarPerfil = () => {
        axios.delete('http://localhost:4000/user', {headers: {"x-auth-token": userDetails.token}})
        .then(response => {
            console.log(response.data)
            dispatch({ type: 'LOGOUT' })
            props.history.push('/');
        })  
    }

    /* Función para modificar el perfil */
    const modificarPerfil = async (e) => {
        e.preventDefault();
        let data = new FormData();

        //
        data.append('currency', currency)
        data.append('frequency', frequency)

        //
        axios.put('https://localhost:4000/user/configuration', {data: data,headers:{"x-auth-token": userDetails.token}})
        .then(response => {
            console.log(response.data)
            dispatch({type: 'AUTH_ERROR'})
        })
    }

    const handleChange = async (e) => {
        e.preventDefault();
        const {name, value } = e.target;
        switch(name){
            case "currency":
                setCurrency(value);
                break;
            case "frequency":
                setFrequency(value);
                break;
        }
    }

    return (
        <div className="modPerfil-wrapper">
          <h2>Perfil</h2>
            <div className="modPerfil-container">
                <h1 className="modPerfil-email">{userDetails.user}</h1>
                <hr className="modPerfil-separator"/>
                <div className="modPerfil-datos">
                    <p>Moneda por defecto:</p>
                    <select name="currency" className="modPerfil-select" onChange={handleChange}>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                    </select>
                    <p>Frecuencia:</p>
                    <select name="frequency" className="modPerfil-select" onChange={handleChange}>
                        <option value="none">Por defecto</option>
                        <option value="anual">Anual</option>
                        <option value="monthly">Mensual</option>
                    </select>
                    <button onClick={modificarPerfil} className="modPerfil-datos-button" type="submit">Modificar perfil</button>
                </div>
                <hr className="modPerfil-separator"/>
                <div className="modPerfil-bottom">
                    <div className="modPerfil-bottom-pswbutton">
                        {/*Enlazar boton con la pagina de cambiar contraseña*/}
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