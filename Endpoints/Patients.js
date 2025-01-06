const express = require('express')

const patientSchema = require('../Models/Patients')
const app = express();
const router = express.Router();

const options = {
    page: 1,
    limit: 12,
    collation: {
        locale: 'en'
    },
}

// GET TODOS LOS PACIENTES //
router.get('/pacientes', (req, res) => {
    const { limit, page } = req.query
    patientSchema
        .find()
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// GET PACIENTES POR ID //
router.get('/pacientes/id/:id', (req, res) => {
    const id = req.params.id
    patientSchema
        .find({ _id: id })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// GET PACIENTES POR NOMBRE //
router.get('/pacientes/name/:name', (req, res) => {
    const name = req.params.name
    patientSchema
        .find({ nombres: { $regex: name, $options: "i" } })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// POST UN NUEVO PACIENTE ////////
router.post('/pacientes/add', (req, res) => {
    const paciente = patientSchema(req.body)
    paciente
        .save()
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// POST UN HISTORIAL MEDICO //
router.post('/pacientes/historial/post/:id', (req, res) => {
    const patientId = req.params.id;

    const {
        condicion,
        notas,
    } = req.body;

    const nuevoHistorial = {
        condicion,
        notas,
        fechaDiagnostico: new Date(),
    };

    patientSchema.findByIdAndUpdate(
            patientId, { $push: { historialMedico: nuevoHistorial } }, { new: true, runValidators: true }
        )
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }
            res.json({ message: 'Historial agregado exitosamente', data });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error agregando el historial', detalles: error.message });
        });
});

// POST UNA VISITA AL MEDICO //
router.post('/pacientes/visitas/post/:id', (req, res) => {
    const patientId = req.params.id;

    const {
        medico,
        notas,
        recetas
    } = req.body;

    const nuevaVisita = {
        fechaVisita: new Date(),
        medico,
        notas,
        recetas,
    };

    patientSchema.findByIdAndUpdate(
            patientId, { $push: { visitas: nuevaVisita } }, { new: true, runValidators: true }
        )
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }
            res.json({ message: 'Visita agregada exitosamente', data });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error agregando la visita', detalles: error.message });
        });
});

// POST UN MEDICAMENTO //
router.post('/pacientes/medicamentos/post/:id', (req, res) => {
    const patientId = req.params.id;

    const {
        nombre,
        dosis,
        frecuencia,
        fechaInicio,
        fechaFin
    } = req.body;

    const nuevoMedicamento = {
        nombre,
        dosis,
        frecuencia,
        fechaInicio: fechaFin || new Date(),
        fechaFin: fechaFin || null
    };

    patientSchema.findByIdAndUpdate(
            patientId, { $push: { medicamentos: nuevoMedicamento } }, { new: true, runValidators: true }
        )
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }
            res.json({ message: 'Medicamento agregado exitosamente', data });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error agregando el medicamento', detalles: error.message });
        });
});

// POST UN SEGURO //
router.post('/pacientes/seguro/post/:id', (req, res) => {
    const patientId = req.params.id;

    const {
        proveedor,
        numeroPoliza,
        detallesCobertura
    } = req.body;

    const nuevoSeguro = {
        proveedor,
        numeroPoliza,
        detallesCobertura
    };

    patientSchema.findByIdAndUpdate(
            patientId, { $set: { seguro: nuevoSeguro } }, { new: true, runValidators: true }
        )
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }
            res.json({ message: 'Seguro agregado exitosamente', data });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error agregando el seguro', detalles: error.message });
        });
});

// POST UN CONTACTO DE EMERGENCIA //
router.post('/pacientes/emergencia/post/:id', (req, res) => {
    const patientId = req.params.id;

    const {
        nombre,
        relacion,
        telefono
    } = req.body;

    const nuevoContactoEmergencia = {
        nombre,
        relacion,
        telefono
    };

    patientSchema.findByIdAndUpdate(
            patientId, { $push: { contactoEmergencia: nuevoContactoEmergencia } }, { new: true, runValidators: true }
        )
        .then((data) => {
            if (!data) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }
            res.json({ message: 'Seguro agregado exitosamente', data });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error agregando el contacto de emergencia', detalles: error.message });
        });
});

// DELETE UN PACIENTE ///////////
router.delete('/pacientes/delete/:id', (req, res) => {
    const id = req.params.id
    patientSchema
        .deleteOne({ _id: id })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// UPDATE UN PACIENTE //////
router.put('/pacientes/put/:id', (req, res) => {
    const id = req.params.id;

    const {
        nombres,
        apellidos,
        fechaNacimiento,
        genero,
        estadoCivil,
        contacto,
        historialMedico,
        alergias,
        medicamentos,
        contactoEmergencia,
        seguro,
        visitas,
        estado
    } = req.body;

    patientSchema.updateOne({ _id: id }, {
            $set: {
                nombres,
                apellidos,
                fechaNacimiento,
                genero,
                estadoCivil,
                contacto,
                historialMedico,
                alergias,
                medicamentos,
                contactoEmergencia,
                seguro,
                visitas,
                estado,
                actualizadoEn: new Date()
            }
        })
        .then((data) => {
            if (data.matchedCount === 0) {
                return res.status(404).json({ message: 'Paciente no encontrado' });
            }
            res.json({ message: 'Paciente actualizado exitosamente', data });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Error actualizando el paciente', detalles: error.message });
        });
});

module.exports = router;


/* const express = require('express')

// eslint-disable-next-line
const productsSchema = require('./models/Products')
const app = express();
const router = express.Router();

function capitalize(text) {
    const firstLetter = text.charAt(0);
    const rest = text.slice(1);
    return firstLetter.toUpperCase() + rest;
}


///////////////////////////
// GET PRODUCT BY NAME //
router.get('/products/:productName', (req, res) => {
    const PARAMS = capitalize(req.params.productName)
    productsSchema
        .find({
            'productName': PARAMS
        })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

///////////////////////////
// GET PRODUCT BY PRICE //
router.get('/products/price-range', (req, res) => {
    const { minPrice, maxPrice } = req.query
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);

    productsSchema
        .find({
            productPrice: { $gte: min, $lte: max }
        })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

///////////////////////////

///////////////////////////
// GET PRODUCT BY TAG //
router.get('/products/tag/:productTag', (req, res) => {
    productsSchema
        .find({
            'productTag': `${req.params.productTag}`
        })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

///////////////////////////
// GET A PRODUCT BY ID ///
router.get('/products/id/:id', (req, res) => {
    const id = req.params.id
    productsSchema
        .find({ _id: id })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

/////////////////////////////////
// GET A PRODUCT BY CATEGORY ///
router.get('/products/category/:category', (req, res) => {
    const Category = req.params.category
    productsSchema
        .find({
            'productCategory': `${Category}`
        })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

/////////////////////////////////
// GET A PRODUCT BY OFFER ///
router.get('/products/offer/:bool', (req, res) => {
    const offer = req.params.bool
    productsSchema
        .find({ "productOffer": offer })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

///////////////////////////

///////////////////////////

///////////////////////////

/////////////////////////// 

module.exports = router; */