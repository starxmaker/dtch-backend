const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);

const HistorialSchema=mongoose.Schema({
    id_numero: {
        type: Number,
        required: true
    },
    tiempo: {
        type: Number,
        default: 0
    },
    tipo: {
        type:Number,
        default:0
    },
    
    estado: {
        type: Number,
        default: 0
    },
    
    publicador: {
        type: Number,
        default: 0
    },
    hora_year:{
        type:Number,
        default: new Date().getFullYear()
    },
    hora_month:{
        type:Number,
        default: new Date().getMonth()+1
    },
    hora_day:{
        type:Number,
        default: new Date().getDate()
    },
    hora_hour:{
        type:Number,
        default: new Date().getHours()
    },
    hora_minute:{
        type:Number,
        default: new Date().getMinutes()
    },
    hora_second:{
        type:Number,
        default: new Date().getSeconds()
    }
    
})

HistorialSchema.plugin(AutoIncrement, {inc_field: 'idHistorial', start_seq: 1000});

module.exports= mongoose.model("historials", HistorialSchema)