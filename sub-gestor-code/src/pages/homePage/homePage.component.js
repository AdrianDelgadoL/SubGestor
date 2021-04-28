import React, { Component } from 'react';
import './homePage.css'
import foto1 from '../assets/funcionamiento-1.PNG'
import foto2 from '../assets/quienes-somos.jpg'
import logo from '../assets/logo.png'

export default class HomePage extends Component {
    render() {
        return (
            <div className="homePage">
                <h2 className="titulo">SubGestor</h2>
                <div className="text">
                    <h3 className="eslogan">Gestiona tus suscripciones de forma sencilla y mantén el control de tus servicios contratados</h3>
                    <form method="get" action="/signIn">
                        <button className="boton"type="submit"><span></span>Empieza ya</button>
                    </form>
                </div>  
                
                <body className="cuerpo">  
                <div class="imagenes">
                <div class="imagen-1">
                <div class="c-img">
                    <img src={foto1} alt=""></img>
                    <div class="txt">
                        
                        <p className="subtit">El pasaje "Lorem ipsum..." se ha extraído del texto que dice "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", que se traduciría como 
                            "No hay nadie que ame el dolor mismo, que lo busque y lo quiera tener, simplemente porque es el dolor..."</p>

                    </div>
                </div>
                </div>
                <div class="imagen-2">
                <div class="d-img">
                    <img src={foto2}  alt=""></img>
                    <div class="txt">
                        <p className="subtit">El pasaje "Lorem ipsum..." se ha extraído del texto que dice "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...", que se traduciría como 
                            "No hay nadie que ame el dolor mismo, que lo busque y lo quiera tener, simplemente porque es el dolor..."</p>

                    </div>
                </div>
                </div>
                </div>
               
                </body>


                <footer>
                <div class="pie">2021 &copy; 
                <img class="logo" src={logo} alt=""></img>
                
                </div>

                </footer>
                </div>
            
            
            
        )
    }
}