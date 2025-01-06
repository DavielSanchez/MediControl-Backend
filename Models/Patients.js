const { default: mongoose, Schema } = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')

const patientSchema = new mongoose.Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    genero: { type: String, enum: ['masculino', 'femenino'], },
    documentoIdentidad: { type: String, unique: true },
    estadoCivil: { type: String, enum: ['soltero', 'casado', 'divorciado', 'viudo'], default: 'soltero' },
    contacto: {
        telefono: { type: String, },
        correo: { type: String },
        direccion: {
            calle: { type: String, },
            ciudad: { type: String, },
            estado: { type: String, },
            codigoPostal: { type: String, },
            pais: { type: String, },
        },
    },
    historialMedico: [{
        condicion: { type: String, },
        fechaDiagnostico: { type: Date },
        notas: { type: String },
    }, ],
    alergias: [{ type: String }],
    medicamentos: [{
        nombre: { type: String, },
        dosis: { type: String },
        frecuencia: { type: String },
        fechaInicio: { type: Date },
        fechaFin: { type: Date },
    }, ],
    contactoEmergencia: {
        nombre: { type: String, },
        relacion: { type: String, },
        telefono: { type: String, },
    },
    seguro: {
        proveedor: { type: String },
        numeroPoliza: { type: String },
        detallesCobertura: { type: String },
    },
    visitas: [{
        fechaVisita: { type: Date, default: Date.now },
        medico: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' },
        notas: { type: String },
        recetas: [{
            nombre: { type: String },
            dosis: { type: String },
            frecuencia: { type: String },
        }, ],
    }, ],
    estado: { type: String, enum: ['activo', 'inactivo', 'fallecido'], default: 'activo' },
    creadoPor: [{
        nombre: { type: String },
        rol: { type: String },
    }],
    creadoEn: { type: Date, default: Date.now },
    actualizadoEn: { type: Date, default: Date.now },
});

patientSchema.pre('save', function(next) {
    this.actualizadoEn = Date.now();
    next();
});

patientSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Patient', patientSchema, 'Patient');