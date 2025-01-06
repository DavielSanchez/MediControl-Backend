const { default: mongoose, Schema } = require("mongoose");
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['administrador', 'asistente', 'medico', 'laboratorista'], required: true },
    userAccountStatus: { type: String, enum: ['activo', 'suspendido', 'pendiente'], default: 'activo' },
    lastLogin: { type: Date, required: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware para hash de contraseña
userSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('userPassword')) {
        const document = this;

        // Verificar si la contraseña existe antes de hacer el hash
        if (!document.userPassword) {
            return next(new Error('userPassword is required'));
        }

        bcrypt.hash(document.userPassword, saltRounds, (error, hashedPassword) => {
            if (error) {
                next(error);
            } else {
                document.userPassword = hashedPassword;
                next();
            }
        });
    } else {
        next();
    }
});

// Método para comparar contraseñas
userSchema.methods.isCorrectPassword = function(userPassword, callback) {
    bcrypt.compare(userPassword, this.userPassword, function(error, same) {
        if (error) {
            callback(error);
        } else {
            callback(null, same);
        }
    });
};

module.exports = mongoose.model('Users', userSchema, 'Users');