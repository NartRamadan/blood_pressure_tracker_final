const express = require('express');
const Measurement_Mid = require("../Middleware/Measurement_Mid");
const router = express.Router();
module.exports = router;

router.get('/',[Measurement_Mid.GetMeasurement], (req, res) => { //Read - קבלת רשימה
    if(req.success){
        res.status(200).json(
            {
                msg             :"ok",
                data            :req.measurements,
            });
    } else {
        return res.status(500).json({message: err});
    }
});