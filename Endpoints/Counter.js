const express = require('express')

const MedicosSchema = require('../Models/Medicos')
const patientSchema = require('../Models/Patients')
const userSchema = require('../Models/User')
    //More tables//

const app = express();
const router = express.Router();

router.get('/counter', async(req, res) => {
    try {
        const Medicos = await MedicosSchema.countDocuments();
        const Pacientes = await patientSchema.countDocuments();
        const Users = await userSchema.countDocuments();

        res.json({
            Medicos: Medicos,
            Pacientes: Pacientes,
            Users: Users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las cantidades de documentos.' });
    }
});


module.exports = router;