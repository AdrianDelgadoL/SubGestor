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

    // Asegura que el form está lleno
    Object.values(rest).forEach(val => {
        val === null && (valid = false);
    });

    return valid;
};

export default class signIn extends Component{
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            free_trial : null,
            free_trial_end : null,
            end : null,
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
            console.log(`
        --SUBMITTING--
        Email: ${this.state.email}
        Password: ${this.state.password}
      `);
        } else {
            console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
        }
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

    render() {
        const { formErrors } = this.state;
        return (
            <div className="formSub">
                <h1 id="creator"> Create new subscription </h1>
                <form onSubmit={this.handleSubmit} noValidate>
                    <div className="formSub-grid">
                        <p id="information"> Information </p>
                        <div className="information">
                            <div className="name">
                                <label htmlFor="name"> Name (*): </label> <br />
                                <input type="text" placeholder="Enter name ..." name="name" required onChange={this.handleChange}/>
                                {formErrors.name.length > 0 && (
                                    <span className="errorMessage">{formErrors.name}</span>
                                )}
                            </div>
                            <div className="free_trial">
                                <label htmlFor="free_trial"> Is a Free Trial: </label> <br />
                                <input type="checkbox" name="free_trial" onChange={this.handleChange}/>
                                {formErrors.free_trial.length > 0 && (
                                    <span className="errorMessage">{formErrors.free_trial}</span>
                                )}
                            </div>
                            <div className="free_trial_end">
                                <label  htmlFor="free_trial_end"> End of Free Trial: </label> <br />
                                <input type="date"  name="free_trial_end" onChange={this.handleChange}/>
                                {formErrors.free_trial_end.length > 0 && (
                                    <span className="errorMessage">{formErrors.free_trial_end}</span>
                                )}
                            </div>
                            <div className="end">
                                <label  htmlFor="end"> Has an end date: </label> <br />
                                <input type="checkbox" name="end" onChange={this.handleChange}/>
                                {formErrors.end.length > 0 && (
                                    <span className="errorMessage">{formErrors.end}</span>
                                )}
                            </div>
                            <div className="end_date">
                                <label htmlFor="end_date"> End date: </label> <br />
                                <input type="date" name="end_date" onChange={this.handleChange}/>
                                {formErrors.end_date.length > 0 && (
                                    <span className="errorMessage">{formErrors.end_date}</span>
                                )}
                            </div>
                        </div>
                        <p id="price_information"> Price information </p>
                        <div className="price_information">
                            <div className="charge_date">
                                <label htmlFor="charge_date"> Date of next payment: </label> <br />
                                <input type="date" name="charge_date" onChange={this.handleChange}/>
                                {formErrors.charge_date.length > 0 && (
                                    <span className="errorMessage">{formErrors.charge_date}</span>
                                )}
                            </div>
                            <div className="price">
                                <label htmlFor="price"> Price (*): </label> <br />
                                <input type="number" placeholder="Enter price..." name="price" required onChange={this.handleChange}/>
                                {formErrors.price.length > 0 && (
                                    <span className="errorMessage">{formErrors.price}</span>
                                )}
                            </div>
                            <div className="frequency">
                                <label htmlFor="frequency"> Frequency: </label> <br />
                                <select name="frequency" onChange={this.handleChange}>
                                    <option value="none"> --- </option>
                                    <option value="annual"> Annual</option>
                                    <option value="monthly"> Monthly</option>
                                    <option value="bimonthly"> Bimonthly</option>
                                    <option value="quarterly"> Quarterly</option>
                                    <option value="weekly"> Weekly</option>
                                </select>
                                {formErrors.frequency.length > 0 && (
                                    <span className="errorMessage">{formErrors.frequency}</span>
                                )}
                            </div>
                            <div className="currency">
                                <label htmlFor="currency"> Currency: </label> <br />
                                <select name="currency" onChange={this.handleChange}>
                                    <option value="none"> --- </option>
                                    <option value="EUR"> EURO (€)</option>
                                    <option value="Dolars"> DOLAR ($)</option>
                                </select>
                                {formErrors.currency.length > 0 && (
                                    <span className="errorMessage">{formErrors.currency}</span>
                                )}
                            </div>
                        </div>
                        <p id="additional_information"> Additional information </p>
                        <div className="additional_information">
                            <div className="url">
                                <label  htmlFor="url"> URL to unsubscribe: </label> <br />
                                <input type="text" placeholder="Enter URL ..." name="url" onChange={this.handleChange}/>
                                {formErrors.url.length > 0 && (
                                    <span className="errorMessage">{formErrors.url}</span>
                                )}
                            </div>
                            <div className="start_date">
                                <label htmlFor="start_date"> Start date: </label> <br />
                                <input type="date" name="start_date" onChange={this.handleChange}/>
                                {formErrors.start_date.length > 0 && (
                                    <span className="errorMessage">{formErrors.start_date}</span>
                                )}
                            </div>
                            <div className="description">
                                <label htmlFor="description"> Description: </label> <br />
                                <textarea rows="2" cols="50" form="" />
                                {formErrors.description.length > 0 && (
                                    <span className="errorMessage">{formErrors.description}</span>
                                )}
                            </div>
                            <div className="tags">
                                <label htmlFor="tags"> Tags (separated by coma): </label> <br />
                                <input type="text" placeholder="Enter some tags ..." name="tags" onChange={this.handleChange}/>
                                {formErrors.tags.length > 0 && (
                                    <span className="errorMessage">{formErrors.tags}</span>
                                )}
                            </div>
                            <div className="img_src">
                                <label htmlFor="img_src"> Choose an image: </label> <br />
                                <input type="file" name="img_src" onChange={this.handleChange}/>
                                {formErrors.img_src.length > 0 && (
                                    <span className="errorMessage">{formErrors.img_src}</span>
                                )}
                            </div>
                        </div>
                        <div className="info">
                            <p id="info"> (*) Obligatory fields to complete </p>
                        </div>
                        <div className="createSubscription">
                            <button type="submit"> Create subscription</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}