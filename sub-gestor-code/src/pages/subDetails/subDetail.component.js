import React, { Component } from 'react';
//import {Link} from 'react-router-dom'
import './subDetail.css'
import {useAuthDispatch, useAuthState} from '../../context/context';
import axios from "axios";


const SubDetail = (props) => { 

    const dispatch = useAuthDispatch();
    //useAuthState en header (x-auth-token)
    const userDetails = useAuthState();
    //props.match.params.id -> id de consulta
    // /detail/:id
    const getSub = () => {
        console.log(props.match.params.id);
        axios.get('http://localhost:4000/'+ props.match.params.id, {headers: {"x-auth-token": userDetails.token}})
        .then(response => {
            console.log(response.data);
        })
        .catch(function (error){ //El response devuelve algo distinto a 2xx, por lo tanto hay error
            console.log(error);
        })
    };


    return (
        <div>
            <h2>Información detallada de la suscripción</h2>
            <div className="grid-container">
                <div className="grid-container-header">
                    <div className="image">
                        <img id="logo" alt="imagen aleatoria" src="https://picsum.photos/700/400?random"></img>
                    </div>
                    <div className="name">
                        <input type="text" id="name" defaultValue="Nombre suscripción"></input>
                    </div>
                    <div className="modifyButton">
                        <input type="button" id="modifyButton" value="Guardar cambios"></input>
                    </div>
                    <div className="deleteButton">
                        <input type="button" id="deleteButton" value="Eliminar suscripción"></input>
                    </div>
                </div>
                <div className="grid-container-price">
                    <div className="datePayment">
                        <label for="datePayment">Fecha de pago:</label><br />
                        <input type="date" id="datePayment" defaultValue="2021-04-22"></input>
                    </div>
                    <div className="frequency">
                        <label for="frequency">Frecuencia:</label><br />
                        <select id="frequency">
                            <option value="mensual">Mensual</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>
                    <div className="price">
                        <label for="price">Precio:</label><br/>
                        <input type="number" id="price" defaultValue="7.5"></input>
                    </div>
                    <div className="currency">
                        <label for="currency">Divisa:</label><br />
                        <select id="currency">
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                </div>
                <div className="grid-container-extra">
                    <div className="freeTrial">
                        <label for="freeTrial"><input type="checkbox" id="freeTrial"></input>Periodo de prueba</label><br />
                    </div>
                    <div className="dateEndTrial">
                        <label for="dateEndTrial">Fecha de vencimiento:</label><br />
                        <input type="date" id="dateEndTrial" defaultValue="2021-04-22"></input>
                    </div>
                    <div className="hasEnd">
                    <label for="hasEnd"><input type="checkbox" id="hasEnd"></input>Fecha de finalización</label><br />
                    </div>
                    <div className="dateEnd">
                        <label for="dateEnd">Fecha de finalización:</label><br />
                        <input type="date" id="dateEnd" defaultValue="2021-04-22"></input>
                    </div>
                </div>
                <div className="grid-container-information">
                    <div className="url">
                        <label for="url">URL para desuscribirse:</label><br />
                        <input type="url" id="url" defaultValue="https://www.google.com/"></input>
                    </div>
                    <div className="startDate">
                        <label for="startDate">Fecha de inicio:</label><br />
                        <input type="date" id="startDate" defaultValue="2021-04-22"></input>
                    </div>
                    <div className="tags">
                        <label for="tags">Tags (separados por una coma):</label><br />
                        <input type="text" id="tags" defaultValue="films,shared"></input>
                    </div>
                    <div className="description">
                        <label for="description">Descripción:</label><br />
                        <textarea rows="4" cols="50" id="description" form="">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique massa sed nisi efficitur, eget aliquet sapien facilisis. Donec faucibus ex elit, a egestas nulla accumsan ut. Nunc vitae nisl elementum, convallis est quis, tempus nulla. Morbi pharetra aliquam ipsum, sit amet dictum mauris ultrices pulvinar. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque est lorem, mollis non tortor non, convallis dictum ligula. Donec et luctus felis. Duis commodo dolor eu dolor dignissim, et fringilla orci commodo. Sed elementum at nisl sit amet imperdiet. Ut a tincidunt nulla. Proin commodo tempor libero nec sagittis. Sed tincidunt magna ut mattis dapibus. In at rutrum metus. Ut vitae dolor vitae turpis egestas efficitur sed vel leo. 
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
        
    )
}


export default SubDetail;