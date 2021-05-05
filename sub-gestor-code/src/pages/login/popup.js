import React,{useState} from 'react'
import './popup.css'
const Popup = (props) =>{
    const [datos,setDatos]=useState({
        correo: ''
    })

    const handleInputChange=(event)=>{
        console.log(event.target.value)
        setDatos({
            ...datos,
            [event.target.name]: event.target.value

        })

    }
    const enviarDatos=(event)=>{
        event.preventDefault();
        console.log(datos);

    }

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h4 className="popup-titulo">¿Tienes problemas para iniciar sesión?</h4>
                <p className="popup-texto">Si has olvidado tu contraseña puedes reestablecerla indicando en el siguiente campo el correo electrónico con el
                    que te registraste. 

                    Una vez hecho esto, ve a mirar tu correo electrónico y sigue los pasos indicados.
                </p>
                <form>
                    <label>Correo electrónico: </label>
                    <input 
                    type="email"
                    required 
                    placeholder="Introduce tu email"
                    name="correo"
                    onChange={handleInputChange}/>
                    <input 
                    type="submit" 
                    value="Enviar" 
                     onClick={()=>props.setTrigger(false)}
                     onSubmit={enviarDatos}/>
                </form>
                <button className="close-btn" onClick={()=>props.setTrigger(false)}>X</button>
                {props.children}
                

            </div>
        </div>
    ): "";

    }
export default Popup
