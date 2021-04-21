import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import './register.css';
import {useAuthDispatch} from '../../context/context';
import axios from "axios";
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

const SignUp = () => { 
  // Define el estado del componente
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [repPassword, setRepPassword] = useState(''); 
  const [emailError, setEmailError] = useState(''); 
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const dispatch = useAuthDispatch()

  const formValid = () => {
    // Valida que los errores esten vacios
    if (emailError.length > 0 || passwordError > 0) return false
    if (email.length === 0 || password.length === 0 || repPassword.length === 0) return false
    return true
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Comprueba que el formulario es correcto, logea mail y contraseña por consola
    // o muestra error
    if (formValid()) {
      dispatch({ type: 'REQUEST_LOGIN' });
      axios.post('http://localhost:4000/user/create', {email, password, conf_pwd: repPassword})
          .then(response => {
              if(response.status !== 200) {
                
              } else {
                dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
                localStorage.setItem('currentUser', JSON.stringify(response.data))
              }
          })
          .catch(function (error){
            dispatch({ type: 'LOGIN_ERROR', error: error.response.data.msg });
            //TODO: vaciar el formulario
            setFormError(error.response.data.msg);
            setEmail("")
            setPassword("")
            setRepPassword("")

          })
    } else {
      setFormError("Invalid form")
    }

  };

  // Sirve para mostrar el error en rojo en el campo
  const handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    
    switch (name) {
      case "email":
        if(emailRegex.test(value)) {
          setEmailError("");
        } else {
          setEmailError("adreça email incorrecte");
        }
        setEmail(value);
        break;
      case "password":
        if(passwordRegex.test(value)) {
          setPasswordError("");
        } else {
          setPasswordError("la contrasenya ha de contenir una majúscula i 8 o més caràcters");
        }
        setPassword(value)
        break;
        case "pswrepeat":
          setRepPassword(value)
          break;
      default:
        break;
    }
  };

  return (
      <div className="wrapper">
          <div className="form-wrapper">
              <h1>Registre</h1>
              <form  noValidate>
                  <div className="email">
                      <label htmlFor="email">Email: </label>
                      <input 
                          value={email}
                          type="email"
                          className={emailError.length > 0 ? "error" : null}
                          placeholder="Entra el teu email"
                          name="email"
                          required
                          onChange={handleChange}
                      />
                    {emailError.length > 0 && (
                      <span className="errorMessage">{emailError}</span>
                    )}  
                  </div>
                  <div className="password">
                      <label htmlFor="password">Contrasenya: </label>
                      <input
                          value={password}
                          type="password"
                          //className={formErrors.password.length > 0 ? "error" : null}
                          placeholder="Entra la teva contrasenya"
                          name="password"
                          required
                          onChange={handleChange}
                          pattern ="(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})"
                      />
                      {passwordError.length > 0 && (
                      <span className="errorMessage">{passwordError}</span>
                    )}
                  </div>
                  <div className="pswrepeat">
                      <label htmlFor="pswrepeat">Repeteix la contrasenya: </label>
                      <input 
                          value={repPassword}
                          type="password"
                          className=""
                          name="pswrepeat"
                          placeholder="Repeteix la contrasenya"
                          required
                          onChange={handleChange}
                          pattern ="(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})"
                      />
                  </div>
                  {formError.length > 0 && (
                      <span className="errorMessage">{formError}</span>
                    )}
                  <div className="createAccount">
                      <button onClick={handleSubmit} type="submit">Crea compte</button>
                      <small>Ja tens un compte?</small> 
                      <Link to ="/signin" className="nav-link">Inicia sessió</Link>
                  </div>
              </form>
          </div>
      </div>
  );
    
}

export default SignUp;