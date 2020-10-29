const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")
const Lista = require("../models/Lista")
const sanitize = require('mongo-sanitize');

router.use(authenticateJWT)


router.get("/", async (req, res) =>{
    try{
        
        const results=await Lista.findOne({ fecha_year: new Date().getFullYear(),fecha_month:new Date().getMonth()+1,fecha_day:new Date().getDate()})
        if (results==null){
            res.json({lista: [], historial: []})
        }else{
            res.json(results)
        }
    }catch(err){
        res.status(403).json({message: "Error de autorización"})
    }
})
router.post("/", async (req, res) =>{

    //body
    const listaP= sanitize(req.body.lista)
    const historial=sanitize(req.body.historial)
    try{
            await Lista.remove({})
            const lista=new Lista({lista: listaP, historial: historial})
            const savedLista=await lista.save()
            res.status(200).json(savedLista)
    }catch(err){
        res.status(403).json({message: "Error de autorización"})
    }
})

module.exports = router