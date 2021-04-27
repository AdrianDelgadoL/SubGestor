import React from 'react'
import './Subscription.component.css'
import {Link} from 'react-router-dom';
import moment from 'moment'

function Subscription({title,imageSource,card_price,payment_type, charge_date, sub_id}){
    const detailLink = "/subDetail/" + sub_id
    function selectCurrency() {
        switch(payment_type) {
        case "EUR":
            return "€"
        case "Dolars":
            return "$"
        default:
            return ""
        }
    }
    
    return(
    <div class="card-container">
        <div class="img-col">
            <img src={imageSource} alt=""></img>
        </div>
        <div class="text-col">
            <h3 className="titulo">{title}</h3>
            <p className="precio" >{card_price}{selectCurrency()}</p>
            <p className="charge_date" >Próximo cobro: {moment(charge_date).format("DD/MM/YYYY")}</p>
            <Link to ={detailLink} className="btn btn-outline-secondary border-0" >Consultar suscripción</Link>
        </div>
    </div>
    );
}

export default Subscription;