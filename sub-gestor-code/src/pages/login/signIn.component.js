import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import './signIn.css';
import POPUP from './popup'
import {useAuthDispatch} from '../../context/context';
import axios from "axios";
import GoogleLogin from 'react-google-login';


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
  const [buttonPopUp,setButtonPopup]=useState(false);

  //const [emailGoogle, setEmailGoogle]=useState('');

  
  

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
      axios.post(process.env.REACT_APP_SERVER_URL+'/user/login', {userEmail: email, userPassword: password})
        .then(response => { //El response devuelve un 2xx
          console.log(response.data)
          dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
          props.history.push('/home');
        })
        .catch(function (error){ //El response devuelve algo distinto a 2xx, por lo tanto hay error
          
          if (error.response === undefined || error.response.status === 500) {
            dispatch({ type: 'LOGIN_ERROR', error: "backend error" });
            props.history.push('/error');
          } else {
            dispatch({ type: 'LOGIN_ERROR', error: error.response.data.msg });
            setFormError(error.response.data.msg);
          }
          setEmail("")
          setPassword("")
          setPasswordError("");
          setEmailError("");
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
          setPassword(value)
          break;
      default:
        break;
    }
  };

  const responseGoogle = async (response) => {
    dispatch({ type: 'REQUEST_LOGIN' });
    axios.post(process.env.REACT_APP_SERVER_URL+'/user/google-sign-in', {google_id_token : response.getAuthResponse().id_token})
    .then(response => {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
        props.history.push('/home');
    })
    .catch(err => {
        dispatch({ type: 'LOGIN_ERROR', error: err.response.data.msg });
        setFormError(err.response.data.msg);
    })
  }
  
  return (
    
      <div className="signIn-wrapper">
          <div className="signIn-form-wrapper">
              <h1>Inicio de sesión</h1>
              <form noValidate>
                  <div className="signIn-email">
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
                          <span className="signIn-errorMessage">{emailError}</span>
                      )}
                  </div>
                  <div className="signIn-password">
                      <label htmlFor="password">Contraseña: </label>
                      {buttonPopUp}
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
                          <span className="signIn-errorMessage">{passwordError}</span>
                      )}
                  </div>
                  {formError.length > 0 && (
                      <span className="signIn-errorMessage">{formError}</span>
                    )}
                  <div className="signIn-createAccount">
                      <button type="submit" onClick={handleSubmit}>Inicia sesión</button>
                      <small>Todavía no tienes cuenta?</small> 
                      <Link to ="/signUp" className="nav-link">Regístrate</Link>
                      
                  </div>  
                  <GoogleLogin
                  className="signIn-ButtonGoogle"
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT}
                  buttonText="Sign In with Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                /> 
              </form>
              
              
              <div className="signIn-forget-pw">
                      <small className="signIn-pregunta">Has olvidado tu contraseña?</small> 
                      <button onClick={()=>setButtonPopup(true)}className="signIn-recuperar">Recuperar Contraseña</button>
                  </div>
                
                  <POPUP trigger={buttonPopUp} setTrigger={setButtonPopup} ></POPUP>
          </div>
      </div>
  );
}

export default SignIn;