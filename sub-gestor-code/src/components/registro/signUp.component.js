import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './register.css'

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


export default class signUp extends Component{
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
                    <h1>Registro</h1>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <div className="email">
                            <label htmlFor="email">Email: </label>
                            <input 
                                type="email"
                                className={formErrors.email.length > 0 ? "error" : null}
                                placeholder="Introduce tu email"
                                name="email"
                                required
                                onChange={this.handleChange}
                            />
                            {formErrors.email.length > 0 && (
                                <span className="errorMessage">{formErrors.email}</span>
                            )}
                        </div>
                        <div className="password">
                            <label htmlFor="password">Contraseña: </label>
                            <input
                                type="password"
                                className={formErrors.password.length > 0 ? "error" : null}
                                placeholder="Introduce tu contraseña"
                                name="password"
                                required
                                onChange={this.handleChange}
                                pattern ="(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})"
                            />
                            {formErrors.password.length > 0 && (
                                <span className="errorMessage">{formErrors.password}</span>
                            )}
                        </div>
                        <div className="pswrepeat">
                            <label htmlFor="pswrepeat">Repite la contraseña: </label>
                            <input 
                                type="password"
                                className=""
                                placeholder="Repite la contraseña"
                                required
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="createAccount">
                            <button type="submit">Crear cuenta</button>
                            <small>Ya tienes una cuenta?</small> 
                            <Link to ="/signin" className="nav-link">Inicia sesión</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}