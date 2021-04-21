import React, { Component } from 'react'
import './FAQ.component.css'
import Accordion from './acordion.js'
export default class FAQ extends Component{
    constructor(props) {
        super(props)
        this.state={
            data:[
                {
                    title:"pregunta1",
                    texts:"descargate abc de efeffe"
                },
                {
                    title:"pregunta2",
                    texts:"estudia"
                },
                {
                    title:"pregunta3",
                    texts:"bla bla bla"
                }
    
            ]
        }
    }


    render(){

        const {data}=this.state;
        return(
            <div className="accordion">

                {data.map((item,index)=>{
                    return <Accordion key={index} title={item.title} texts={item.texts}/>
                 })}
               
            </div>

            );

    }


}