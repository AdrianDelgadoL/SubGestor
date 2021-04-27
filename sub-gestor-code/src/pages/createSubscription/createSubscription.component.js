import React, {Component, useState} from 'react';
import './createSubscription.component.css'
const validateValue = require('validator');


const CreateSubscription = (props) => {
    const [name, setName] = useState(null);
    const [free_trial, setFreeTrial] = useState(true);
    const [free_trial_end, setFreeTrialEnd] = useState(null);
    const [end, setEnd] = useState(true);
    const [end_date, setEndDate] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [frequency, setFrequency] = useState(null);
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

    const changeFreeTrialEnd = async (e) => {
        // elimina el valor de free_trial_end si se desactiva la opcion (disabled == true)
        if(!free_trial) {
            setFreeTrialEnd(null);
            setFreeTrialEndError('');
            console.log(free_trial_end);
        }
        setFreeTrial(!free_trial);
    };

    const changeEndDate = async (e) => {
        // elimina el valor de end_date si se desactiva la opcion (disabled == true)
        if(!end) {
            setEndDate(null);
            setEndDateError('');
            console.log(end_date);
        }
        setEnd(!end);
    };

    const formValid = () => {
        // Valida que los errores esten vacios
        let valid = true;
        let errorValues = [freeTrialEndError, endDateError, priceError, chargeDateError, urlError, formError];
        errorValues.forEach(value => {
            if(value.length > 0) {
                valid = false;
            }
        })
        // Valida que els camps obligatoris estan plens
        if(name == null) {
            valid = false;
        } else if(name === 0 || price == null) {
            valid = false;
        }
        return valid;
    };

    // TODO: QUEDA EL HANDLESUBMIT -- backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formValid()) {
            console.log("FORM VALID");
        } else {
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
        }
    };

    const handleChange = async (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        switch (name) {
            case "free_trial_end":
                validateValue.isBefore(value) ? setFreeTrialEndError("Invalid date") : setFreeTrialEndError("");
                setFreeTrialEnd(value);
                break;
            case "end_date":
                validateValue.isBefore(value) ? setEndDateError("Invalid date") : setEndDateError("");
                setEndDate(value);
                break;
            case "charge_date":
                validateValue.isBefore(value) ? setChargeDateError("Invalid date") : setChargeDateError("");
                setChargeDate(value);
                break;
            case "price":
                ((validateValue.isInt(value) || validateValue.isDecimal(value)) && (value >= 0)) ? setPriceError("") : setPriceError("Invalid value, must be a positive number");
                setPrice(value);
                break;
            case "url":
                if(value.length > 0) {
                    validateValue.isURL(value) ? setUrlError("") : setUrlError("Invalid value, must be a URL (Example: http://www.example.com)");
                    setUrl(value);
                } else {
                    setUrlError('');
                    setUrl(null);
                }
                break;
            case "name":
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
    };

    return (
        <div className="formSub">
            <h2 id="creator"> Crear nueva suscripción </h2>
            <form enctype="multipart/form-data" noValidate>
                <div className="formSub-grid">
                    <p id="information"> Información </p>
                    <div className="information">
                        <div className="name">
                            <label htmlFor="name"> Nombre (*): </label> <br />
                            <input type="text" placeholder="Introduce el nombre" name="name" onChange={handleChange} required/>
                        </div>
                        <div className="free_trial">
                            <label htmlFor="free_trial"> Es una prueba gratuita: </label> <br />
                            <input type="checkbox" name="free_trial" onClick={ changeFreeTrialEnd }/>
                        </div>
                        <div className="free_trial_end">
                            <label  htmlFor="free_trial_end"> Finalización prueba gratuita: </label> <br />
                            <input disabled= {free_trial} type="date"  name="free_trial_end" onChange={handleChange}/>
                            {freeTrialEndError.length > 0 && (
                                <span className="errorMessage">{freeTrialEndError}</span>
                            )}
                        </div>
                        <div className="end">
                            <label  htmlFor="end"> Tiene fecha de finalización: </label> <br />
                            <input type="checkbox" name="end" onClick={ changeEndDate } />
                        </div>
                        <div className="end_date">
                            <label htmlFor="end_date"> Fecha finalización: </label> <br />
                            <input disabled= {end}  type="date" name="end_date" onChange={handleChange}/>
                            {endDateError.length > 0 && (
                                <span className="errorMessage">{endDateError}</span>
                            )}
                        </div>
                    </div>
                    <p id="price_information"> Información sobre el precio</p>
                    <div className="price_information">
                        <div className="charge_date">
                            <label htmlFor="charge_date"> Fecha del pago: </label> <br />
                            <input type="date" name="charge_date" onChange={handleChange}/>
                            {chargeDateError.length > 0 && (
                                <span className="errorMessage">{chargeDateError}</span>
                            )}
                        </div>
                        <div className="price">
                            <label htmlFor="price"> Precio (*): </label> <br />
                            <input type="number" placeholder="Introduce el precio" name="price" required onChange={handleChange}/>
                            {priceError > 0 && (
                                <span className="errorMessage">{priceError}</span>
                            )}
                        </div>
                        <div className="frequency">
                            <label htmlFor="frequency"> Frecuencia: </label> <br />
                            <select name="frequency" onChange={handleChange} >
                                <option value="null"> --- </option>
                                <option value="annual"> Anual</option>
                                <option value="monthly"> Mensual</option>
                                <option value="bimonthly"> Bimensual</option>
                                <option value="quarterly"> Trimestral</option>
                                <option value="weekly">Semanal</option>
                            </select>
                        </div>
                        <div className="currency">
                            <label htmlFor="currency"> Divisa: </label> <br />
                            <select name="currency" onChange={handleChange}>
                                <option value="null"> --- </option>
                                <option value="EUR"> EURO (€)</option>
                                <option value="Dolars"> DOLAR ($)</option>
                            </select>
                        </div>
                    </div>
                    <p id="additional_information"> Información adicional </p>
                    <div className="additional_information">
                        <div className="url">
                            <label  htmlFor="url"> URL para desuscribirse: </label> <br />
                            <input type="text" placeholder="Intorduce URL" name="url" onChange={handleChange}/>
                            {urlError.length > 0 && (
                                <span className="errorMessage">{urlError}</span>
                            )}
                        </div>
                        <div className="start_date">
                            <label htmlFor="start_date"> Fecha de inicio: </label> <br />
                            <input type="date" name="start_date" onChange={handleChange}/>
                        </div>
                        <div className="description">
                            <label htmlFor="description"> Descripción: </label> <br />
                            <textarea rows="2" cols="50" form="" onChange={handleChange} />
                        </div>
                        <div className="tags">
                            <label htmlFor="tags"> Tags (separados por una coma): </label> <br />
                            <input type="text" placeholder="Introduce algún tag" name="tags" onChange={handleChange}/>
                        </div>
                        <div className="img_src">
                            <label htmlFor="img_src"> Selecciona una imagen: </label> <br />
                            <input id="select" type="file" name="img_src" onChange={handleChange}/>
                        </div>
                    </div>
                    <div className="info">
                        <p id="info"> (*) Campos obligatorios a completar</p>
                    </div>
                    <div className="createSubscription">
                        <button type="submit" onClick={handleSubmit}> Crear suscripción</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CreateSubscription;
