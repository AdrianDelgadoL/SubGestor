import React, { useEffect, useState} from 'react';
//import {Link} from 'react-router-dom'
import './subDetail.css'
import {useAuthState} from '../../context/context';
import axios from "axios";

const SubDetail = (props) => { 

    //const dispatch = useAuthDispatch();
    //useAuthState en header (x-auth-token)
    const userDetails = useAuthState();
    //props.match.params.id -> id de consulta
    // /detail/:id
    const [name, setName] = useState(null);
    const [datePayment, setDatePayment] = useState(null);
    const [frequency, setFrequency] = useState(null);
    const [price, setPrice] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [freeTrial, setFreeTrial] = useState(null);
    const [dateEndTrial, setDateEndTrial] = useState(null);
    const [hasEnd, setHasEnd] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [url, setUrl] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [tags, setTags] = useState(null);
    const [description, setDescription] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);

    const [imgSrcError, setImgSrcError] = useState('');
    const [freeTrialEndError, setFreeTrialEndError] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [chargeDateError, setChargeDateError] = useState('');
    const [urlError, setUrlError] = useState('');
    const [ backendError, setBackendError ] = useState(''); //setear el error al enviar


    useEffect(() => {
        console.log(props.match.params.id);
        axios.get('http://localhost:4000/subscription/'+ props.match.params.id, {headers: {"x-auth-token": userDetails.token}})
        .then(response => {
            setName(response.data.name);
            setImgSrc("/images/" + response.data.img_src);
            setDatePayment(response.data.charge_date.substr(0, response.data.charge_date.indexOf('T')));
            setFrequency(response.data.frequency);
            setPrice(response.data.price);
            setCurrency(response.data.currency);
            setFreeTrial(response.data.free_trial);
            if(freeTrial)
                setDateEndTrial(response.data.free_trial_end.substr(0, response.data.free_trial_end.indexOf('T')));
            setHasEnd(response.data.end);
            if(hasEnd)
                setDateEnd(response.data.end_date.substr(0, response.data.end_date.indexOf('T')));
            setUrl(response.data.url);
            if(response.data.start_date)
                setStartDate(response.data.start_date.substr(0, response.data.start_date.indexOf('T')));
            setTags(response.data.tags);
            setDescription(response.data.description);
        })
        .catch(function (error){ //El response devuelve algo distinto a 2xx, por lo tanto hay error
            console.log(error);
            if(error.response) {
                //TODO: tractar si hi ha resposta d'error
            }
        })
    }, [])

    const changeImage = async (e) => {
        let img = e.target.files[0];
        if (!img) {
            setImgSrcError('');
            setImgSrc(null);
            return;
        }
        if (img.size > 1024 * 1024) {
            setImgSrc(null);
            setImgSrcError('El tamaño de la imagen es superior a 1Mb');
        } else if (!img.type.startsWith('image')) {
            setImgSrc(null);
            setImgSrcError('Por favor seleccione una imagen');
        } else {
            setImgSrcError('');
            setImgSrc(e.target.files[0]);
        }
    }

    const changeFreeTrialEnd = async (e) => {
        if (!freeTrial) {
            setFreeTrialEnd(null);
            setFreeTrialEndError('');
        }
        setFreeTrial(!freeTrial);
    };

    const changeEndDate = async (e) => {
        if (!hasEnd) {
            setEndDate(null);
            setEndDateError('');
        }
        setEnd(!hasEnd);
    };

    const eliminar = () => {
        axios.delete('http://localhost:4000/subscription/' + props.match.params.id, {headers: {"x-auth-token": userDetails.token}})
        .then(response => {
            props.history.push('/home');
        })
    }

    const formValid = () => {
        // Valida que los errores esten vacios
        let valid = true;
        setFormError('');
        let errorValues = [freeTrialEndError, endDateError, priceError, chargeDateError, urlError, imgSrcError];
        errorValues.forEach(value => {
            if (value.length > 0) {
                valid = false;
            }
        })
    };

    //TODO: petició de canvi i gestió dels errors
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formValid()) {
            let data = new FormData();
            data.append('name', name);
            data.append('active', true);
            data.append('free_trial', !freeTrial);
            data.append('free_trial_end', dateEndTrial);
            data.append('end', !hasEnd);
            data.append('end_date', dateEnd);
            data.append('currency', currency);
            data.append('frequency', frequency);
            data.append('price', price);
            data.append('charge_date', datePayment);
            data.append('url', url);
            data.append('start_date', startDate);
            data.append('description', description);
            data.append('tags', tags);
            data.append('image', imgSrc);

            axios.put('http://localhost:4000/subscription/'+ props.match.params.id, data, {headers: 
            {
                "x-auth-token": userDetails.token,
                "Content-Type": "multipart/form-data"
            }})
            .then(
                //al modificar la suscripcion 
            )
            .catch(
                //si devuelve un error el backend
            )
        }
    }

    const handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;

        switch (name) {
            case "free_trial_end":
                validateValue.isBefore(value) ? setFreeTrialEndError("Fecha inválida") : setFreeTrialEndError("");
                setFreeTrialEnd(value);
                break;
            case "end_date":
                validateValue.isBefore(value) ? setEndDateError("Fecha inválida") : setEndDateError("");
                setEndDate(value);
                break;
            case "charge_date":
                validateValue.isBefore(value) ? setChargeDateError("Fecha inválida") : setChargeDateError("");
                setChargeDate(value);
                break;
            case "price":
                ((validateValue.isInt(value) || validateValue.isDecimal(value)) && (value >= 0)) ? setPriceError("") : setPriceError("Valor inválido, tiene que ser un número positivo");
                setPrice(value);
                break;
            case "url":
                if (value.length > 0) {
                    validateValue.isURL(value) ? setUrlError("") : setUrlError("Valor inválido, tiene que ser una URL (Ejemplo: http://www.example.com)");
                    setUrl(value);
                } else {
                    setUrlError('');
                    setUrl('');
                }
                break;
            case "nameSub":
                setName(value);
                break;
            case "end":
                setEnd(value);
                break;
            case "frequency":
                setFrequency(value);
                break;
            case "currency":
                setCurrency(value);
                break;
            case "free_trial":
                setFreeTrial(value);
                break;
            case "start_date":
                setStartDate(value);
                break;
            case "description":
                setDescription(value);
                break;
            case "tags":
                setTags(value);
                break;
            default:
                setImgSrc(value);
                break;
        }
    }

    return (
        <div>
            <h2>Información detallada de la suscripción</h2>
            <form enctype="multipart/form-data" noValidate>
                <div className="grid-container">
                    <div className="grid-container-header">
                        <div className="image">
                            <img id="logo" alt="imagen aleatoria" src={imgSrc}></img>
                            <input id="chooseFile" type="file" name="img_src" onChange={changeImage} />
                            {imgSrcError.length > 0 && (
                                <span className="errorMessage">{imgSrcError}</span>
                            )}
                        </div>
                        <div className="name">
                            <input 
                                type="text" 
                                id="name"
                                defaultValue={name}
                                onChange={handleChange}
                                name="nameSub"
                                ></input>
                        </div>
                        <div className="modifyButton">
                            {backendError.length > 0 && (
                                <span className="errorMessage">{backendError}</span>
                            )}
                            <input 
                                type="button"  
                                id="modifyButton"
                                value="Guardar cambios"
                                onClick={handleSubmit}
                                ></input>
                        </div>
                        <div className="deleteButton">
                            <input 
                                onClick={eliminar} 
                                type="button" 
                                id="deleteButton" 
                                value="Eliminar suscripción"
                                ></input>
                        </div>
                    </div>
                    <div className="grid-container-price">
                        <div className="datePayment">
                            <label for="datePayment">Fecha de pago: (mm/dd/yyyy)</label><br />
                            <input 
                                type="date" 
                                id="datePayment" 
                                defaultValue={datePayment}
                                onChange={handleChange}
                                name="charge_date"
                                ></input>
                            {chargeDateError.length > 0 && (
                                <span className="errorMessage">{chargeDateError}</span>
                            )}
                        </div>
                        <div className="frequency">
                            <label for="frequency">Frecuencia:</label><br />
                            <select id="frequency" defaultValue={frequency} onChange={handleChange} name="frequency">
                                <option value="mensual">Mensual</option>
                                <option value="anual">Anual</option>
                            </select>
                        </div>
                        <div className="price">
                            <label for="price">Precio:</label><br/>
                            <input 
                                type="number" 
                                id="price" 
                                defaultValue={price}
                                onChange={handleChange}
                                name="price"
                                ></input>
                            {priceError.length > 0 && (
                                <span className="errorMessage">{priceError}</span>
                            )}
                        </div>
                        <div className="currency">
                            <label for="currency">Divisa:</label><br />
                            <select id="currency" defaultValue={currency} onChange={handleChange} name="currency">
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid-container-extra">
                        <div className="freeTrial">
                            <label for="freeTrial"><input type="checkbox" id="freeTrial" defaultValue={freeTrial} onClick={changeFreeTrialEnd} name="free_trial"></input>Periodo de prueba</label><br />
                        </div>
                        <div className="dateEndTrial">
                            <label disabled={freeTrial} for="dateEndTrial">Fecha de vencimiento:</label><br />
                            <input 
                                type="date" 
                                id="dateEndTrial" 
                                defaultValue={dateEndTrial}
                                onChange={handleChange}
                                name="free_trial_end"
                                ></input>
                            {freeTrialEndError.length > 0 && (
                                <span className="errorMessage">{freeTrialEndError}</span>
                            )}
                        </div>
                        <div className="hasEnd">
                        <label for="hasEnd"><input type="checkbox" id="hasEnd" defaultValue={hasEnd} onClick={changeEndDate} name="end"></input>Fecha de finalización</label><br />
                        </div>
                        <div className="dateEnd">
                            <label for="dateEnd">Fecha de finalización:</label><br />
                            <input 
                                disabled={hasEnd}
                                type="date" 
                                id="dateEnd" 
                                defaultValue={dateEnd}
                                onChange={handleChange}
                                name="end"
                                ></input>
                            {endDateError.length > 0 && (
                                <span className="errorMessage">{endDateError}</span>
                            )}
                        </div>
                    </div>
                    <div className="grid-container-information">
                        <div className="url">
                            <label for="url">URL para desuscribirse:</label><br />
                            <input 
                                type="url" 
                                id="url" 
                                defaultValue={url}
                                onChange={handleChange}
                                name="url"
                                ></input>
                        </div>
                        <div className="startDate">
                            <label for="startDate">Fecha de inicio:</label><br />
                            <input 
                                type="date" 
                                id="startDate" 
                                defaultValue={startDate}
                                onChange={handleChange}
                                name="start_date"
                                ></input>
                            {urlError.length > 0 && (
                                <span className="errorMessage">{urlError}</span>
                            )}
                        </div>
                        <div className="tags">
                            <label for="tags">Tags (separados por una coma):</label><br />
                            <input 
                                type="text" 
                                id="tags" 
                                defaultValue={tags}
                                onChange={handleChange}
                                name="tags"
                                ></input>
                        </div>
                        <div className="description">
                            <label for="description">Descripción:</label><br />
                            <textarea 
                                rows="2" 
                                cols="50" 
                                id="description" 
                                form="" 
                                defaultValue={description} 
                                onChange={handleChange}
                                name="description">
                            </textarea>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        
    )
}


export default SubDetail;