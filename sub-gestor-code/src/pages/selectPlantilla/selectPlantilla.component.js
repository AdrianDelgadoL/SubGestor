import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import './selectPlantilla.css';
import { useAuthState, useAuthDispatch } from '../../context/context';
import axios from "axios";
import fotoPlantilla from '../assets/crear-sub.png'


const selectPlantilla = (props) => {
    return(
        <div class="selectPlantilla-wrapper">
            <div class="selectPlantilla-propia">
                <div class="selectPlantilla-tarjeta">
                    <h1 className="selectPlantilla-subtitulo">Crea tu propia plantilla</h1>
                    <form method="get" action="/createSub" class="homePage-form">
                        <button className="selectPlantilla-tarjeta-button"type="submit">Empieza ya</button>
                    </form>
                </div>
            </div>
            <hr className="selectPlantilla-separator"/>
            <div class="selectPlantilla-plantillas">
                <h1 className="selectPlantilla-subtitulo">Utiliza una plantilla creada</h1>
            </div>
        </div>
    )
}


export default selectPlantilla;