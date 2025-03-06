const express = require('express');
const router = express.Router();
module.exports = router;

const User_Mid=require("../middleware/User_Mid")

router.post('/AddUser',[User_Mid.AddUser], (req, res) => {
    if(req.success){
        res.status(200).json({msg:"ok",Last_Id:req.insertId});
    } else {
        return res.status(500).json({message: err});
    }
});

router.get('/',[User_Mid.ReadUsers], (req, res) => { //Read - קבלת רשימה
    if(req.success){
        res.status(200).json(
            {
                msg             :"ok",
                data            :req.Users_data,
            });
    } else {
        return res.status(500).json({message: err});
    }
});