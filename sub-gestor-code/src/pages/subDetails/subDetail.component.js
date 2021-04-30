import React, { useEffect, useState } from 'react';
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
    var [name, setName] = useState(null);
    var [datePayment, setDatePayment] = useState(null);
    var [frequency, setFrequency] = useState(null);
    var [price, setPrice] = useState(null);
    var [currency, setCurrency] = useState(null);
    var [freeTrial, setFreeTrial] = useState(null);
    var [dateEndTrial, setDateEndTrial] = useState(null);
    var [hasEnd, setHasEnd] = useState(null);
    var [dateEnd, setDateEnd] = useState(null);
    var [url, setUrl] = useState(null);
    var [startDate, setStartDate] = useState(null);
    var [tags, setTags] = useState(null);
    var [description, setDescription] = useState(null);
    var [imgSrc, setImgSrc] = useState(null);

    useEffect(() => {
        console.log(props.match.params.id);
        axios.get('http://localhost:4000/subscription/'+ props.match.params.id, {headers: {"x-auth-token": userDetails.token}})
        .then(response => {
            console.log("Dades:");
            console.log(response.data);
            setName(name = response.data.name);
            setImgSrc(imgSrc = response.data.img_src);
            setDatePayment(datePayment = response.data.charge_date.substr(0, response.data.charge_date.indexOf('T')));
            setFrequency(frequency = response.data.frequency);
            setPrice(price = response.data.price);
            setCurrency(currency = response.data.currency);
            setFreeTrial(freeTrial = response.data.free_trial);
            if(freeTrial)
                setDateEndTrial(dateEndTrial = response.data.free_trial_end.substr(0, response.data.free_trial_end.indexOf('T')));
            setHasEnd(hasEnd = response.data.end);
            if(hasEnd)
                setDateEnd(dateEnd = response.data.end_date.substr(0, response.data.end_date.indexOf('T')));
            setUrl(url = response.data.url);
            setStartDate(startDate = response.data.start_date.substr(0, response.data.start_date.indexOf('T')));
            setTags(tags = response.data.tags);
            setDescription(description = response.data.description);
        })
        .catch(function (error){ //El response devuelve algo distinto a 2xx, por lo tanto hay error
            console.log(error);
            if(error.response) {
                //TODO: tractar si hi ha resposta d'error
            }
        })
    }, [])

    return (
        <div>
            <h2>Información detallada de la suscripción</h2>
            <div className="grid-container">
                <div className="grid-container-header">
                    <div className="image">
                        <img id="logo" alt="imagen aleatoria" src="https://picsum.photos/700/400?random"></img>
                    </div>
                    <div className="name">
                        <input type="text" id="name" defaultValue={name}></input>
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
                        <input type="date" id="datePayment" defaultValue={datePayment}></input>
                    </div>
                    <div className="frequency">
                        <label for="frequency">Frecuencia:</label><br />
                        <select id="frequency" defaultValue={frequency}>
                            <option value="mensual">Mensual</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>
                    <div className="price">
                        <label for="price">Precio:</label><br/>
                        <input type="number" id="price" defaultValue={price}></input>
                    </div>
                    <div className="currency">
                        <label for="currency">Divisa:</label><br />
                        <select id="currency" defaultValue={currency}>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                </div>
                <div className="grid-container-extra">
                    <div className="freeTrial">
                        <label for="freeTrial"><input type="checkbox" id="freeTrial" defaultValue={freeTrial}></input>Periodo de prueba</label><br />
                    </div>
                    <div className="dateEndTrial">
                        <label for="dateEndTrial">Fecha de vencimiento:</label><br />
                        <input type="date" id="dateEndTrial" defaultValue={dateEndTrial}></input>
                    </div>
                    <div className="hasEnd">
                    <label for="hasEnd"><input type="checkbox" id="hasEnd" defaultValue={hasEnd}></input>Fecha de finalización</label><br />
                    </div>
                    <div className="dateEnd">
                        <label for="dateEnd">Fecha de finalización:</label><br />
                        <input type="date" id="dateEnd" defaultValue={dateEnd}></input>
                    </div>
                </div>
                <div className="grid-container-information">
                    <div className="url">
                        <label for="url">URL para desuscribirse:</label><br />
                        <input type="url" id="url" defaultValue={url}></input>
                    </div>
                    <div className="startDate">
                        <label for="startDate">Fecha de inicio:</label><br />
                        <input type="date" id="startDate" defaultValue={startDate}></input>
                    </div>
                    <div className="tags">
                        <label for="tags">Tags (separados por una coma):</label><br />
                        <input type="text" id="tags" defaultValue={tags}></input>
                    </div>
                    <div className="description">
                        <label for="description">Descripción:</label><br />
                        <textarea rows="4" cols="50" id="description" form="">
                        {description}
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
        
    )
}


export default SubDetail;