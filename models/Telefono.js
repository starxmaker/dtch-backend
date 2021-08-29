const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);

const TelefonoSchema=mongoose.Schema({
    direccion: {
        type: String,
        required: true
    },
    codigo_pais: {
        type: Number,
        default: 0
    },
    codigo_region: {
        type: Number,
        default: 0
    },
    numero: {
        type: String,
        required: true,
        unique: true
    },
    grupo: {
        type: Number,
        default: 0
    },
    fuente: {
        type: Number,
        required: true
    },
    estado: {
        type: Number,
        default: 0
    },
    tipo: {
        type: Number,
        default: 0
    },
    publicador: {
        type: Number,
        default: 0
    },
    ultima_llamada_year: {
        type: Number,
        default: 2020
    },
    ultima_llamada_month: {
        type: Number,
        default: 1
    },
    ultima_llamada_day: {
        type: Number,
        default: 1
    },
    ultima_llamada_hour: {
        type: Number,
        default: 1
    },
    ultima_llamada_minute: {
        type: Number,
        default: 1
    },
    ultima_llamada_second: {
        type: Number,
        default: 1
    },
    ultima_visualizacion_year:{
        type:Number,
        default: new Date().getFullYear()
    },
    ultima_visualizacion_month:{
        type:Number,
        default: new Date().getMonth()+1
    },
    ultima_visualizacion_day:{
        type:Number,
        default: new Date().getDate()
    },
    ultima_visualizacion_hour:{
        type:Number,
        default: new Date().getHours()
    },
    ultima_visualizacion_minute:{
        type:Number,
        default: new Date().getMinutes()
    },
    ultima_visualizacion_second:{
        type:Number,
        default: new Date().getSeconds()
    },
    reservedUser : {
        type: String
    }
    
})

TelefonoSchema.plugin(AutoIncrement, {inc_field: 'idTelefono', start_seq: 10000});

module.exports= mongoose.model("telefonos", TelefonoSchema)