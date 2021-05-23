import React from 'react';


const ErrorPage = () => {

    const errorStyle = {
        textAlign: 'center',
    };
    

    return (
        <div>
            <h1>Parece que algo ha ido mal en nuestros servidores</h1>
            <h3 style={errorStyle}>Nuestro equipo está trabajando en ello</h3>
        </div>
    )
}

export default ErrorPage;