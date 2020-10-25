const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);

const PublicadorSchema=mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    grupo: {
        type: Number,
        default: 0
    },
    invitado: {
        type: Number,
        default:1
    }
    
})

PublicadorSchema.plugin(AutoIncrement, {inc_field: 'idPublicador', start_seq: 1000});

module.exports= mongoose.model("publicadores", PublicadorSchema)