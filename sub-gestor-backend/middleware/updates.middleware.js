const Subscription = require('../models/subscription.model');

function updates(req, res, next) {
    const { id } = req.userId;


    Subscription.find({user_id: id, active: true})
        .then(subscriptions => {
            if(!subscriptions) return res.status(404).json({msg: "No se han encontrado suscripciones"});

            subscriptions.forEach(sub => {
                if(sub.active) {
                    while (Date.now() > sub.charge_date) {
                        console.log("Modifing date")
                        switch (sub.frequency) {
                            case "monthly":
                                sub.charge_date.setMonth(sub.charge_date.getMonth()+1);
                                break;
                            case "bimonthly":
                                sub.charge_date.setMonth(sub.charge_date.getMonth()+2);
                                break;
                            case "quarterly":
                                sub.charge_date.setMonth(sub.charge_date.getMonth()+3);
                                break;
                            case "weekly":
                                sub.charge_date.setDate(sub.charge_date.getDate() + 7);
                                break;
                            case "annual":
                                sub.charge_date.setMonth(sub.charge_date.getMonth()+12);
                                break;
                            case "onetime":
                                sub.active = false;
                                sub.charge_date = null;
                                sub.markModified("active");
                                break;
                        }
                        sub.markModified("charge_date");
                        sub.save()
                            .then(sub2 =>{
                                console.log("ta bien " + sub2);
                                }
                            )
                            .catch((err) => {
                            if(err) console.log(err);
                            return res.status(500).json({msg: "Error al modificar la suscripcion"});
                        })
                    }
                }
            });


            console.log("Antes del sort" + subscriptions);
            subscriptions.sort(function(sub1, sub2) {
                if(sub1.charge_date > sub2.charge_date || sub1.charge_date === undefined) {
                    return 1;
                } else if(sub1.charge_date < sub2.charge_date || sub2.charge_date === undefined) {
                    return -1;
                }
                return 0;
            });
            console.log("Despues del sort: ");
            subscriptions.forEach(sub => {
                console.log("sub_date " + sub.charge_date + " sub_name " + sub.name);
            });

            res.status(200).send(subscriptions);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({msg: "Error al buscar suscripciones"} );
        });
    next();
}

module.exports = updates;