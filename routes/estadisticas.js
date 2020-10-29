
const express= require("express")
const router= express.Router()
const authenticateJWT = require("../middlewares/jwt_auth")
const sanitize = require('mongo-sanitize');

router.use(authenticateJWT)

const Historial = require("../models/Historial")


router.get("/today", async (req, res) =>{
    const stats=await getStats(new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate())
    res.status(200).json(stats)
})
router.get("/:year/:month/:day", async (req, res) =>{
    //params
    const year=sanitize(req.params.year)
    const month=sanitize(req.params.month)
    const day=sanitize(req.params.day)
    
    const stats=await getStats(year, month, day)
    res.status(200).json(stats)
})

async function getStats(year, month, day){
    try{
        const filters={hora_year: {$eq: parseInt(year)}, hora_month: {$eq: parseInt(month)}, hora_day: {$eq: parseInt(day)}}
        
        
        //revisitas
        const countLlamadas= await Historial.countDocuments(filters)
        const countLlamadasWithTime=await Historial.countDocuments({...filters, tiempo: {$gt: 0}})
        const countPublicadores= await Historial.find(filters).distinct("publicador")
        const tiempo= await Historial.aggregate()
                                    .match(filters)
                                    .group({_id: null, "TotalTiempo": { $sum: "$tiempo"}})
        var sumTiempos = 0
        if (tiempo.length>0) sumTiempos=tiempo[0].TotalTiempo
        var tiempoPromedio=0
        if (sumTiempos!==0) tiempoPromedio=sumTiempos/countLlamadasWithTime
        
        const estudios= await Historial.aggregate()
                                        .match(filters)
                                        .project({_id:0, estudios: {$cond: [{$eq: ["$estado", 11]}, 1, 0] } })
                                        .group({_id:null, Estudios: { $sum: "$estudios"}})
        var sumEstudios=0
        if (estudios.length>0) sumEstudios=estudios[0].Estudios
        
        const buzones= await Historial.aggregate()
                                        .match(filters)
                                        .project({_id:0, buzones: {$cond: [{$eq: ["$estado", 12]}, 1, 0] } })
                                        .group({_id:null, Buzones: { $sum: "$buzones"}})
        var sumBuzones=0
        if (buzones.length>0) sumBuzones=buzones[0].Buzones

        const interesados= await Historial.aggregate()
                                        .match(filters)
                                        .project({_id:0, interesados: {$cond: [{$eq: ["$estado", 2]}, 1, 0] } })
                                        .group({_id:null, Interesados: { $sum: "$interesados"}})
        var sumInteresados=0
        if (interesados.length>0) sumInteresados=interesados[0].Interesados

        const paralelas= await Historial.aggregate()
                                        .match(filters)
                                        .project({_id:0, paralelas: {$cond: [{$eq: ["$tipo", 1]}, 1, 0] } })
                                        .group({_id:null, Paralelas: { $sum: "$paralelas"}})
        var sumParalelas=0
        if (paralelas.length>0) sumParalelas=paralelas[0].Paralelas

        const conversaciones= await Historial.aggregate()
                                        .match(filters)
                                        .project({_id:0, conversaciones: {$cond: [{$in: ["$estado", [2,6,1,3,7,8,10,11]]}, 1, 0] } })
                                        .group({_id:null, Conversaciones: { $sum: "$conversaciones"}})

        var sumConversaciones=0
        if (conversaciones.length>0) sumConversaciones=conversaciones[0].Conversaciones

        const receptivas= await Historial.aggregate()
                                        .match(filters)
                                        .project({_id:0, receptivas: {$cond: [{$in: ["$estado", [2,6,7,10,11]]}, 1, 0] } })
                                        .group({_id:null, Receptivas: { $sum: "$receptivas"}})

        var sumReceptivas=0
        if (receptivas.length>0) sumReceptivas=receptivas[0].Receptivas

        const revisitas= await Historial.aggregate()
                                        .match(filters)
                                        .project({_id:0, revisitas: {$cond: [{$in: ["$estado", [7,8,11]]}, 1, 0] } })
                                        .group({_id:null, Revisitas: { $sum: "$revisitas"}})

        var sumRevisitas=0
        if (revisitas.length>0) sumRevisitas=revisitas[0].Revisitas

        const stats={
            llamadas: countLlamadas,
            publicadores: countPublicadores.length,
            duracion: Math.round(tiempoPromedio,0),
            estudios: sumEstudios,
            buzones: sumBuzones,
            nueva_revisita_primera_visita: sumInteresados,
            conversaciones_paralelas: sumParalelas,
            conversaciones: sumConversaciones,
            conversaciones_receptivas: sumReceptivas,
            revisitas: sumRevisitas
        }
        return stats
    }catch(err){
        return {
            llamadas: 0,
            publicadores: 0,
            duracion: 0,
            estudios: 0,
            buzones: 0,
            nueva_revisita_primera_visita: 0,
            conversaciones_paralelas: 0,
            conversaciones: 0,
            conversaciones_receptivas: 0,
            revisitas: 0
        }
    }
}

module.exports = router