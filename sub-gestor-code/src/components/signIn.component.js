import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './registro/register.css'

// Form cogido de este código
//  https://github.com/MyNameIsURL/react-form-validation-tutorial/blob/master/src/App.js

// Para comprobar el mail
const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

// Para comprobar la contraseña
const passwordRegex = RegExp(
  "^(((?=.*[a-z])(?=.*[A-Z])))(?=.{8,})"
);

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
            email: null,
            password: null,
            // pswrepeat: null, da error si no comentamos
            formErrors: {
                email: "",
                password: "",
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

  // Sirve para mostrar el error en rojo en el campo
  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "adreça email incorrecte";
        break;
      case "password":
        formErrors.password = passwordRegex.test(value)
         ? ""
         : "la contrasenya ha de contenir una majúscula i 8 o més caràcters"
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };


    render() {
        const { formErrors } = this.state;
        return (
            <div className="wrapper">
                <div className="form-wrapper">
                    <h1>Inici de sessió</h1>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <div className="email">
                            <label htmlFor="email">Email: </label>
                            <input 
                                type="email"
                                className={formErrors.email.length > 0 ? "error" : null}
                                placeholder="Entra el teu email"
                                name="email"
                                required
                                onChange={this.handleChange}
                            />
                            {formErrors.email.length > 0 && (
                                <span className="errorMessage">{formErrors.email}</span>
                            )}
                        </div>
                        <div className="password">
                            <label htmlFor="password">Contrasenya: </label>
                            <input
                                type="password"
                                className={formErrors.password.length > 0 ? "error" : null}
                                placeholder="Entra la teva contrasenya"
                                name="password"
                                required
                                onChange={this.handleChange}
                                pattern ="(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})"
                            />
                            {formErrors.password.length > 0 && (
                                <span className="errorMessage">{formErrors.password}</span>
                            )}
                        </div>
                        <div className="createAccount">
                            <button type="submit">Crea compte</button>
                            <small>Encara no tens un compte?</small> 
                            <Link to ="/signup" className="nav-link">Registra't</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}