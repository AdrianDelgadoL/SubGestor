import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Subscription from './Subscription.components.js'
import './SubList.component.css'
import { useAuthState, useAuthDispatch } from '../../context/context'
import axios from "axios";


const SubList = (props) => {

    const userDetails = useAuthState()
    const dispatch = useAuthDispatch()
    const userToken = userDetails.token
    const [tarjetas, setTarjetas] = useState(null)
    const [selector, setSelector] = useState(null)
    const imageRoute = "/images/"
    const defaultSelect = useState("mes")

    useEffect(() => {
        axios.get('http://localhost:4000/subscription/', {headers: {"x-auth-token": userToken}})
            .then(response => {
                if(response.data.length == 0) {
                    setTarjetas(<h1>Parece que aún no existe ninguna suscripción</h1>)
                } else {
                    const handlePeriodChange = function (e) {
                        const option = e.target.value
                        setTarjetas(response.data.map(tarjeta => (                   
                            <div className="row-md-2" key={tarjeta._id}>
                                <Subscription title={tarjeta.name} imageSource={imageRoute + tarjeta.img_src} card_price={tarjeta.price} 
                                payment_type={tarjeta.currency} charge_date={tarjeta.charge_date} sub_id={tarjeta._id} url={tarjeta.url} period={option} />
                            </div>
                        )))
                    }
                    setSelector(
                        <select onChange={handlePeriodChange} className="btn dropdown-menu-right">
                            <option value="mes" defaultValue>Mensual</option>
                            <option value="año">Anual</option>
                        </select>
                    )
                    setTarjetas(response.data.map(tarjeta => (                   
                        <div className="row-md-2" key={tarjeta._id}>
                            <Subscription title={tarjeta.name} imageSource={imageRoute + tarjeta.img_src} card_price={tarjeta.price} 
                            payment_type={tarjeta.currency} charge_date={tarjeta.charge_date} sub_id={tarjeta._id} url={tarjeta.url} period={defaultSelect} />
                        </div>
                    )))
                }
            }).catch(error => {
                if(error.response) {
                    dispatch({ type: 'AUTH_ERROR', error: error.response.data })
                    props.history.push('/');
                }
            })
    }, [dispatch, props.history, userToken])

    return(
        <div>
            <h2>Tus suscripciones</h2>
            <div className="subList-selector">
                {selector}
            </div>
            <div className="subList-container container">             
                {tarjetas}                
            </div>
            <div className="subList-createSubscription">
                <Link to ="/createSub">Crear nueva suscripcion</Link>
            </div>
        </div>
    )
}


export default SubList;