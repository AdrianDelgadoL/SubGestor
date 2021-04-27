import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Subscription from './Subscription.components.js'
import './SubList.component.css'
import amazon_prime from '../assets/amazon-prime.jpg'
import { useAuthState, useAuthDispatch } from '../../context/context'
import axios from "axios";


const SubList = (props) => {

    const userDetails = useAuthState()
    const dispatch = useAuthDispatch()
    const userToken = userDetails.token
    const [tarjetas, setTarjetas] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:4000/subscription/', {headers: {"x-auth-token": userToken}})
            .then(response => {
                setTarjetas(response.data.map(tarjeta => (                   
                    <div className="row-md-2" key={tarjeta._id}>
                        <Subscription title={tarjeta.name}imageSource={amazon_prime} card_price={tarjeta.price} payment_type={tarjeta.currency}/>
                    </div>
                )))
            }).catch(error => {
                if(error.response) {
                    if(error.response.status == 404) {
                        setTarjetas(
                            <h1>Parece que aún no existe ninguna suscripción</h1>
                        )
                    } else {
                        dispatch({ type: 'AUTH_ERROR', error: error.response.data })
                        props.history.push('/');
                    }
                }
            })
    }, [])

    return(
        <div>
            <h2>Tus Suscripciones</h2>
            <div className="container">             
                {tarjetas}                
            </div>
            <div className="createSubscription">
                <Link to ="/createSub">Crear nueva suscripcion</Link>
            </div>
        </div>
    )
}


export default SubList;