import React, { Component, useState } from 'react';

/*
function RegistrationForm(props){
    const [state, setState] = useState({
        email : "",
        password : "" 
    })

    const handleChange = (e) => {
        const {id, value} = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
}
*/
export default class signIn extends Component{
    render() {
        return (
            <div>
                <h3>Sign Up</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label for="email"><b>Email</b></label>
                        <input type="text" className="form-control" id="email" placeholder="Entra l'email"  name="email" /*value={state.email} onChange={handleChange}*/ required></input>

                        <label for="psw"><b>Contrasenya</b></label>
                        <input type="password" className="form-control" placeholder="Entra la contrasenya"  name="psw" /*value={state.password} onChange={handleChange}*/ required></input>

                        <label for="psw-repeat"><b>Repeteix la contrasenya</b></label>
                        <input type="password" className="form-control" placeholder="Repeteix la contasenya"  name="psw-repeat" required></input>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Registra" className="btn btn-primary"></input>
                    </div>
                </form>
            </div>
        )
    }
}