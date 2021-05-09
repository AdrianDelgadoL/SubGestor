import React, { useState } from 'react'
import axios from 'axios';
import './popup.css'

const Popup = (props) => {

    const emailRegex = RegExp(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [formError, setFormError] = useState('');
    const [mensaje, setMensaje] = useState('');


    const formValid = () => {
        if (emailError.length > 0 || email.length === 0) {
            return false;
        } else {
            return true;
        }
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setEmail(prevEmail => ({
            ...prevEmail,
            [name]: value
        }))

        switch (name) {
            case "email":
                if (emailRegex.test(value)) {
                    console.log("pasa el test");
                    setEmailError("")
                } else {
                    setEmailError("Dirección de email incorrecta");
                    console.log("no pasa el test")
                    setFormError("")
                    setMensaje("")
                }
                setEmail(value);
                break;
            default:
                break;
        };
    }

    const cambio = () => {
        props.setTrigger(false)
        setEmail(null);
        setEmailError(0);
        setMensaje('');
        setFormError('');
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (formValid()) {
            axios.post(
                'http://localhost:4000/change-pass',
                { email }
            ).then(res => {
                setMensaje("Revisa tu bandeja de entrada");
            }).catch(err => {
                setMensaje("");
                setEmail("");
                if (err.response.data.msg) {
                    setFormError(
                        err.response.data.msg
                    );
                } else {
                    setFormError("El formulario contiene errores")
                }
            });
        } else {
            setMensaje("");
            setEmail("");
            setFormError("El formulario contiene errores")
        }

        // if(formValid()){
        //     setMensaje("Revisa tu bandeja de entrada ");
        //     setFormError("")
        // }else{
        //     setFormError("El formulario contiene errores")
        //     setMensaje("")
        //     setEmail("")
        // }
        // console.log(email);
    }

    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <h4 className="popup-titulo">¿Tienes problemas para iniciar sesión?</h4>
                <p className="popup-texto">Si has olvidado tu contraseña puedes reestablecerla indicando en el siguiente campo el correo electrónico con el
                que te registraste.
                Una vez hecho esto, ve a mirar tu correo electrónico y sigue los pasos indicados en el mail que recibirás.
                </p>
                <form noValidate className="popup-formulario" >
                    <input
                        className={emailError.length > 0 ? "error" : null}
                        type="email"
                        placeholder="Introduce tu email"
                        name="email"
                        required
                        value={email}
                        onChange={handleChange} />

                    <input
                        type="submit"
                        value="Enviar"
                        onClick={handleSubmit} />
                    {emailError.length > 0 && (<span className="popup-errorMessage">{emailError}</span>)}
                    {formError.length > 0 && (
                        <span className="popup-errorMessage">{formError}</span>
                    )}
                </form>

                <button className="popup-close-btn" onClick={cambio}>X</button>
                {mensaje.length > 0 && (<p className="popup-exitoso">{mensaje}</p>)}
                {props.children}
            </div>
        </div>
    ) : "";
}
export default Popup
