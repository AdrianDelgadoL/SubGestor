
import React, { Component, useState } from 'react';

import './FAQ.component.css'
import Accordian from './acordion.js'

export default class FAQ extends Component{
   
    render(){
        const [active,setActive]=useState("titll1");
        
        
        return(
            <div className=" prueba">
                <Accordian title="HOLA1" active={active} setActive={setActive}/>
                <Accordian title="HOLA1" active={active} setActive={setActive}/>
                <Accordian title="HOLA1" active={active} setActive={setActive}/>
                <Accordian title="HOLA1" active={active} setActive={setActive}/>

            </div>


        );
    }

}
