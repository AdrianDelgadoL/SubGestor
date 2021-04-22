import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './subDetail.css'


export default class subDetail extends Component {
    render() {
        return (
            <div className="grid-container">
                <div className="grid-container-header">
                    <div className="image">
                        <img alt="imagen aleatoria" src="https://picsum.photos/700/400?random"></img>
                    </div>
                    <div className="name">
                        <label for="name">Nom:</label><br />
                        <input type="text" id="name" defaultValue="Nom Subscripció"></input>
                    </div>
                    <div className="modifyButton">
                        <input type="button" id="modifyButton" value="Desar canvis"></input>
                    </div>
                    <div className="deleteButton">
                        <input type="button" id="deleteButton" value="Eliminar subscripció"></input>
                    </div>
                </div>
                <div className="grid-container-price">
                    <div className="datePayment">
                        <label for="datePayment">Data de pagament:</label><br />
                        <input type="date" id="datePayment" defaultValue="2021-04-22"></input>
                    </div>
                    <div className="frequency">
                        <label for="frequency">Freqüencia:</label><br />
                        <select id="frequency">
                            <option value="mensual">Mensual</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>
                    <div className="price">
                        <label for="price">Preu:</label><br/>
                        <input type="number" id="price" defaultValue="7.5"></input>
                    </div>
                    <div className="currency">
                        <label for="currency">Moneda:</label><br />
                        <select id="currency">
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                </div>
                <div className="grid-container-extra">
                    <div className="freeTrial">
                        <label for="freeTrial"><input type="checkbox" id="freeTrial"></input> Periode de proba</label><br />
                    </div>
                    <div className="dateEndTrial">
                        <label for="dateEndTrial">Data de vençuda:</label><br />
                        <input type="date" id="dateEndTrial" defaultValue="2021-04-22"></input>
                    </div>
                    <div className="hasEnd">
                    <label for="hasEnd"><input type="checkbox" id="hasEnd"></input> Data de finalització</label><br />
                    </div>
                    <div className="dateEnd">
                        <label for="dateEnd">Data de finalització:</label><br />
                        <input type="date" id="dateEnd" defaultValue="2021-04-22"></input>
                    </div>
                </div>
                <div className="grid-container-information">
                    <div className="url">
                        <label for="url">URL per desubscribir-se:</label><br />
                        <input type="url" id="url" defaultValue="https://www.google.com/"></input>
                    </div>
                    <div className="startDate">
                        <label for="startDate">Data d'inici:</label><br />
                        <input type="date" id="startDate" defaultValue="2021-04-22"></input>
                    </div>
                    <div className="tags">
                        <label for="tags">Tags (separats per una coma):</label><br />
                        <input type="text" id="tags" defaultValue="films,shared"></input>
                    </div>
                    <div className="description">
                        <label for="description">Descripció:</label><br />
                        <textarea rows="4" cols="50" id="description" form="">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique massa sed nisi efficitur, eget aliquet sapien facilisis. Donec faucibus ex elit, a egestas nulla accumsan ut. Nunc vitae nisl elementum, convallis est quis, tempus nulla. Morbi pharetra aliquam ipsum, sit amet dictum mauris ultrices pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque est lorem, mollis non tortor non, convallis dictum ligula. Donec et luctus felis. Duis commodo dolor eu dolor dignissim, et fringilla orci commodo. Sed elementum at nisl sit amet imperdiet. Ut a tincidunt nulla. Proin commodo tempor libero nec sagittis. Sed tincidunt magna ut mattis dapibus. In at rutrum metus. Ut vitae dolor vitae turpis egestas efficitur sed vel leo. 
                        </textarea>
                    </div>
                </div>
            </div>
            
        )
    }
}