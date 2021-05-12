import React from 'react'
import {Link} from 'react-router-dom';

function TemplateSub({img_src}){
    return(
        <img src={"/images/" + img_src} class="selectPlantilla-plantilla-img" type="submit"/>
    );
}

export default TemplateSub;