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
    const [mensaje,setMensaje]=useState('');
    const [ backendError, setBackendError ] = useState('');
    const userDetails = useAuthState()
    const dispatch = useAuthDispatch()
    const userToken = userDetails.token
    


    const formPassValid = () => {
        if (passwordError.length > 0 || password.length === 0)  {
            return false;
        } else {
            return true;
        }
    };
    const handleSubmit=(event)=>{
      event.preventDefault();
      if (formPassValid()) {
       
        axios.put('http://localhost:4000/change-pass',{headers:{"x-auth-token":userToken}},
        {
          old_password:password.password_vieja,
          new_password:password.password_1,
          new_password_repeat:password.pswrepeat
        })
            .then(response => { 
              console.log(response.data)
              
              setMensaje("Contraseña cambiada correctamente");
              setFormError("")
              props.history.push('/home');
            })
            .catch(function (error){
            if (error.response.status === 401) { // Sin autorización envialos al login
                 dispatch({ type: 'AUTH_ERROR', error: error.response.data })
                 props.history.push('/signIn');
                 return;
            }
              setBackendError(error.response.data.msg)
              setFormError("");
              setPasswordError("");
            })
      } else {
        setFormError("El formulario contiene errores")
        setMensaje('');
        setPassword('');
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
                setPasswordError("la contraseña tiene que contener una mayúscula y 8 o más carácteres");
                setMensaje("");
                }
                auxiliar.password_vieja  = value;
        break;

          case "password":
            
            if(passwordRegex.test(value)) {
              setPasswordError("");
            } else {
              setPasswordError("la contraseña tiene que contener una mayúscula y 8 o más carácteres");
              setMensaje("");
            }
            auxiliar.password_1 = value;
            break;
          case "pswrepeat":
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
           {mensaje.length > 0 && (<p className="popup-exitoso">{mensaje}</p>)}     
          </div>
      </div>
)

}
export default ChangePw