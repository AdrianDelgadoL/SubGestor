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

const SignUp = (props) => { 
  // Define el estado del componente
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [repPassword, setRepPassword] = useState(''); 
  const [emailError, setEmailError] = useState(''); 
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [repPasswordError, setRepPasswordError] = useState('');

  //Cargamos el dispatch para poder usarlo después para avisar al reducer. Esto nos permite guardar el token y el usuario
  //en el contexto creado en el fichero context. Para usarlo solo tenemos que llamar a dispatch() y pasarle un objeto JSON
  //donde se indique el tipo de dispatch, es decir, la accion que esta ocurriendo y un payload si es necesario (de momento solo
  //en el caso que la acción sea del tipo LOGIN_SUCCES). Este payload nos permite que el reducer obtenga la información necesaria.
  //De momento solo guardamos el token y el email.
  const dispatch = useAuthDispatch()

  const formValid = () => {
    // Valida que los errores esten vacios
    if (emailError.length > 0 || passwordError.length > 0 || repPasswordError.length > 0) return false
    if (email.length === 0 || password.length === 0 || repPassword.length === 0) return false
    return true
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Comprueba que el formulario es correcto, logea mail y contraseña por consola
    // o muestra error
    if (formValid()) {
      dispatch({ type: 'REQUEST_LOGIN' });
      axios.post(process.env.REACT_APP_SERVER_URL+'/user/create', {email, password, conf_pwd: repPassword})
          .then(response => { //El response devuelve un 2xx
            console.log(response.data)
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
            props.history.push('/home');
          })
          .catch(function (error){ //El response devuelve algo distinto a 2xx, por lo tanto hay error
            dispatch({ type: 'LOGIN_ERROR', error: error.response.data.msg });
            // Añadimos el error devuelto por back-end a nuestro formError para que se muestre en el formulario
            setFormError(error.response.data.msg);
            // Vaciamos el formulario
            setEmail("")
            setPassword("")
            setRepPassword("")
            setEmailError("");
            setPasswordError("");
          })
    } else {
      setFormError("El formulario contiene errores")
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
          setEmailError("Dirección de email incorrecta");
        }
        setEmail(value);
        break;
      case "password":
        if(passwordRegex.test(value)) {
          setPasswordError("");
        } else {
          setPasswordError("La contraseña tiene que contener una mayúscula y 8 o más carácteres");
        }
        if(value !== repPassword) {
          setRepPasswordError("Las contraseñas no coinciden");
        } else {
          setRepPasswordError("");
        }
        setPassword(value)
        break;
      case "pswrepeat":
        if(value !== password) {
          setRepPasswordError("Las contraseñas no coinciden");
        } else {
          setRepPasswordError("");
        }
        setRepPassword(value)
        break;
      default:
        break;
    }
  };

  return (
      <div className="signUp-wrapper">
          <div className="signUp-form-wrapper">
              <h1>Registro</h1>
              <form  noValidate>
                  <div className="signUp-email">
                      <label htmlFor="email">Email: </label>
                      <input 
                          value={email}
                          type="email"
                          className={emailError.length > 0 ? "error" : null}
                          placeholder="Introduce tu email"
                          name="email"
                          required
                          onChange={handleChange}
                      />
                    {emailError.length > 0 && (
                      <span className="signUp-errorMessage">{emailError}</span>
                    )}  
                  </div>
                  <div className="signUp-password">
                      <label htmlFor="password">Contraseña: </label>
                      <input
                          value={password}
                          type="password"
                          //className={formErrors.password.length > 0 ? "error" : null}
                          placeholder="Introduce tu contraseña"
                          name="password"
                          required
                          onChange={handleChange}
                          pattern ="(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})"
                      />
                      {passwordError.length > 0 && (
                      <span className="signUp-errorMessage">{passwordError}</span>
                    )}
                  </div>
                  <div className="signUp-pswrepeat">
                      <label htmlFor="pswrepeat">Repite la contraseña: </label>
                      <input 
                          value={repPassword}
                          type="password"
                          className=""
                          name="pswrepeat"
                          placeholder="Repite la contraseña"
                          required
                          onChange={handleChange}
                          pattern ="(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})"
                      />
                      {repPasswordError.length > 0 && (
                      <span className="signUp-errorMessage">{repPasswordError}</span>
                    )}
                  </div>
                  {formError.length > 0 && (
                      <span className="signUp-errorMessage">{formError}</span>
                    )}
                  <div className="signUp-createAccount">
                      <button onClick={handleSubmit} type="submit">Crear cuenta</button>
                      <small>Ya tienes una cuenta?</small> 
                      <Link to ="/signIn" className="nav-link">Inicia sesión</Link>
                  </div>
              </form>
          </div>
      </div>
  );
    
}

export default SignUp;