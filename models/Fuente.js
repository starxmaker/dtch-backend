const mongoose = require("mongoose")
const AutoIncrement = require('mongoose-sequence')(mongoose);

const FuenteSchema=mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: "grey"
    },
    descripcion: {
        type: String,
        default: ""
    }
    
})

FuenteSchema.plugin(AutoIncrement, {inc_field: 'idFuente', start_seq: 1000});

module.exports= mongoose.model("fuentes", FuenteSchema)