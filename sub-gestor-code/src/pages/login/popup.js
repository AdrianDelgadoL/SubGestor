import React,{useState} from 'react'
import './popup.css'
const Popup = (props) =>{

    const emailRegex = RegExp(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      );
    const [email,setEmail]=useState('');
    const  [emailError,setEmailError]=useState('');
    const [formError, setFormError] = useState('');
    const [mensaje,setMensaje]=useState('');
  

    const formValid = () => {
        if (emailError.length > 0 || email.length === 0){
            return false;
        }else{
            return true;
        }
      };   
      

    const handleChange=(event)=>{
        const {name,value}=event.target;
        setEmail(prevEmail=>({
            ...prevEmail,
            [name]:value

            
        }))
        switch (name) {
            case "email":
              if(emailRegex.test(value)) {
                console.log("hola que tal");
              } else {
                setEmailError("Dirección de email incorrecta");
              }
              setEmail(value);
              break;
            default:
              break;
              
          };
        
    }

    const cambio=()=>{
        props.setTrigger(false)
        setEmail(null);
        setEmailError(0);
        setMensaje('');
        setFormError('');

    }
    const handleSubmit=(event)=>{
        event.preventDefault();

        if(formValid()){
            setMensaje("Revisa tu correo");
        }else{
            setFormError("El formulario contiene errores")
        }
        console.log(email);
    }
    
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h4 className="popup-titulo">¿Tienes problemas para iniciar sesión?</h4>
                <p className="popup-texto">Si has olvidado tu contraseña puedes reestablecerla indicando en el siguiente campo el correo electrónico con el
                    que te registraste. 

                    Una vez hecho esto, ve a mirar tu correo electrónico y sigue los pasos indicados.
                </p>
                <form noValidate className="popup-formulario" >
                    <input 
                    className={emailError.length > 0 ? "error" : null}
                    type="email"
                    placeholder="Introduce tu email"
                    name="email"
                    required
                    value={email}
                    onChange={handleChange}
                            />
                   
                    <input 
                    type="submit" 
                    value="Enviar" 
                    onClick={handleSubmit}
                    
                     />
                    {emailError.length > 0 && (<span className="popup-errorMessage">{emailError}</span>)}
                    {formError.length > 0 && (
                      <span className="popup-errorMessage">{formError}</span>
                    )}
                   
                </form>
                <button className="close-btn" onClick={cambio}>X</button>
                {mensaje.length > 0 && (
                      <span className="popup-exitoso">{mensaje}</span>)}
                {props.children}
                

            </div>
        </div>
    ): "";

    }
export default Popup
