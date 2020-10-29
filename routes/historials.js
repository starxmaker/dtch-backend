const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")
const sanitize = require('mongo-sanitize');


router.use(authenticateJWT)

const Historial = require("../models/Historial")


router.get("/getAll", async (req, res) =>{
    try{
        const historials= await Historial.find()
        res.status(200).json(historials)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})



router.get("/getLast", async (req, res) =>{
    try{
        const results=await queryHistorials(50)
        res.status(200).json(results)
    }catch(err){
        res.status(403).send()
    }
})
router.get("/telefono/:telefonoId", async (req, res) =>{
    //params
    const idTelefono=sanitize(req.params.telefonoId)
    try{
        const results=await queryHistorials(100, {id_numero: parseInt(idTelefono)})
        res.status(200).json(results)
    }catch(err){
        res.status(403).send()
    }
})
router.get("/:historialId", async (req, res) =>{
    //params
    const idHistorial=sanitize(req.params.historialId)
    try{
        const results=await queryHistorials(1, {idHistorial: parseInt(idHistorial)})
        res.status(200).json(results)
    }catch(err){
        res.status(403).send()
    }
})

router.post("/", async (req,res) =>{
    //nbody
        const tiempo= sanitize(req.body.tiempo)
        const estado= sanitize(req.body.estado)
        const id_numero= sanitize(req.body.idTelefono)
        const tipo= sanitize(req.body.tipo)
        const publicador= sanitize(req.body.publicador)

    const historial= new Historial({
        tiempo: tiempo,
        estado: estado,
        id_numero: id_numero,
        tipo: tipo,
        publicador: publicador
    })
    try{
        const savedHistorial = await historial.save()
        res.status(200).json(savedHistorial)
    }catch (err){
        res.status(403).send({error: "Error de autorización"})
    }
})


router.delete("/:historialId", async (req, res) =>{
    //params
    const idHistorial=sanitize(req.params.historialId)
    try{
        await Historial.remove({ 'idHistorial': parseInt(idHistorial) })
        res.status(200).json({message: "registro eliminado"})
    }catch(err){
        res.status(403).send("Error de autorización")
    }
})

const queryHistorials= async (quantity, filtros={})=>{
    const results=await Historial.aggregate()
    .match(filtros)
    .sort(
        {
            "idHistorial": -1
        }
    )
    .limit(quantity)
    .lookup({from: "telefonos", localField: "id_numero", foreignField: "idTelefono", as: "Telefono"})
    .unwind({path: "$Telefono", preserveNullAndEmptyArrays: true})
    .lookup({from: "publicadores", localField: "publicador", foreignField: "idPublicador", as: "Publicador"})
    .unwind({path: "$Publicador", preserveNullAndEmptyArrays: true})
    .addFields({nombrePublicador: "$Publicador.nombre", numeroTelefono: "$Telefono.numero"})
    
    
    return results
}

module.exports = router