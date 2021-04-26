import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './createSubscription.component.css'
const validateValue = require('validator');

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;

    // Valida que los errores esten vacios
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
        console.log(val.length)
    });

    if(rest.name == null) {
        valid = false
    } else if(rest.name.length === 0 || rest.price == null) {
        valid = false;
    }

    /*
    // Asegura que el form está lleno
    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });*/

    return valid;
};


export default class signIn extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            free_trial : true,
            free_trial_end : null,
            end : true,
            end_date : null,
            currency : null,
            frequency : null,
            price : null,
            charge_date : null,
            url : null,
            start_date : null,
            description : null,
            img_src : null,
            tags :  null,


            formErrors: {
                name: "",
                free_trial : "",
                free_trial_end : "",
                end : "",
                end_date : "",
                currency : "",
                frequency : "",
                price : "",
                charge_date : "",
                url : "",
                start_date : "",
                description : "",
                img_src : "",
                tags : "",
            }
        }
    }
    handleSubmit = e => {
        e.preventDefault();

        // Comprueba que el formulario es correcto, logea mail y contraseña por consola
        // o muestra error
        if (formValid(this.state)) {
            console.log("FORM VALID");
        } else {
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
        }
        console.log(this.state);
    };

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "free_trial_end":
                formErrors.free_trial_end = validateValue.isBefore(value) ? "Invalid date" : "";
                break;
            case "end_date":
                formErrors.end_date = validateValue.isBefore(value) ? "Invalid date" : "";
                break;
            case "charge_date":
                formErrors.charge_date = validateValue.isBefore(value) ? "Invalid date" : "";
                break;
            case "price":
                formErrors.price = ((validateValue.isInt(value) || validateValue.isDecimal(value)) && (value >= 0)) ? "" : "Invalid value, must be a positive number";
                break;
            case "url":
                formErrors.url = validateValue.isURL(value) ? "" : "Invalid value, must be a URL (Example: http://www.example.com)";
                break;
            default:
                // free_trial, end, frequency, currency, img_src, name, start_date, description, tags
                break;
        }
        this.setState({ formErrors, [name]: value }, () => console.log(this.state));
    };

    changeFreeTrialEnd = e => {
        // elimina el valor de free_trial_end si se desactiva la opcion (disabled == true)
        if(!this.state.free_trial) {
            this.setState(a => ({ free_trial_end : null }));
            console.log(this.state.free_trial_end);
        }
        this.setState( actualValue => ({ free_trial : !actualValue.free_trial }));

    };

    changeEndDate = e => {
        // elimina el valor de end_date si se desactiva la opcion (disabled == true)
        if(!this.state.end) {
            this.setState(a => ({ end_date : null }));
            console.log(this.state.end_date);
        }
        this.setState( actualValue => ({ end : !actualValue.end }));
    };

    render() {
        const { formErrors } = this.state;
        return (
            <div className="formSub">
                <h2 id="creator"> Crear nueva suscripción </h2>
                <form onSubmit={this.handleSubmit} noValidate>
                    <div className="formSub-grid">
                        <p id="information"> Información </p>
                        <div className="information">
                            <div className="name">
                                <label htmlFor="name"> Nombre (*): </label> <br />
                                <input type="text" placeholder="Introduce el nombre" name="name" onChange={this.handleChange} required/>
                            </div>
                            <div className="free_trial">
                                <label htmlFor="free_trial"> Es una prueba gratuita: </label> <br />
                                <input type="checkbox" name="free_trial" onClick={ this.changeFreeTrialEnd }/>
                            </div>
                            <div className="free_trial_end">
                                <label  htmlFor="free_trial_end"> Finalización prueba gratuita: </label> <br />
                                <input disabled= {this.state.free_trial} type="date"  name="free_trial_end" onChange={this.handleChange}/>
                                {formErrors.free_trial_end.length > 0 && (
                                    <span className="errorMessage">{formErrors.free_trial_end}</span>
                                )}
                            </div>
                            <div className="end">
                                <label  htmlFor="end"> Tiene fecha de finalización: </label> <br />
                                <input type="checkbox" name="end" onClick={ this.changeEndDate } />
                            </div>
                            <div className="end_date">
                                <label htmlFor="end_date"> Fecha finalización: </label> <br />
                                <input disabled= {this.state.end}  type="date" name="end_date" onChange={this.handleChange}/>
                                {formErrors.end_date.length > 0 && (
                                    <span className="errorMessage">{formErrors.end_date}</span>
                                )}
                            </div>
                        </div>
                        <p id="price_information"> Información sobre el precio</p>
                        <div className="price_information">
                            <div className="charge_date">
                                <label htmlFor="charge_date"> Fecha del pago: </label> <br />
                                <input type="date" name="charge_date" onChange={this.handleChange}/>
                                {formErrors.charge_date.length > 0 && (
                                    <span className="errorMessage">{formErrors.charge_date}</span>
                                )}
                            </div>
                            <div className="price">
                                <label htmlFor="price"> Precio (*): </label> <br />
                                <input type="number" placeholder="Introduce el precio" name="price" required onChange={this.handleChange}/>
                                {formErrors.price.length > 0 && (
                                    <span className="errorMessage">{formErrors.price}</span>
                                )}
                            </div>
                            <div className="frequency">
                                <label htmlFor="frequency"> Frcuencia: </label> <br />
                                <select name="frequency" onChange={this.handleChange} >
                                    <option value="none"> --- </option>
                                    <option value="annual"> Anual</option>
                                    <option value="monthly"> Mensual</option>
                                    <option value="bimonthly"> Bimensual</option>
                                    <option value="quarterly"> Trimestral</option>
                                    <option value="weekly">Semanal</option>
                                </select>
                            </div>
                            <div className="currency">
                                <label htmlFor="currency"> Divisa: </label> <br />
                                <select name="currency" onChange={this.handleChange}>
                                    <option value="none"> --- </option>
                                    <option value="EUR"> EURO (€)</option>
                                    <option value="Dolars"> DOLAR ($)</option>
                                </select>
                            </div>
                        </div>
                        <p id="additional_information"> Información adicional </p>
                        <div className="additional_information">
                            <div className="url">
                                <label  htmlFor="url"> URL para desuscribirse: </label> <br />
                                <input type="text" placeholder="Intorduce URL" name="url" onChange={this.handleChange}/>
                                {formErrors.url.length > 0 && (
                                    <span className="errorMessage">{formErrors.url}</span>
                                )}
                            </div>
                            <div className="start_date">
                                <label htmlFor="start_date"> Fecha de inicio: </label> <br />
                                <input type="date" name="start_date" onChange={this.handleChange}/>
                            </div>
                            <div className="description">
                                <label htmlFor="description"> Descripción: </label> <br />
                                <textarea rows="2" cols="50" form="" onChange={this.handleChange} />
                            </div>
                            <div className="tags">
                                <label htmlFor="tags"> Tags (separados por una coma): </label> <br />
                                <input type="text" placeholder="Introduce algún tag" name="tags" onChange={this.handleChange}/>
                            </div>
                            <div className="img_src">
                                <label htmlFor="img_src"> Selecciona una imagen: </label> <br />
                                <input type="file" name="img_src" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="info">
                            <p id="info"> (*) Campos obligatorios a completar</p>
                        </div>
                        <div className="createSubscription">
                            <button type="submit"> Crear suscripción</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}