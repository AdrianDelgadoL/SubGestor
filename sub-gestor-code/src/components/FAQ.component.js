import React, { Component } from 'react'
import './FAQ.component.css'
import Accordion from './acordion.js'
export default class FAQ extends Component{

    state={
        data:[
            {
                pregunta:"¿Por qué no puedo añadir suscripciones nada más entrar a la página?",
                respuesta:"Para poder añadir suscripciones, debes estar logeado y préviamente registdo en el sistema."
            },
            {
                pregunta:"¿Cómo cancelo una suscripción?",
                respuesta:"Para cancelar una suscripción basta con seleccionar la suscripción que se desees cancelar "+
                "y seguidamente clickar en cancelar. La página te redireccionará a la web oficial del servicio "+
                "para proceder a su cancelación."
            },
            {
                pregunta:"¿Para qué sirven las plantillas predefinidas y como funcionan?",
                respuesta:"Las plantillas predefinidas son plantillas que sirven para facilitarte la tarea de creación de suscripciones."+
                " Dichas plantillas ofrecen al usuario la capacidad de no tener que rellenar datos."+
                "Para utilizar una de estas plantillas es suficiente con seleccionar la que desees en el momento"+
                "de añadir una suscripción."
            },
            {
                pregunta:"¿Cómo puedo saber cuanto he gastado en cada suscripción?",
                respuesta:"En la pestaña estadísticas puedes observar gráficas que indican el gasto mensual como el gasto"+
                          "de cada suscripción."
            },
            {
                pregunta:"¿Puedo modificar el precio de una suscripción?",
                respuesta:"Sí. Esto se puede hacer realizando click sobre una suscripción ya sea predefinida o creada "+
                          "y allí se modifica el campo precio." 
            },
            {
                pregunta:"¿Puedo catalogar las suscripciones?",
                respuesta:"Sí. Para ello existe el campo de 'tags' o etiquetas en el formulario de creación de suscripción. "+
                          "Por ejemplo se le podría poner el tag: 'series' a Netflix para poder realizar una búsqueda más precisa"+
                          "posteriormente."
            }

        ]
    }
    render(){
        const {data}=this.state;
        return( 
            <div className="titulo">
                <h2>Frequently Asked Question</h2>
                <p className="intro">Si tienes alguna duda respecto al funcionamiento del sistema o de alguna de sus herrarmientas
                puede que alguna de las siguientes preguntas te ayude.
                </p>
                <div className="accordion">
                    <div className="accordion-container">
                        {data.map((item,index)=>{
                            return <Accordion key={index} pregunta={item.pregunta} respuesta={item.respuesta}/>
                        })}
                    </div>
                </div> 
            </div>

            );
    }
}