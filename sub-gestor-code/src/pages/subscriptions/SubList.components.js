import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Subscription from './Subscription.components.js'
import './SubList.component.css'
import { useAuthState, useAuthDispatch } from '../../context/context'
import axios from "axios";


const SubList = (props) => {

    const userDetails = useAuthState()
    const dispatch = useAuthDispatch()
    const userToken = userDetails.token
    const [tarjetas, setTarjetas] = useState(null)
    const imageRoute = "/images/"
    // backup: contiene todas las suscripciones recuperadas del back-end
    const [backup, setBackup] = useState(null);
    // si no tienes subs no se muestra el buscador
    const [hasSubs, setHasSubs] = useState(false);

    useEffect(() => {
        axios.get(process.env.REACT_APP_SERVER_URL+'/subscription/', {headers: {"x-auth-token": userToken}})
            .then(response => {
                console.log(response);
                // guardamos las subs recuperadas y las mostramos
                setBackup(response.data);
                if(response.data.length !== 0) {
                    setHasSubs(true);
                }
                mostrarTarjetas(response.data);
            }).catch(error => {
                if (error.response === undefined || error.response === 500) {
                    dispatch({ type: 'BACKEND_ERROR', error: "Backend error" });
                    props.history.push('/error');
                } else if(error.response.status == 404) {
                    setTarjetas(<h1>Parece que aún no existe ninguna suscripción</h1>)
                } else {
                    dispatch({ type: 'AUTH_ERROR', error: error.response.data })
                    props.history.push('/auth-error');
                }
        })
    }, [dispatch, props.history, userToken]);

    /*
        La función mostrarTarjetas se encarga de mostrar las subs en función de:
            a) Si recibe "backup" como parámetro: mustra todas las subs del usuario
            b) Si recibe "searchedValues" como parámetro: muestra los resultados de la búsqueda
    */
    function mostrarTarjetas(resBackup) {
        console.log(resBackup);
        setTarjetas(resBackup.map(tarjeta => (
            <div className="row-md-2" key={tarjeta._id}>
                <Subscription title={tarjeta.name} imageSource={imageRoute + tarjeta.img_src} card_price={tarjeta.price} payment_type={tarjeta.currency} charge_date={tarjeta.charge_date} sub_id={tarjeta._id} url={tarjeta.url} free={tarjeta.free_trial}/>
            </div>
        )))
    }

    // handleChange: hace funcional el buscador
    const handleChange = async (e) => {
        const { name, value } = e.target;
        console.log("Valor buscar: " + value);
        let searchedValues = [];
        console.log("BACKUP: " + backup);
        if(value.length !== 0) {
            // se busca el valor en el backup de subs recuperado
            value.toLowerCase();
            backup.map(sub => {
                let nameSub = sub.name.toLowerCase();
                if(nameSub.includes(value.toLowerCase())) {
                    // el valor a buscar se encuentra en el nombre de la sub
                    searchedValues.push(sub);
                } else {
                    let tagIt = 0;
                    while(searchedValues.indexOf(sub) === -1 && tagIt < sub.tags.length) {
                        console.log("TAGS" + sub.tags[tagIt]);
                        if(sub.tags[tagIt].includes(value.toLowerCase())) {
                            searchedValues.push(sub);
                        }
                        tagIt = tagIt + 1;
                    }
                }
            });
            if(searchedValues.length !== 0) {
                // búsqueda con resultados
                mostrarTarjetas(searchedValues);
            } else {
                // búsqueda sin resultados
                setTarjetas(<h1> No existe ninguna suscripción activa asociada a: "{value}"</h1>);
            }
        } else {
            // buscador vacío --> volvemos estado original
            mostrarTarjetas(backup);
        }
    };

    return(
        <div className="subList-wrapper">
            <h2>Tus suscripciones</h2>
            {hasSubs && (
                <div className="subList-buscador">
                    <input id="subList-buscador" type="text" onChange={handleChange} placeholder="Buscar suscripciones activas por nombre o tag..."/>
                </div>
            )}
            <div className="subList-container container">
                {tarjetas}
            </div>
            <div className="subList-createSubscription">
                <Link to="/selectPlantilla">Nueva suscripcion</Link>
            </div>
            <div className="subList-canceladas">
                <Link to="/canceladas">Suscripciones canceladas</Link>
            </div>
        </div>
    )
}


export default SubList;
