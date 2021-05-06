



function dateValidator(req, res, next) {
    const { end, free_trial, free_trial_end, start_date, end_date, charge_date } = req.body;
    console.log(req.body)
    // Comprobar formato fechas si estan puestas
    console.log(free_trial)
    if (free_trial_end !== "null" && free_trial) {
        if (isNaN(Date.parse(free_trial_end))) return res.status(400).json({
            msg : 'El formato de la fecha final el período de prueba de inicio es incorrecto'
        });
        if(Date.parse(free_trial_end) > Date.now()) return res.status(400).json ( {
            msg : "La fecha final de prueba es inválida"
        });
    }
    console.log(start_date);
    if (start_date !== "null") {
        if (isNaN(Date.parse(start_date))) return res.status(400).json({
            msg : 'El formato de la fecha de inicio es incorrecto'
        });
        if(Date.parse(start_date) > Date.now()) return res.status(400).json ( {
            msg : "La fecha inicial es inválida"
        });
    }
    if (end_date !== "null" && end) {
        if (isNaN(Date.parse(end_date))) return res.status(400).json({
            msg : 'El formato de la fecha final es incorrecto'
        });
        if(Date.parse(end_date) < Date.now()) return res.status(400).json ( {
            msg : "La fecha final es inválida"
        });
    }

    if (charge_date !== "null"){
        if (isNaN(Date.parse(charge_date))) return res.status(400).json({
            msg : 'El formato de la fecha de pago es incorrecto'
        });
        if(Date.parse(charge_date) < Date.now()) return res.status(400).json ( {
            msg : "La fecha de pago es inválida"
        });
    }
    next();

}

module.exports = dateValidator;