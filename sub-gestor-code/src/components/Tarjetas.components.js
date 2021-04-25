import React from 'react'
import Tarjeta from './Tarjeta.components.js'
import './Tarjetas.component.css'
import netflix from '../pages/assets/netflix.jpg'
import HBO from '../pages/assets/hbo.png'
import diseny_plus from '../pages/assets/disney-plus.png'
import amazon_prime from '../pages/assets/amazon-prime.jpg'
import apple_music from '../pages/assets/apple-music.jpg'
import psnplus from '../pages/assets/psn-plus.jpg'
import WOW from '../pages/assets/wow.jpg'
import spotify from '../pages/assets/spotify.png'
import xboxLive from '../pages/assets/xbox-live.jpg'

const cards=[
    {
        id:1,
        title:'Netflix',
        image: netflix,
        price: 'Precio: 8.99€/mes'
    },
    {
        id:2,
        title:'HBO',
        image: HBO,
        price: 'Precio: 8.99€/mes'
    },
    {
        id:3,
        title:'Disney Plus',
        image: diseny_plus,
        price: 'Precio: 8.99€/mes'
    },
    {
        id:4,
        title:'Amazon Prime',
        image: amazon_prime,
        price: 'Precio: 3.99€/mes'
    },
    {
        id:5,
        title:'Apple Music',
        image: apple_music,
        price: 'Precio: 9.99€/mes'
    },
    {
        id:6,
        title:'PSN Plus',
        image: psnplus,
        price: 'Precio: 8.99€/mes'
    },
    {
        id:7,
        title:'WOW',
        image: WOW,
        price: 'Precio: 12.99€/mes'
    },
    {
        id:8,
        title:'Spotify',
        image: spotify,
        price: 'Precio: 9.99€/mes'
    },
    {
        id:9,
        title:'XBOX Live',
        image: xboxLive,
        price: 'Precio: 6.99€/mes'
    },
   
]

function Tarjetas(){
    return(
        <div className="container">
            <div className="row">
                <div className="col-md2">
                <Tarjeta/>
                </div>               
            </div>
                
        </div>
    )
}


export default Tarjetas;