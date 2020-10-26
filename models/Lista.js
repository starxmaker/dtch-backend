const mongoose = require("mongoose")

const ListaSchema=mongoose.Schema({
    lista: {
        type: Array,
        default: []
    },
    historial:{
        type: Array,
        default: []
    },
    fecha_year: {
        type: Number,
        default: new Date().getFullYear()
    },
    fecha_month:{
        type:Number,
        default: new Date().getMonth()+1
    },
    fecha_day:{
        type:Number,
        default: new Date().getDate()
    }
    
})


module.exports= mongoose.model("listas", ListaSchema)