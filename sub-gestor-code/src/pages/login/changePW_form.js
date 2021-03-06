import React,{useState} from 'react'
import axios from 'axios'
import './changePW_form.css'
import {useAuthDispatch } from '../../context/context';

const passwordRegex = RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z])))(?=.{8,})"
  );
  
const ChangePw=(props)=>{

    const [password,setPassword]=useState({
      password_1:'',
      pswrepeat:''
    });
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const [mensaje,setMensaje]=useState('');
    const [ backendError, setBackendError ] = useState('');
    const dispatch = useAuthDispatch();
    


    const formPassValid = () => {
        if (passwordError.length > 0 || password.length === 0 ||
           password.password_1.length===0 || password.pswrepeat.length===0)  {
            return false;
        } else {
            return true;
        }
    };
    const handleSubmit=(event)=>{
      event.preventDefault();
      if(password.password_1==password.pswrepeat){
        if (formPassValid()) {
       
          axios.post(process.env.REACT_APP_SERVER_URL+window.location.pathname,
          {
            new_password:password.password_1,
            new_password_repeat:password.pswrepeat
          })
          .then(response => { 
            console.log(response.data)
            setMensaje("Contraseña cambiada correctamente");
            setFormError("")
            props.history.push('/');
          })
          .catch(function (error){
            if (error.response === undefined || error.response.status === 500) {
              dispatch({ type: 'BACKEND_ERROR', error: "backend error" });
              props.history.push('/error');
            } else {
              setBackendError(error.response.data.msg)
              setFormError("");
              setPasswordError("");
            } 
          })
        } else {
          setFormError("El formulario contiene errores")
          setMensaje('');
          setPassword('');
        }

      }else{
        setFormError("LAS CONTRASEÑAS NO COINCIDEN");
        
      }

      console.log(window.location.pathname)
  }

    const handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        var auxiliar = {...password}

        switch (name) {
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
                      <label htmlFor="password">Repite la contraseña </label>
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