const express= require("express")
const router= express.Router()
const jwt=require("jsonwebtoken")
require("dotenv/config")
const generateToken = require('../utils/generateToken');

const sanitize = require('mongo-sanitize');
const Usuario = require('../models/Usuario') 


router.post("/init", async (req, res) =>{
    const username=sanitize(req.body.username)
    const password=sanitize(req.body.password)
    try{
        if (process.env.ALLOW_USER_CREATION!="TRUE") throw "Se deshabilitó la creación de usuarios"

           const newUser = new Usuario({
                username: username,
                password: password
            })
            
                await newUser.save()
                res.status(200).json({message:"OK"})
    }catch(err){
                res.status(403).json({error: "Error de autorizacion"});
     }
        
}) 


router.post("/login", (req,res) =>{
    //sanitize
    const username=sanitize(req.body.username)
    const password=sanitize(req.body.password)
    try{
        Usuario.getAuthenticated(username, password, async function(err, user, reason) {
        if (user) {
                const csrfToken=await generateToken(res, username)
               
               res.json({
                mensaje: 'Autenticación correcta',
                csrfToken: csrfToken
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