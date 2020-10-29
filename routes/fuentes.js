const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")
const sanitize = require('mongo-sanitize');

router.use(authenticateJWT)


const Fuente = require("../models/Fuente")

router.get("/getAll", async (req, res) =>{
    try{
        const fuentes= await Fuente.find()
        
        res.status(200).json(fuentes)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})
router.get("/blank", (req,res) =>{
    res.status(200).json({idFuente: -1, nombre: "Fuente Propia", color:"grey", descripcion: "una"})
})
router.get("/:fuenteId", async (req, res) =>{
    //params

    const idFuente= sanitize(req.params.fuenteId)
    try{
        const receivedFuente= await Fuente.findOne({ 'idFuente': idFuente })
        res.status(200).json(receivedFuente)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.post("/", async (req,res) =>{
    //body
    const nombre=sanitize(req.body.nombre)
    const color=sanitize(req.body.color)
    const descripcion=sanitize(req.body.descripcion)
    const fuente= new Fuente({
        nombre: nombre,
        color: color,
        descripcion: descripcion
    })
    try{
        const savedFuente = await fuente.save()
        res.status(200).json(savedFuente)
    }catch (err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.delete("/:fuenteId", async (req, res) =>{
    //params
    const idFuente=sanitize(req.params.fuenteId)
    try{
        await Fuente.remove({ 'idFuente': idFuente })
        res.status(200).json({message: "fuente eliminada"})
    }catch(err){
        res.status(403).send("Error de autorización")
    }
})



module.exports = router