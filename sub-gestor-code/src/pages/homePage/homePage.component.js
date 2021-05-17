import React, { Component } from 'react';
import './homePage.css'
import foto1 from '../assets/funcionamiento-1.PNG'
import foto2 from '../assets/quienes-somos.jpg'

export default class HomePage extends Component {
    render() {
        return (
            <div className="homePage">
                <h2 className="homePage_titulo">SubGestor</h2>
                <div className="homePage_text">
                    <h3 className="homePage_eslogan">Gestiona tus suscripciones de forma sencilla y mantén el control de tus servicios contratados</h3>
                    
                </div>  
                <body className="homePage_cuerpo">  
                <div className="homePage_imagenes">
                    <div className="homePage_imagen-1">
                    <div className="homePage_c-img">
                        <img className="homePage_foto"src={foto1} alt=""></img>
                        <div className="homePage_txt">
                            
                            <p className="homePage_subtit">GestorSub es una aplicación web que sirve para poder organizar tus suscripciones
                            a diferentes plataformas en un mismo espacio. Además, puedes llevar un control de cuanto estas gastando en cada suscripción,
                            así como añadir suscripciones personalizadas.</p>

                        </div>
                    </div>
                    </div>
                    <div className="homePage_imagen-2">
                    <div className="homePage_d-img">
                        <img className="homePage_foto" src={foto2}  alt=""></img>
                        <div className="homePage_txt">
                            <p className="homePage_subtit">Somos un grupo de estudiantes de ingeniería informática, cada uno con diferentes aptitudes,
                            que se han propuesto realizar una página web totalmente funcional desde cero, para así poder aplicar
                            las capacidades adquiridas a lo largo de la carrera de ingeniería informática. </p>

                        </div>
                    </div>
                    </div>
                    
                </div> 
             <form method="get" action="/signIn" class="homePage-form">
                <button className="homePage_boton"type="submit">Empieza ya</button>
            </form>
                
        </body>
                </div>
        )
    }
}