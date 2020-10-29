const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")
const sanitize = require('mongo-sanitize');

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

    //params
    const nombre=sanitize(req.params.nombre)
    try{
        const receivedPublicador= await Publicador.findOne({ 'nombre': nombre})
        res.status(200).json(receivedPublicador)
    }catch(err){
        res.status(403).send()
    }
})

router.get("/:publicadorId", async (req, res) =>{
    //params
    const idPublicador=sanitize(req.params.publicadorId)
    try{
        const receivedPublicador= await Publicador.findOne({ 'idPublicador': parseInt(idPublicador)})
        res.status(200).json(receivedPublicador)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})



router.post("/", async (req,res) =>{

    const nombre= sanitize(req.body.nombre,)
    const invitado= sanitize(req.body.invitado,)
    const grupo= sanitize(req.body.grupo)

    const publicador= new Publicador({
        nombre: nombre,
        invitado: invitado,
        grupo: grupo
    })
    try{
        const savedPublicador = await publicador.save()
        res.status(200).json(savedPublicador)
    }catch (err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.delete("/:publicadorId", async (req, res) =>{
    //params
    const idPublicador=sanitize(req.params.publicadorId)
    try{
        await Publicador.remove({ 'idPublicador': idPublicador })
        res.status(200).json({message: "publicador eliminado"})
    }catch(err){
        res.status(403).send("Error de autorización")
    }
})

module.exports = router