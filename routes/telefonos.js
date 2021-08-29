const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")
const sanitize = require('mongo-sanitize');
const jwt=require("jsonwebtoken")

router.use(authenticateJWT)


const Telefono = require("../models/Telefono")
const Historial = require("../models/Historial")


router.get("/getAll", async (req, res) =>{
    try{
        const telefonos= await Telefono.find()
        res.status(200).json(telefonos)
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.get("/available", async (req, res) =>{
    try{
        const telefonos= await Telefono.countDocuments({estado:0})
        res.status(200).json({available: telefonos})
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.get("/blank", async (req, res) =>{
   res.status(200).json(
       {
           idTelefono:0,
           direccion: "N/A",
           codigo_pais: "",
           codigo_region: "",
           numero: "Propio",
           grupo: -1,
           estado: 0,
           ultima_llamada_year:0,
           ultima_llamada_month:0,
           ultima_llamada_day: 0,
           ultima_llamada_hour:0,
           ultima_llamada_minute:0,
           ultima_llamada_second: 0,
           publicador: "N/A",
           fuente: -1,
           visualizado_hoy:false,
           llamado_esta_semana: false,
           tipo:-1
        })
})
router.get("/replacePublicador/:publicadorId", async (req, res) =>{
    const idPublicador=sanitize(req.params.publicadorId)
    try{
        let publicadorId=parseInt(idPublicador)
        await Telefono.updateMany({ "estado": {"$in": [7,2,8,10,11] }, publicador: publicadorId},{$set:{estado:4}})
       await Telefono.updateMany({publicador: publicadorId},{$set:{publicador:0}})
        res.status(200).json({message: "OK"})
    }catch(err){
        res.status(403).send()
    }
})
router.get("/checkExistance/:numero", async(req,res) =>{
    const numero=sanitize(req.params.numero)
    try{
        const telefonos= await Telefono.countDocuments({numero:numero})
       
        res.status(200).json({exists: telefonos!==0})
    }catch(err){
        res.status(403).send({error: "Error de autorización"})
    }
})
router.get("/query/:search", async (req, res) =>{
    const search=sanitize(req.params.search)
    try{
        let filtros
        if (isNaN(search)){
            filtros={
                nombrePublicador: new RegExp(search, "i"),
                estado: {$in:[7,2,10,11]}
            }
        }else{
            filtros={
                numero: new RegExp(search, "i")
            }
        }
        const results=await queryTelefonos(filtros,100)
        res.status(200).json(results)
    }catch(err){
        res.status(403).send()
    }
})
router.get("/revisitasByPublicador/:publicadorId", async (req, res) =>{
    const idPublicador=sanitize(req.params.publicadorId)
    try{
        let filtros={
            publicador: parseInt(idPublicador)
        }
        const results=await queryTelefonos(filtros,100)
        res.status(200).json(results)
    }catch(err){
        res.status(403).send()
    }
})

router.get("/release/:telefonoId", async (req, res) =>{
     const idTelefono=sanitize(req.params.telefonoId)
    try{
        await Telefono.updateOne({idTelefono: idTelefono},{estado:4, publicador:0})
        res.status(200).json({"message": "OK"})
    }catch(err){
        res.status(403).send()
    }
})

router.get("/:telefonoId", async (req, res) =>{
    const idTelefono=sanitize(req.params.telefonoId)
    try{
        const filtros={
            idTelefono: parseInt(idTelefono)
        }
        const results=await queryTelefonos(filtros,1)
        res.status(200).json(results)
    }catch(err){
        res.status(403).send()
    }
})

router.post("/nextNumber", async (req, res) =>{
   try{

        const token =req.cookies['token'] || '' ;
        const payload = await jwt.verify(token, process.env.JWT_KEY, {ignoreExpiration: true} );

        let allowedEstados=[]
        
        let allowedTipos=[]
        //let allowedGrupos=req.body.filtro.allowedGrupos
        //let allowedFuentes=req.body.filtro.allowedFuentes
        let additionalFilters={}
        
        if (req.body.filtro.tipo.fijo) allowedTipos.push(0)
        if (req.body.filtro.tipo.celular) allowedTipos.push(1)

        if (req.body.filtro.respuesta.marca) allowedEstados.push(4)
        if (req.body.filtro.respuesta.ocupado) allowedEstados.push(9)
        if (req.body.filtro.respuesta.receptivo) allowedEstados.push(6)
        if (req.body.filtro.respuesta.sinInteres) allowedEstados.push(1)
        if (req.body.filtro.respuesta.noUtilizado) allowedEstados.push(0)
        if (req.body.filtro.respuesta.buzon) allowedEstados.push(12)
        if (req.body.filtro.respuesta.revisita){
            allowedEstados.push(7,2,10,11)
            additionalFilters={...additionalFilters, publicador: req.body.filtro.respuesta.revisitaPublisher.value}
            
        }
        if (req.body.filtro.visualizadoHoy) additionalFilters={...additionalFilters, ultima_visualizacion_year:new Date().getFullYear(), ultima_visualizacion_month:new Date().getMonth()+1, ultima_visualizacion_day: new Date().getDate()}
        if (req.body.filtro.llamadoSemana){
            additionalFilters={...additionalFilters, dias_desde: {$lte : 7} }
        
        }
        let current = new Date()
        let month = current.getMonth() +1
        let year = current.getFullYear()

        let filteredMonth = month === 1? 12 : month -1
        let filteredYear = month === 1? year -1 : year;

        let filtros={
            ...additionalFilters,
            estado: { $in: allowedEstados},
            tipo: {$in: allowedTipos },
            $or: [
                {ultima_llamada_year: {$lt: filteredYear}},
                {ultima_llamada_year: {$eq: filteredYear}, ultima_llamada_month: {$lte: filteredMonth}}
            ],
            $or: [
                {reservedUser: { $exists: false } },
                {reservedUser: {$eq: payload.username}}
            ]
            //grupo: {$in: allowedGrupos},
            //fuente: {$in: allowedFuentes}
        }
        const results=await queryTelefonos(filtros,sanitize(req.body.quantity))
        
        res.status(200).json(results)
    }catch (err){
        console.log(err)
        res.status(403).send({error: "Error de autorización"})
    }
    
   
})

router.post("/", async (req,res) =>{
        const direccion= sanitize(req.body.direccion)
        const codigo_pais= sanitize(req.body.codigo_pais)
        const codigo_region= sanitize(req.body.codigo_region)
        const numero= sanitize(req.body.numero)
        const grupo= sanitize(req.body.grupo)
        const fuente= sanitize(req.body.fuente)
        const tipo= sanitize(req.body.tipo)
        const publicador= sanitize(req.body.publicador)

    const telefono= new Telefono({
        direccion: direccion,
        codigo_pais: codigo_pais,
        codigo_region: codigo_region,
        numero: numero,
        grupo: grupo,
        fuente: fuente,
        tipo: tipo,
        publicador: publicador
    })
    try{
        const savedTelefono = await telefono.save()
        res.status(200).json(savedTelefono)
    }catch (err){
        res.status(403).send({error: "Error de autorización"})
    }
})

router.patch("/", async(req,res) =>{
    const idTelefono=sanitize(req.body.idTelefono)
    const newEstado=sanitize(req.body.newEstado)
    const newPublicador=sanitize(req.body.newPublicador)
    const tiempo=sanitize(req.body.tiempo)
    try{
        if (idTelefono!=0 && idTelefono!=null){
            let telefono=await Telefono.findOne({idTelefono: idTelefono})
            let notEditables=[7,2,10,11]
            let newStatusNotEditables=[0,9,4,6,12]
            let updateQuery={
                ultima_llamada_year:new Date().getFullYear(),
                ultima_llamada_month:new Date().getMonth()+1,
                ultima_llamada_day:new Date().getDate(),
                ultima_llamada_hour:new Date().getHours(),
                ultima_llamada_minute:new Date().getMinutes(),
                ultima_llamada_second:new Date().getSeconds()
            }
            
            if(!(notEditables.includes(telefono.estado) && newStatusNotEditables.includes(newEstado))){
                    updateQuery={
                        ...updateQuery,
                        estado: newEstado,
                        publicador: newPublicador
                    }
                
            }
            await Telefono.updateOne({idTelefono: idTelefono},updateQuery)
        }
        
        const newRecord=new Historial({
            id_numero: idTelefono,
            estado:newEstado,
            publicador: newPublicador,
            tiempo: tiempo
        })
        const insertedRecord=await newRecord.save()
        res.status(200).json({"message": "OK"})
    }catch(err){
        res.status(403).json({"error": "error de autentificación"})
    }
    
})

router.delete("/:telefonoId", async (req, res) =>{
    const idTelefono=sanitize(req.params.telefonoId)
    try{
        await Telefono.remove({ 'idTelefono': idTelefono })
        res.status(200).json({message: "telefono eliminado"})
    }catch(err){
        res.status(403).send("Error de autorización")
    }
})

const queryTelefonos= async (filtros, quantity)=>{
    const results=await Telefono.aggregate()
    .sort(
        {
            "ultima_llamada_year": 1,
            "ultima_llamada_month": 1,
            "ultima_llamada_day": 1,
            "ultima_llamada_hour": 1,
            "ultima_llamada_minute": 1,
           "ultima_llamada_second": 1
        }
    )
    .lookup({from: "publicadores", localField: "publicador", foreignField: "idPublicador", as: "Publicador"})
    .unwind({path: "$Publicador", preserveNullAndEmptyArrays: true})
    .lookup({from: "fuentes", localField: "fuente", foreignField: "idFuente", as: "Fuente"})
    .unwind({path: "$Fuente", preserveNullAndEmptyArrays: true})
    .addFields({nombrePublicador: "$Publicador.nombre", nombreFuente: "$Fuente.nombre", dias_desde:{$trunc: {$divide:[{$subtract: [new Date(), {$dateFromString:{ dateString:{$concat: [{$substr:["$ultima_llamada_year",0, -1]},"-",{$substr: ["$ultima_llamada_month",0,-1]},"-",{$substr:["$ultima_llamada_day", 0,-1]}]}}}]}, 1000 * 60 * 60 *24]}}}).match(filtros)
    .limit(quantity)
    
    return results
}

module.exports = router