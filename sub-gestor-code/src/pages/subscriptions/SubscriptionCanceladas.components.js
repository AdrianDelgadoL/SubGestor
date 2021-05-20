import React from 'react'
import './Subscription.component.css'
import {Link} from 'react-router-dom';
import moment from 'moment'

function Subscription({title,imageSource,card_price,payment_type, charge_date, sub_id, canceled_date, free}){
    const detailLink = "/subDetail/" + sub_id
    function selectCurrency() {
        switch(payment_type) {
        case "EUR":
            return "€"
        case "USD":
            return "$"
        case "GBP":
            return "£"
        default:
            return ""
        }
    }
    function freeTrial() {
        if(free) {
            return (
            <div>
                <p className="Subscription-precio" > Suscripcion de Prueba </p>
                <p className="Subscription-charge_date" >
                    Finalización: {moment(charge_date).format("DD/MM/YYYY")}
                </p>
            </div>
            )
        } else {
            return (
            <div>
                <p className="Subscription-precio" >{card_price}{selectCurrency()}</p>
                <p className="Subscription-canceled-date">
                    Cancelada: {moment(canceled_date).format("DD/MM/YYYY")}
                </p>
                <p className="Subscription-charge_date" >
                    Próximo cobro: {moment(charge_date).format("DD/MM/YYYY")}
                </p>
            </div>
            )
        }
    }
    return(
    <div class="Subscription-card-container">
        <div class="img-col">
            <img src={imageSource} alt=""></img>
        </div>
        <div class="Subscription-text-col text-col">
            <h3 className="Subscription-titulo">{title}</h3>
            {freeTrial()}
            <Link to ={detailLink} className="btn btn-outline-secondary border-0" >Consultar suscripción</Link>
        </div>
    </div>
    );
}

export default Subscription;