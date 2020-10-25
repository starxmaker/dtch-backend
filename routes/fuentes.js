const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")

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
    try{
        const receivedFuente= await Fuente.findOne({ 'idFuente': req.params.fuenteId })
        res.status(200).json(receivedFuente)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.post("/", async (req,res) =>{
    const fuente= new Fuente({
        nombre: req.body.nombre,
        color: req.body.color,
        descripcion: req.body.descripcion
    })
    try{
        const savedFuente = await fuente.save()
        res.status(200).json(savedFuente)
    }catch (err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.delete("/:fuenteId", async (req, res) =>{
    try{
        await Fuente.remove({ 'idFuente': req.params.fuenteId })
        res.status(200).json({message: "fuente eliminada"})
    }catch(err){
        res.status(403).send("Error de autorización")
    }
})



module.exports = router