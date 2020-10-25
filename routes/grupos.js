const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")

router.use(authenticateJWT)


const Telefono = require("../models/Telefono")

router.get("/getAll", async (req, res) =>{
    try{
        const resultados= await Telefono.distinct("grupo")
        res.status(200).json(resultados)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})

module.exports = router