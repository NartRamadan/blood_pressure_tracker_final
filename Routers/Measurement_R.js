const express = require('express');
const Measurement_Mid = require("../Middleware/Measurement_Mid");
const router = express.Router();
module.exports = router;

router.get('/',[Measurement_Mid.GetMeasurement], (req, res) => {
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
router.post('/Report',[Measurement_Mid.GetReport], (req, res) => {
    if(req.success){
        res.status(200).json(
            {
                msg             :"ok",
                data:req.reportData,
            });
    } else {
        return res.status(500).json({message: req.err});
    }
});