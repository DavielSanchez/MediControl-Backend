const express = require('express')

const MedicosSchema = require('../Models/Medicos')
const app = express();
const router = express.Router();

const options = {
    page: 1,
    limit: 12,
    collation: {
        locale: 'en'
    },
}

// GET TODOS LOS MEDICOS //
router.get('/medicos', (req, res) => {
    const { limit, page } = req.query
    MedicosSchema
        .find()
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// GET MEDICO POR ID //
router.get('/medicos/id/:id', (req, res) => {
    const id = req.params.id
    MedicosSchema
        .find({ _id: id })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// GET MEDICOS POR NOMBRE //
router.get('/medicos/name/:name', (req, res) => {
    const name = req.params.name
    MedicosSchema
        .find({ nombre: { $regex: name, $options: "i" } })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// GET MEDICOS POR ESPECIALIDAD //
router.get('/medicos/especialidad/:name', (req, res) => {
    const name = req.params.name
    MedicosSchema
        .find({ especialidad: { $regex: name, $options: "i" } })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// POST UN NUEVO MEDICO ////////
router.post('/medicos/add', (req, res) => {
    const medico = MedicosSchema(req.body)
    medico
        .save()
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// UPDATE UN MEDICO //////
router.put('/medicos/put/:id', (req, res) => {
    const id = req.params.id;

    const {
        nombre,
        especialidad,
        telefono,
        email,
        direccion,
        estado,
    } = req.body;

    MedicosSchema.updateOne({ _id: id }, {
            $set: {
                nombre,
                especialidad,
                telefono,
                email,
                direccion,
                estado,
                fechaRegistro: new Date()
            }
        })
        .then((data) => {
            if (data.matchedCount === 0) {
                return res.status(404).json({ message: 'Medico no encontrado' });
            }
            res.json({ message: 'Medico actualizado exitosamente', data });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error actualizando el Medico', detalles: error.message });
        });
});

// DELETE UN MEDICO ///////////
router.delete('/medicos/delete/:id', (req, res) => {
    const id = req.params.id
    MedicosSchema
        .deleteOne({ _id: id })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

module.exports = router;