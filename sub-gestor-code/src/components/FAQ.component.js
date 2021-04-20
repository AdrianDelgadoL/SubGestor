import axios from 'axios';
import React, { Component } from 'react';

import './FAQ.component.css'


export default class FAQ extends Component{

        constructor(props){
            super(props);
            this.state={faqs:[]};
        }

        componentDidMount(){
            axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(res=> {
                const faqs=res.data.slice(0,10);
                this.setState({faqs});
            })
        }
    render(){
        return(
            <div>
                <div className="container">
                    <section className="section">
                        <h1 className="title">FAQ</h1>
                        <h2 className="subtitle">abcde</h2>

                        <div className="columns">
                            {this.state.faqs.map(faq =>
                                <div className="column-is-one-third" v-for="faq of faqs">
                                    <div className="card">
                                    <div className="card-content">
                                        <p className="title1">{faq.title}</p>
                                        <p className="answer">{faq.body}</p>
                                    </div>
                                    </div>
                                                
                                </div>
                                )}
                        </div>
                         </section>
                </div>
                </div>

        );
    }
}