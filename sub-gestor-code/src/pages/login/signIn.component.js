import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import '../registro/register.css';
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

const SignIn = (props) => { 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [emailError, setEmailError] = useState(''); 
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const dispatch = useAuthDispatch()

  const formValid = () => {
    if (emailError.length > 0 || passwordError.length > 0) return false
    if (email.length === 0 || password.length === 0) return false
    return true
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprueba que el formulario es correcto, logea mail y contraseña por consola
    // o muestra error
    if (formValid()) {
      dispatch({ type: 'REQUEST_LOGIN' });
      axios.post('http://localhost:4000/user/login', {userEmail: email, userPassword: password})
        .then(response => { //El response devuelve un 2xx
          console.log(response.data)
          dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
          props.history.push('/subDetail');
        })
        .catch(function (error){ //El response devuelve algo distinto a 2xx, por lo tanto hay error
          console.log(error);
          dispatch({ type: 'LOGIN_ERROR', error: error.response.data.msg });
          // Añadimos el error devuelto por back-end a nuestro formError para que se muestre en el formulario
          setFormError(error.response.data.msg);
          // Vaciamos el formulario
          setEmail("")
          setPassword("")
          setPasswordError("");
          setEmailError("");
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
      default:
        break;
    }
  };


  return (
      <div className="wrapper">
          <div className="form-wrapper">
              <h1>Inicio de sesión</h1>
              <form noValidate>
                  <div className="email">
                      <label htmlFor="email">Email: </label>
                      <input 
                          type="email"
                          className={emailError.length > 0 ? "error" : null}
                          placeholder="Introduce tu email"
                          name="email"
                          required
                          onChange={handleChange}
                          value={email}
                      />
                      {emailError.length > 0 && (
                          <span className="errorMessage">{emailError}</span>
                      )}
                  </div>
                  <div className="password">
                      <label htmlFor="password">Contraseña: </label>
                      <input
                          type="password"
                          className={passwordError.length > 0 ? "error" : null}
                          placeholder="Introduce tu contraseña"
                          name="password"
                          required
                          onChange={handleChange}
                          value={password}
                          pattern ="(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})"
                      />
                      {passwordError.length > 0 && (
                          <span className="errorMessage">{passwordError}</span>
                      )}
                  </div>
                  {formError.length > 0 && (
                      <span className="errorMessage">{formError}</span>
                    )}
                  <div className="createAccount">
                      <button type="submit" onClick={handleSubmit}>Inicia sesión</button>
                      <small>Todavía no tienes cuenta?</small> 
                      <Link to ="/signUp" className="nav-link">Regístrate</Link>
                  </div>
              </form>
          </div>
      </div>
  );
}

export default SignIn;