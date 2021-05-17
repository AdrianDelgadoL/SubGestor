import React, {useState, useEffect} from 'react';
import './modPerfil.css';
import axios from "axios";
import {useAuthState} from '../../context/context';
import {useAuthDispatch} from '../../context/context';
import { Link } from 'react-router-dom';

const Perfil = (props) => { 
    
    const userDetails = useAuthState();
    const dispatch = useAuthDispatch();
    const [currency, setCurrency] = useState(userDetails.prefered_currency);
    const [frequency, setFrequency] = useState(userDetails.frequency);
    const [backendError, setBackendError] = useState('');
    

    // Para setear los valores con valores de userDetails y evitar null
    useEffect(() => {
        setCurrency(userDetails.prefered_currency);
        setFrequency(userDetails.frequency);
        console.log(userDetails.prefered_currency);
        console.log(userDetails.frequency);
    }, [])
        
    
    // Función para borrar el usuario 
    const eliminarPerfil = () => {
        axios.delete('http://localhost:4000/user', {headers: {"x-auth-token": userDetails.token}})
        .then(response => { // 2xx OK 
            console.log(response.data)
            dispatch({ type: 'LOGOUT' })
            props.history.push('/');
        }) 
        .catch(err => { // El response devuelve otra cosa distinta a 2xx, hay error, 401 error de token
            if (err.response.status === 401) {
                dispatch({type: 'AUTH_ERROR', error: err.response.data})
                return;
            }
            // Sino muestra mensaje de error 
            if (err.response) {
                setBackendError(err.response.data.msg)
            }
        });
    }

    // Función para modificar el perfil
    const modificarPerfil =  () => {
        let newData = {frequency: frequency, prefered_currency: currency,};
        console.log(newData);
        // Actualizar los valores
        axios.put('http://localhost:4000/user/configuration', newData, {headers:{"x-auth-token": userDetails.token}})
        .then(response => {
            console.log(response.data);
            console.log(userDetails.prefered_currency);
            console.log(userDetails.frequency);
            dispatch({type: "CHANGE_PROFILE", payload: {frequency: frequency, prefered_currency: currency}});
        })
        .catch(err => { // El response devuelve otra cosa distinta a 2xx, hay error, 401 error de token
            if (err.response.status === 401) {
                dispatch({type: 'AUTH_ERROR', error: err.response.data})
                console.log(userDetails.prefered_currency);
                console.log(userDetails.frequency);
                return;
            }
            // Sino muestra mensaje de error 
            if (err.response) {
                console.log(userDetails.prefered_currency);
                console.log(userDetails.frequency);
                setBackendError(err.response.data.msg)
            }
        });
    }

    /* Función para actualizar los valores de currency y frequency*/
    const handleChange = async (e) => {
        e.preventDefault();
        const {name, value} = e.target;
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
                    <select name="currency" value={currency} className="modPerfil-select" onChange={handleChange}>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                    </select>
                    <p>Frecuencia:</p>
                    <select name="frequency" value={frequency} className="modPerfil-select" onChange={handleChange}>
                        <option value="none">Por defecto</option>
                        <option value="anual">Anual</option>
                        <option value="monthly">Mensual</option>
                    </select>
                    <button onClick={modificarPerfil} className="modPerfil-datos-button" type="submit">Modificar perfil</button>
                </div>
                <hr className="modPerfil-separator"/>
                <div className="modPerfil-bottom">
                    <div className="modPerfil-bottom-pswbutton">
                        {/*Enlazar boton con la pagina de cambiar contraseña /change-password
                        <button className="modPerfil-bottom-psw" type="submit">Cambiar contraseña</button>*/}
                        <Link className="modPerfil-bottom-psw btn btn-block" to="/change-password">Cambiar contraseña</Link>
                        
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