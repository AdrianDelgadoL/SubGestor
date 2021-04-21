import React, { Component } from 'react'
import './FAQ.component.css'
import Accordion from './acordion.js'
export default class FAQ extends Component{

    state={
        data:[
            {
                pregunta:"pregunta1",
                respuesta:"descargate abc de efeffe"
            },
            {
                pregunta:"pregunta2",
                respuesta:"estudia"
            },
            {
                pregunta:"pregunta3",
                respuesta:"bla bla bla"
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