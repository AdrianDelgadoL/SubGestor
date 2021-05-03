import React from "react";
import { Redirect, Route } from "react-router-dom";

import { useAuthState } from '../context/context'

const AppRoutes = ({ component: Component, path, isPrivate, forUnlogged, ...rest }) => {

    const userDetails = useAuthState()
    console.log(path)
    const redirectComponents = (props) => {
        if(isPrivate && !Boolean(userDetails.token)) {
            return (
                <Redirect
                    to={{ pathname: "/" }}
                />
            )
        } else if (forUnlogged && Boolean(userDetails.token)) {
                return (
                    <Redirect
                        to={{ pathname: "/home" }}
                    />
                )
        } else {
            return (
                <Component {...props} />
            )
        }
    }

    // TODO: llamar a API para comprovar si la autenticacion sigue siendo buena, en el caso que no se llama al reducer marcando logout

    return (
        <Route
            path={path}
            render={props => 
                redirectComponents(props)
            }
            {...rest}
        />
    )
}

export default AppRoutes