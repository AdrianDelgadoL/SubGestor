import React from "react";
import { Redirect, Route } from "react-router-dom";

import { useAuthState } from '../context/context'

const AppRoutes = ({ component: Component, path, isPrivate, ...rest }) => {

    const userDetails = useAuthState()

    // TODO: llamar a API para comprovar si la autenticacion sigue siendo buena, en el caso que no se llama al reducer marcando logout

    return (
        <Route
            path={path}
            render={props =>
                isPrivate && !Boolean(userDetails.token) ? (
                    <Redirect
                        to={{ pathname: "/home" }}
                    />
                ) : (
                        <Component {...props} />
                    )
            }
            {...rest}
        />
    )
}

export default AppRoutes