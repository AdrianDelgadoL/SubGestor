import React from 'react'
import './Subscription.component.css'


function Subscription({title,imageSource,card_price,payment_type}){
    
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
            <a href="#!" id="consulta" className="btn btn-outline-secondary border-0"> Consultar suscripción</a>
        </div>
    </div>
    );
}

export default Subscription;