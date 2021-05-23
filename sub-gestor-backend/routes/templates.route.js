const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const mongoose = require('mongoose');
const Templates = require('../models/templateSub.model');

/*
GET /templates (Obtener todas las plantillas disponibles)
GET /templates/:id (Obtener la información de una plantilla)
*/

// recuperar plantillas
router.get('/', auth, (req, res) => {
    Templates.find().select("img_src").then(templates => {
        if(!templates) {
            return res.status(404).json({msg: "Plantillas no encontradas"});
        } else {
            return res.status(200).json(templates);
        }
    }).catch(err => {
        return res.status(500).json({msg: "Error buscando plantillas"});
    });
});

// recuperar info plantilla
router.get('/:id', auth, (req, res) => {
    const idTemplate = req.params.id;
    Templates.findById(idTemplate).then(templates => {
        if(!templates) {
            return res.status(404).json({msg: "Plantilla no encontrada y/o no disponible"});
        } else {
            return res.status(200).json(templates);
        }
    }).catch(err => {
            return res.status(500).json({msg: "Error recuperando la información de las plantillas"});
    });
});

module.exports = router;