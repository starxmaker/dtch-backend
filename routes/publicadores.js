const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")

router.use(authenticateJWT)


const Publicador = require("../models/Publicador")

router.get("/getAll", async (req, res) =>{
    try{
        const publicadores= await Publicador.find()
         
        res.status(200).json(publicadores)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.get("/nombre/:nombre", async (req, res) =>{
    try{
        const receivedPublicador= await Publicador.findOne({ 'nombre': req.params.nombre })
        res.status(200).json(receivedPublicador)
    }catch(err){
        res.status(403).send()
    }
})

router.get("/:publicadorId", async (req, res) =>{
    try{
        const receivedPublicador= await Publicador.findOne({ 'idPublicador': parseInt(req.params.publicadorId) })
        res.status(200).json(receivedPublicador)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})



router.post("/", async (req,res) =>{
    const publicador= new Publicador({
        nombre: req.body.nombre,
        invitado: req.body.invitado,
        grupo: req.body.grupo
    })
    try{
        const savedPublicador = await publicador.save()
        res.status(200).json(savedPublicador)
    }catch (err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.delete("/:publicadorId", async (req, res) =>{
    try{
        await Publicador.remove({ 'idPublicador': req.params.publicadorId })
        res.status(200).json({message: "publicador eliminado"})
    }catch(err){
        res.status(403).send("Error de autorización")
    }
})

module.exports = router