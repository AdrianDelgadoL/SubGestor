import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import './selectPlantilla.css';
import { useAuthState, useAuthDispatch } from '../../context/context';
import axios from "axios";
/*
import amazon from '../../../public/images/amazon.png';
import apple from '../assets/apple-music.jpg';
import dazn from '../assets/dazn.jpg';
import hbo from '../assets/hbo.png';
import Netflix from '../../../public/images/netflix.png';
import psn from '../assets/psn-plus.jpg';
import spotify from '../../../public/images/spotify.png';
import wow from '../assets/wow.jpg';
import xbox from '../assets/xbox-live.jpg';
 */
import TemplateSub from './TemplatesSub'

const SelectPlantilla = (props) => {

    const userDetails = useAuthState()
    const dispatch = useAuthDispatch()
    const userToken = userDetails.token

    const [templates, setTemplates] = useState(null)
    const imageRoute = "/images/"

    useEffect(() => {
        axios.get('http://localhost:4000/templates/', {headers: {"x-auth-token": userToken}}).then(
            response => {
                console.log(response.data)
                setTemplates(response.data.map(dt => (
                    <div className="selectPlantilla-grid-container">
                        <div className="selectPlantilla-grid-area">
                            <a href="/home">
                                <TemplateSub img_src={dt.img_src}/>
                            </a>
                        </div>
                    </div>
                )));
            }
        );
    }, [dispatch, props.history, userToken])


    return (
        <div className="selectPlantilla-propia">
            <div className="selectPlantilla-tarjeta">
                <h1 className="selectPlantilla-subtitulo">Crea tu propia plantilla</h1>
                <form method="get" action="/createSub" className="homePage-form">
                    <button className="selectPlantilla-tarjeta-button" type="submit">Empieza ya</button>
                </form>
            </div>

            <hr className="selectPlantilla-separator"/>
            <div className="selectPlantilla-plantillas">
                <h1 className="selectPlantilla-subtitulo">Utiliza una plantilla creada</h1>
                {templates}
            </div>
        </div>
    );
}
/*
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
                <div className="selectPlantilla-grid-container">
                    <div class="selectPlantilla-grid-area" id="selectPlantila-grid-amazon">
                        <a href="/home">
                            <img src={amazon} class="selectPlantilla-plantilla-img" type="submit"></img>
                        </a>
                    </div>
                    <div class="selectPlantilla-grid-area" id="selectPlantila-grid-apple">
                        <a href="/home">
                            <img src ={apple} class="selectPlantilla-plantilla-img"></img>
                        </a>
                    </div>
                    <div class="selectPlantilla-grid-area" id="selectPlantila-grid-dazn">
                        <a href="/home">
                            <img src ={dazn} class="selectPlantilla-plantilla-img"></img>
                        </a>
                    </div>
                    <div class="selectPlantilla-grid-area" id="selectPlantila-grid-hbo">
                        <a href="/home">
                            <img src ={hbo} class="selectPlantilla-plantilla-img"></img>
                        </a>
                    </div>
                    <div class="selectPlantilla-grid-area" id="selectPlantila-grid-netflix">
                        <a href="/home">
                            <img src ={netflix} class="selectPlantilla-plantilla-img"></img>
                        </a>
                    </div>
                    <div class="selectPlantilla-grid-area" id="selectPlantila-grid-psn">
                        <a href="/home">
                            <img src ={psn} class="selectPlantilla-plantilla-img"></img>
                        </a>
                    </div>
                    <div class="selectPlantilla-grid-area" id="selectPlantila-grid-spotify">
                        <a href="/home">
                            <img src ={spotify} class="selectPlantilla-plantilla-img"></img>
                        </a>
                    </div>
                    <div class="selectPlantilla-grid-area" id="selectPlantila-grid-wow">
                        <a href="/home">
                            <img src ={wow} class="selectPlantilla-plantilla-img"></img>
                        </a>
                    </div>
                    <div class="selectPlantilla-grid-area" id="selectPlantila-grid-xbox">
                        <a href="/home">
                            <img src ={xbox} class="selectPlantilla-plantilla-img"></img>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
*/

export default SelectPlantilla;