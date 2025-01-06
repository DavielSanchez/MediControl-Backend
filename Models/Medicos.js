const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const MedicosSchema = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
    },
    especialidad: {
        type: String,
        trim: true,
    },
    telefono: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
    },
    direccion: {
        type: String,
        trim: true,
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo'],
        default: 'activo',
    },
    fechaRegistro: {
        type: Date,
        default: Date.now,
    },
    creadoPor: [{
        nombre: { type: String },
        rol: { type: String },
    }],
});

MedicosSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Medicos', MedicosSchema);