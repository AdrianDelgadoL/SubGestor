
function dateValidator(req, res, next) {
    const { end, free_trial, free_trial_end, start_date, end_date, charge_date } = req.body;

    // Comprobar formato fechas si estan puestas
    if (free_trial_end !== "null" && free_trial === 'true') {
        if (isNaN(Date.parse(free_trial_end))) return res.status(400).json({
            msg : 'El formato de la fecha final el período de prueba es incorrecto'
        });
        if(Date.parse(free_trial_end) < Date.now()) return res.status(400).json ( {
            msg : 'La fecha final de prueba es inválida'
        });
    }
    if (start_date !== "null") {
        if (isNaN(Date.parse(start_date))) return res.status(400).json({
            msg : 'El formato de la fecha de inicio es incorrecto'
        });
        if (free_trial_end !== "null" && free_trial === 'true')
            if(Date.parse(free_trial_end) < Date.parse(start_date)) return res.status(400).json( {
                msg: 'La fecha inicial no puede ir después de ninguna otra fecha'
            });
        if (end_date !== "null" && end === 'true')
            if(Date.parse(end_date) < Date.parse(start_date)) return res.status(400).json( {
                msg: 'La fecha inicial no puede ir después de ninguna otra fecha'
            });
        if (charge_date !== "null")
            if(Date.parse(charge_date) < Date.parse(start_date)) return res.status(400).json( {
                msg: 'La fecha inicial no puede ir después de ninguna otra fecha'
            });


    }
    if (end_date !== "null" && end === "true") {
        if (isNaN(Date.parse(end_date))) return res.status(400).json({
            msg : 'El formato de la fecha final es incorrecto'
        });
        if(Date.parse(end_date) < Date.now()) return res.status(400).json ( {
            msg : 'La fecha final es inválida'
        });
    }

    if (charge_date !== "null") {
        if (isNaN(Date.parse(charge_date))) return res.status(400).json({
            msg : 'El formato de la fecha de pago es incorrecto'
        });
        if(Date.parse(charge_date) < Date.now()) return res.status(400).json ( {
            msg : 'La fecha de pago es inválida'
        });

        if (free_trial_end !== "null" && free_trial === 'true')
            if(Date.parse(free_trial_end) > Date.parse(charge_date)) return res.status(400).json( {
                msg: 'La fecha final de pago no puede ser después de la fecha de cobro'
            });
    }

    next();

}

module.exports = dateValidator;