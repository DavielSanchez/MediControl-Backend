const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Clave secreta (idealmente almacenada en una variable de entorno)
const SECRET_KEY = process.env.JWT_SECRET || 'miClaveSecreta';

// Modelo de usuario (ajústalo según tu modelo real)
const userSchema = require('../Models/User');

// Ruta de login
router.post('/login', async(req, res) => {
    const { username, userPassword } = req.body;

    try {
        // Verificar si el usuario existe

        const user = await userSchema.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });

        }
        if (user.userAccountStatus == 'suspendido') {
            return res.status(401).json({ message: 'Acceso denegado' });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword); // Método definido en el modelo
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Crear token
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role, name: user.name },
            SECRET_KEY, { expiresIn: '5h' } // Token válido por 5 horas
        );

        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});

module.exports = router;