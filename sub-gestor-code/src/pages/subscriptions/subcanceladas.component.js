import React, { useState, useEffect } from 'react';
import Subscription from './SubscriptionCanceladas.components.js';
import './SubList.component.css';
import { useAuthState, useAuthDispatch } from '../../context/context';
import axios from "axios";


const SubCanceladas = (props) => {

    const userDetails = useAuthState();
    const dispatch = useAuthDispatch();
    const userToken = userDetails.token;
    const [tarjetas, setTarjetas] = useState(null);
    const imageRoute = "/images/";

    useEffect(() => {
        // 404 no se encuentra suscripciones canceladas
        // 500 error al buscar suscripciones
        // 200 todo ok
        axios.get('http://localhost:4000/canceled-sub/old/', {headers: {"x-auth-token": userToken}})
            .then(response => {
                console.log("Entra en las suscripciones canceladas");
                console.log(response.data);
                // Hasta aquí bien
                setTarjetas(response.data.map(tarjeta => (                   
                    <div className="row-md-2" key={tarjeta._id}>
                        <Subscription title={tarjeta.name} imageSource={imageRoute + tarjeta.img_src} card_price={tarjeta.price} payment_type={tarjeta.currency} canceled_date={tarjeta.canceled_date} sub_id={tarjeta._id}/>
                    </div>
                )))
            }).catch(err => { // El response devuelve otra cosa distinta a 2xx
                if(err.response.status == 404) {
                    setTarjetas(<h1>Parece que aún no existe ninguna suscripción cancelada</h1>)
                } else {
                    console.log("Error: no es 404")
                    dispatch({ type: 'AUTH_ERROR', error: err.response.data })
                    //props.history.push('/');
                }
            })
    }, [dispatch, props.history, userToken])

    return(
        <div>
            <h2>Tus suscripciones canceladas</h2>
            <div className="subList-container container">             
                {tarjetas}                
            </div>
            <div className="subList-canceladas-b">
                <a href="/home">Volver a inicio</a>
            </div>
        </div>
    )
}


export default SubCanceladas;