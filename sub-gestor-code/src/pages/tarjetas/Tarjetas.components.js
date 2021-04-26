import React, { useState, useEffect } from 'react';
import Tarjeta from './Tarjeta.components.js'
import './Tarjetas.component.css'
import amazon_prime from '../assets/amazon-prime.jpg'
import { useAuthState } from '../../context/context'
import axios from "axios";


function Tarjetas(){

    const userDetails = useAuthState()
    const userToken = userDetails.token
    const [tarjetas, setTarjetas] = useState(null)


    useEffect(() => {
        axios.get('http://localhost:4000/subscription/', {headers: {"x-auth-token": userToken}})
            .then(response => {
                setTarjetas(response.data.map(tarjeta => (                   
                    <div className="row-md-2" key={tarjeta._id}>
                        <Tarjeta title={tarjeta.name}imageSource={amazon_prime} card_price={tarjeta.price}/>
                    </div>
                )))
            }).catch(error => {
                if(error.response) {
                    if(error.response.status == 404) {
                        setTarjetas(
                            <h1>Parece que aún no existe ninguna suscripción</h1>
                        )
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
        </div>
    )
}


export default Tarjetas;