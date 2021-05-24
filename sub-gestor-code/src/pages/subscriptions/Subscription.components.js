import React from 'react'
import './Subscription.component.css'
import {Link} from 'react-router-dom';
import moment from 'moment'

function Subscription({title,imageSource,card_price,payment_type, charge_date, sub_id, url, free}){
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
                <p className="Subscription-charge_date" >
                    Próximo cobro: {moment(charge_date).format("DD/MM/YYYY")}
                </p>
            </div>
            )
        }
    }
    return(
    <div className="Subscription-card-container">
        <div className="Subscription-img-col">
            <img src={imageSource} className="Subscription-img" alt=""></img>
        </div>
        <h3 className="Subscription-titulo">{title}</h3>
        <div class="Subscription-info-col">
            {freeTrial()}
            <div><Link to ={detailLink} className="btn btn-outline-secondary border-0" >Consultar suscripción</Link></div>
            {url.length !== 0 && (
                <a href={url}>Cancelar suscripción</a>
            )}
        </div>
    </div>
    );
}

export default Subscription;