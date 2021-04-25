import React from 'react'
import './Tarjeta.component.css'
import netflix from '../pages/assets/netflix.jpg'
import HBO from '../pages/assets/hbo.png'
import diseny_plus from '../pages/assets/disney-plus.png'
import amazon_prime from '../pages/assets/amazon-prime.jpg'
import apple_music from '../pages/assets/apple-music.jpg'
import psnplus from '../pages/assets/psn-plus.jpg'
import WOW from '../pages/assets/wow.jpg'
import spotify from '../pages/assets/spotify.png'
import xboxLive from '../pages/assets/xbox-live.jpg'

function Tarjeta(){
    return(
    <div class="card-container">
        <div class="img-col">
            <img src={netflix} alt=""></img>
        </div>
       
        <div class="text-col">
            <h3 className="titulo">NETFLIX</h3>
            <p className="precio" >Precio: 8.99€/mes</p>
            <a href="#!" className="btn btn-outline-secondary border-0"> Consultar suscripción</a>
        </div>
    </div>
    );
}

export default Tarjeta;