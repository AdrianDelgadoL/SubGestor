import React from 'react'
import './Subscription.component.css'


function Subscription({title,imageSource,card_price}){
    return(
    <div class="card-container">
        <div class="img-col">
            <img src={imageSource} alt=""></img>
        </div>
        <div class="text-col">
            <h3 className="titulo">{title}</h3>
            <p className="precio" >{card_price}</p>
            <a href="#!" id="consulta" className="btn btn-outline-secondary border-0"> Consultar suscripción</a>
        </div>
    </div>
    );
}

export default Subscription;