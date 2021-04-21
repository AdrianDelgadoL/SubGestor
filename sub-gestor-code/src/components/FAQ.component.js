import React, { Component } from 'react'
import './FAQ.component.css'
import Accordion from './acordion.js'
export default class FAQ extends Component{

    state={
        data:[
            {
                pregunta:"¿Por qué no puedo añadir suscripciones nada más entrar a la página?",
                respuesta:"Para poder añadir suscripciones, el usuario debe estar logeado y préviamente registdo en el sistema"
            },
            {
                pregunta:"¿Cómo cancelo una suscripción?",
                respuesta:"Para cancelar una suscripción basta con seleccionar la suscripción que se desee cancelar "+
                "y seguidamente clickar en en cancelar, y la página le redireccionará a la web oficial del servicio "+
                "para proceder a su cancelación."
            },
            {
                pregunta:"¿Para que sirven las plantillas predefinidas y como funcionan?",
                respuesta:"Las plantillas predefinidas son plantillas que sirven para facilitar al usuario la tarea de creación de suscripciones."+
                "Dichas plantillas ofrecen al usuario la capacidad de no tener que rellenar datos."+
                "Para utilizar una de estas plantillas es suficiente con seleccionar la que desees en el momento"+
                "de añadir una suscripción."
            }

        ]
    }
    render(){
        const {data}=this.state;
        return( 
            <div className="titulo">
                <h2>Frequently Asked Question</h2>
                <p className="intro">En este apartado se van a poner preguntas frecuentes que puedan ayudar a los usuarios</p>
                <div className="accordion">
                {data.map((item,index)=>{
                    return <Accordion key={index} pregunta={item.pregunta} respuesta={item.respuesta}/>
                 })}
                </div> 
            </div>

            );
    }
}