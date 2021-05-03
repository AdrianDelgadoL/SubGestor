import React, { Component, useState } from 'react';
import { useAuthState, useAuthDispatch } from '../../context/context.js';
import axios from 'axios';
import './createSubscription.component.css'
const validateValue = require('validator');


const CreateSubscription = (props) => {
    const [nameSub, setName] = useState(null);
    const [free_trial, setFreeTrial] = useState(true);
    const [free_trial_end, setFreeTrialEnd] = useState(null);
    const [end, setEnd] = useState(true);
    const [end_date, setEndDate] = useState(null);
    const [currency, setCurrency] = useState("EUR");
    const [frequency, setFrequency] = useState("monthly");
    const [price, setPrice] = useState(null);
    const [charge_date, setChargeDate] = useState(null);
    const [url, setUrl] = useState(null);
    const [start_date, setStartDate] = useState(null);
    const [description, setDescription] = useState(null);
    const [img_src, setImgSrc] = useState(null);
    const [tags, setTags] = useState(null);

    const [freeTrialEndError, setFreeTrialEndError] = useState('');
    const [endDateError, setEndDateError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [chargeDateError, setChargeDateError] = useState('');
    const [urlError, setUrlError] = useState('');
    const [formError, setFormError] = useState('');
    const [imgSrcError, setImgSrcError] = useState('');
    const [ backendError, setBackendError ] = useState('');

    const userToken = useAuthState().token;
    const dispatch = useAuthDispatch()

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
        // elimina el valor de free_trial_end si se desactiva la opcion (disabled == true)
        if (!free_trial) {
            setFreeTrialEnd(null);
            setFreeTrialEndError('');
            console.log(free_trial_end);
        }
        setFreeTrial(!free_trial);
    };

    const changeEndDate = async (e) => {
        // elimina el valor de end_date si se desactiva la opcion (disabled == true)
        console.log(end_date)
        if (!end) {
            setEndDate(null);
            setEndDateError('');
            console.log(end_date);
        }
        setEnd(!end);
    };

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
        // Valida que els camps obligatoris estan plens
        if (nameSub == null) {
            valid = false;
            setFormError("ERROR: faltan campos obligatiorios por completar");
        } else if (nameSub.length === 0 || price == null) {
            valid = false;
            setFormError("ERROR: faltan campos obligatiorios por completar");
        }
        console.log("DADES ENVIADES")
        console.log("Name = " + nameSub);
        console.log("Frequencia = " + frequency);
        console.log("Divisa = " + currency);
        console.log("Preu = " + price);
        return valid;
    };

    // TODO: QUEDA EL HANDLESUBMIT -- backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formValid()) {
            console.log("FORM VALID");
            let data = new FormData();

            // Valors base
            data.append('name', nameSub);
            data.append('active', true);
            data.append('free_trial', !free_trial);
            data.append('free_trial_end', free_trial_end);
            data.append('end', !end);
            data.append('end_date', end_date);
            data.append('currency', currency);
            data.append('frequency', frequency);
            data.append('price', price);
            data.append('charge_date', charge_date);
            data.append('url', url);
            data.append('start_date', start_date);
            data.append('description', description);
            data.append('tags', tags);

            // Imatge
            data.append('image', img_src)

            axios({
                method: "post",
                url: "http://localhost:4000/subscription",
                data: data,
                headers: {
                    'x-auth-token': userToken,
                    "Content-Type": "multipart/form-data"
                }
            })
            .then(res => {
                // Vuelve al home una vez creada
                props.history.push('/home');
            })
            .catch(err => {
                if (err.response.status === 401) { // Sin autorización envialos al login
                    dispatch({ type: 'AUTH_ERROR', error: error.response.data })
                    props.history.push('/signIn');
                    return;
                }
                // Sino muestra mensaje de error
                if (err.response) {
                    setBackendError(err.response.data.msg);
                }
            });
        } else {
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
        }
    };

    const handleChange = async (e) => {
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
                    setUrl(null);
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
                console.log("HOLA");
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
    };

    return (
        <div className="createSubscription-formSub">
            <h2 id="creator"> Crear nueva suscripción </h2>
            <form enctype="multipart/form-data" noValidate>
                <div className="createSubscription-formSub-grid">
                    <p id="information"> Información </p>
                    <div className="createSubscription-information">
                        <div className="createSubscription-name">
                            <label htmlFor="nameSub"> Nombre (*): </label> <br />
                            <input type="text" placeholder="Introduce el nombre" name="nameSub" onChange={handleChange} required />
                        </div>
                        <div className="createSubscription-free_trial">
                            <label htmlFor="free_trial"> Es una prueba gratuita: </label> <br />
                            <input type="checkbox" name="free_trial" onClick={changeFreeTrialEnd} />
                        </div>
                        <div className="createSubscription-free_trial_end">
                            <label htmlFor="free_trial_end"> Finalización prueba gratuita: </label> <br />
                            <input disabled={free_trial} type="date" name="free_trial_end" onChange={handleChange} />
                            {freeTrialEndError.length > 0 && (
                                <span className="errorMessage">{freeTrialEndError}</span>
                            )}
                        </div>
                        <div className="createSubscription-end">
                            <label htmlFor="end"> Tiene fecha de finalización: </label> <br />
                            <input type="checkbox" name="end" onClick={changeEndDate} />
                        </div>
                        <div className="createSubscription-end_date">
                            <label htmlFor="end_date"> Fecha finalización: </label> <br />
                            <input disabled={end} type="date" name="end_date" onChange={handleChange} />
                            {endDateError.length > 0 && (
                                <span className="errorMessage">{endDateError}</span>
                            )}
                        </div>
                    </div>
                    <p id="price_information"> Información sobre el precio</p>
                    <div className="createSubscription-price_information">
                        <div className="createSubscription-charge_date">
                            <label htmlFor="charge_date"> Fecha del pago: </label> <br />
                            <input type="date" name="charge_date" onChange={handleChange} />
                            {chargeDateError.length > 0 && (
                                <span className="errorMessage">{chargeDateError}</span>
                            )}
                        </div>
                        <div className="createSubscription-price">
                            <label htmlFor="price"> Precio (*): </label> <br />
                            <input type="number" placeholder="Introduce el precio" name="price" required onChange={handleChange} />
                            {priceError.length > 0 && (
                                <span className="errorMessage">{priceError}</span>
                            )}
                        </div>
                        <div className="createSubscription-frequency">
                            <label htmlFor="frequency"> Frecuencia (*): </label> <br />
                            <select name="frequency" required onChange={handleChange} >
                                <option value="monthly"> Mensual</option>
                                <option value="onetime">Una vez</option>
                                <option value="annual"> Anual</option>
                                <option value="bimonthly"> Bimensual</option>
                                <option value="quarterly"> Trimestral</option>
                                <option value="weekly">Semanal</option>
                            </select>
                        </div>
                        <div className="createSubscription-currency">
                            <label htmlFor="currency"> Divisa (*): </label> <br />
                            <select name="currency" required onChange={handleChange}>
                                <option value="EUR"> EURO (€)</option>
                                <option value="Dolars"> DOLAR ($)</option>
                            </select>
                        </div>
                    </div>
                    <p id="additional_information"> Información adicional </p>
                    <div className="createSubscription-additional_information">
                        <div className="createSubscription-url">
                            <label htmlFor="url"> URL para desuscribirse: </label> <br />
                            <input type="text" placeholder="Intorduce URL" name="url" onChange={handleChange} />
                            {urlError.length > 0 && (
                                <span className="errorMessage">{urlError}</span>
                            )}
                        </div>
                        <div className="createSubscription-start_date">
                            <label htmlFor="start_date"> Fecha de inicio: </label> <br />
                            <input type="date" name="start_date" onChange={handleChange} />
                        </div>
                        <div className="createSubscription-description">
                            <label htmlFor="description"> Descripción: </label> <br />
                            <textarea rows="2" cols="50" form="" name="description" onChange={handleChange} />
                        </div>
                        <div className="createSubscription-tags">
                            <label htmlFor="tags"> Tags (separados por una coma): </label> <br />
                            <input type="text" placeholder="Introduce algún tag" name="tags" onChange={handleChange} />
                        </div>
                        <div className="createSubscription-img_src">
                            <label htmlFor="img_src"> Selecciona una imagen: </label> <br />
                            <input id="select" type="file" name="img_src" onChange={changeImage} />
                            {imgSrcError.length > 0 && (
                                <span className="errorMessage">{imgSrcError}</span>
                            )}
                        </div>
                    </div>
                    <div className="createSubscription-info">
                        <p id="info"> (*) Campos obligatorios a completar</p>
                        {formError.length > 0 && (
                            <p id="info">{formError}</p>
                        )}
                    </div>
                    <div className="createSubscription">
                            {backendError.length > 0 && (
                                <span className="errorMessage">{backendError}</span>
                            )}
                        <button type="submit" onClick={handleSubmit}> Crear suscripción</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateSubscription;
