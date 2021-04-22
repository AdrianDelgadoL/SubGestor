//import Title from 'antd/lib/skeleton/Title';
import React, { Component } from 'react'

export default class Accordion extends Component{
    state={
        showInfo:false
    }
handleToogle=()=>{
    this.setState({
        showInfo:!this.state.showInfo
    })
}
    render(props){
        const {pregunta,respuesta}=this.props;

        return(
            
            <div className="single_accordion">
                <div className={this.state.showInfo ? 'tab active':'tab'} onClick={this.handleToogle}>
                    <p>{pregunta}</p>
                </div>
                <div className={this.state.showInfo ?'showContent content':'content'}>
                    <p>{respuesta}</p>
                </div>
            </div>

            );
    }


}