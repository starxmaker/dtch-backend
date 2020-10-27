const express= require("express")
const router= express.Router()
const jwt=require("jsonwebtoken")
require("dotenv/config")
const generateToken = require('../utils/generateToken');

const Usuario = require("../models/Usuario")


router.post("/init", async (req, res) =>{
    const countUsuarios= await Usuario.countDocuments()
        if (countUsuarios===0){
           const newUser = new Usuario({
                username: req.body.username,
                password: req.body.password
            })
            try{
                await newUser.save()
                res.json({message: "usuario creado"})
            }catch(err){
                res.status(403).json({error: "Error de autorizacion"});
            }
        
    }else{
        res.status(403).json({error: "Ya se inicializó el primer usuario"})
    }
})

router.post("/login", (req,res) =>{
    try{
        Usuario.getAuthenticated(req.body.username, req.body.password, function(err, user, reason) {
        if (user) {
                const token=generateToken(res,user._id, user.username)
               
               res.json({
                mensaje: 'Autenticación correcta',
                token: token
               });
            return;
        }else{
            res.status(403).json({error: "error de autentificación"})
            return;
        }
    });
}catch(err){
    res.status(400).json({error: "Error de autentificación"})
}
})

module.exports = router