import React from 'react'
import {Link} from 'react-router-dom';

function TemplateSub({img_src}){
    return(
        <div class="template">
            <img src={"/images/" + img_src} class="selectPlantilla-plantilla-img" type="submit"/>
        </div>
    );
}

export default TemplateSub;