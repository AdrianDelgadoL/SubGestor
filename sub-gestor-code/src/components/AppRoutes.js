import React from "react";
import { Redirect, Route } from "react-router-dom";

import { useAuthState } from '../context/context'

const AppRoutes = ({ component: Component, path, isPrivate, ...rest }) => {

    const userDetails = useAuthState()
    console.log(userDetails.token)
    console.log(path)
    console.log(isPrivate)
    console.log(isPrivate && !Boolean(userDetails.token))
    return (
        <Route
            path={path}
            render={props =>
                isPrivate && !Boolean(userDetails.token) ? (
                    <Redirect
                        to={{ pathname: "/" }}
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