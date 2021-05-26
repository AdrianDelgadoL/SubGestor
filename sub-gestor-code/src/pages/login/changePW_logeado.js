import React,{useState} from 'react'
import axios from 'axios'
import './changePW_form.css'
import { useAuthState, useAuthDispatch } from '../../context/context'


const passwordRegex = RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z])))(?=.{8,})"
  );
  
const ChangePw=(props)=>{

    const [password,setPassword]=useState({
      password_vieja:'',
      password_1:'',
      pswrepeat:''
    });
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const [ backendError, setBackendError ] = useState('');
    const userDetails = useAuthState()
    const dispatch = useAuthDispatch()
    const userToken = userDetails.token
    


    const formPassValid = () => {
        if (passwordError.length > 0 || password.password_vieja.length === 0 
          || password.password_1.length === 0 || password.pswrepeat.length === 0)   {
            return false;
        } else {
            return true;
        }
    };
    const handleSubmit=(event)=>{
      event.preventDefault();
      if(password.password_1==password.pswrepeat){
        setFormError("");
        if (formPassValid()) {
       
          axios.put(process.env.REACT_APP_SERVER_URL+'/change-pass',
          {
            old_password:password.password_vieja,
            new_password:password.password_1,
            new_password_repeat:password.pswrepeat
          },
          {
            headers:{"x-auth-token":userToken}
          })
          .then(response => { 
                console.log(response.data)
                props.history.push('/home');
          })
          .catch(function (error){
            if (error.response === undefined || error.response.status === 500) {
              dispatch({ type: 'BACKEND_ERROR', error: "backend error" });
              props.history.push('/error');
            } else if (error.response.status === 401) { // Sin autorización envialos al login
                  dispatch({ type: 'AUTH_ERROR', error: error.response.data })
                  props.history.push('/signIn');
            } else {
              setBackendError(error.response.data.msg)
            }
          })
        } else {
          setFormError("El formulario contiene errores")
        }  
      }
      console.log(window.location.pathname)
  }

    const handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        var auxiliar = {...password}

        switch (name) {
        case "password_vieja":     
        if(passwordRegex.test(value)) {
                setPasswordError("");
                } else {
                setPasswordError("las contraseñas tienen que contener una mayúscula y 8 o más carácteres");
                }
        auxiliar.password_vieja  = value;
        break;

          case "password":
            if(passwordRegex.test(value)) {
                  setPasswordError("");
                } else {
                  setPasswordError("las contraseñas tienen que contener una mayúscula y 8 o más carácteres");
                }
            if(value!==password.pswrepeat){
              setPasswordError("Las contraseñas no coinciden");
            }
            auxiliar.password_1 = value;
            break;
          case "pswrepeat":
            if(passwordRegex.test(value)) {
                  setPasswordError("");
                } else {
                  setPasswordError("las contraseñas tienen que contener una mayúscula y 8 o más carácteres");
                }
            if(value!==password.password_1){
              setPasswordError("Las contraseñas no coinciden");
            }
            auxiliar.pswrepeat = value;
            break;
          default:
            break;
        }
        setPassword(auxiliar);
      };



return(
  <div className="changePW-wrapper">
          <div className="changePW-form-wrapper">
              <h1>Reestablecer la contraseña</h1>
              <form noValidate>
              <div className="changePW-email">
                      <label htmlFor="password">Contraseña actual: </label>
                      <input 
                          type="password"
                          placeholder="Contraseña actual"
                          name="password_vieja"
                          required
                          value={password.password_vieja}
                          pattern ="(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})"
                          onChange={handleChange}
                      />
                  </div>
                  <div className="changePW-email">
                      <label htmlFor="password">Contraseña nueva: </label>
                      <input 
                          type="password"
                          placeholder="Nueva contraseña"
                          name="password"
                          required
                          value={password.password_1}
                          pattern ="(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})"
                          onChange={handleChange}
                      />
                  </div>
                  <div className="changePW-password">
                      <label htmlFor="password">Repite la contraseña: </label>
                      <input 
                          type="password"
                          placeholder="Repite la contraseña"
                          name="pswrepeat"
                          required
                          value={password.pswrepeat}
                          pattern ="(?=.*\d)(?=.*[a-z])(?=.*[A-Z].{6,})"
                          onChange={handleChange}
                      />
                  </div>
                 
                    <div className="changePW-createAccount">
                      <button onClick={handleSubmit}type="submit" >Aceptar</button> 
                  </div> 
                  
                  {passwordError.length > 0 && (<span className="popup-errorMessage">{passwordError}</span>)}
                    {formError.length > 0 && (
                        <span className="popup-errorMessage">{formError}</span>
                    )}
                    {backendError.length > 0 && (<span className="popup-errorMessage">{backendError}</span>)}
           </form>   
          </div>
      </div>
)

}
export default ChangePw