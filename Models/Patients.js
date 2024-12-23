const { default: mongoose, Schema } = require("mongoose");
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
    nombres: { type: String, },
    apellidos: { type: String, },
    segundoNombre: { type: String },
    fechaNacimiento: { type: Date, },
    genero: { type: String, enum: ['masculino', 'femenino'], },
    estadoCivil: { type: String, enum: ['soltero', 'casado', 'divorciado', 'viudo'], default: 'soltero' },
    contacto: {
        telefono: { type: String, },
        correo: { type: String, , unique: true },
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
    creadoEn: { type: Date, default: Date.now },
    actualizadoEn: { type: Date, default: Date.now },
});

PacienteSchema.pre('save', function(next) {
    this.actualizadoEn = Date.now();
    next();
});

module.exports = mongoose.model('Patient', patientSchema, 'Patient');