const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');

// eslint-disable-next-line
const userSchema = require('../Models/User')
const app = express();
const router = express.Router();

// GET ALL THE USER //
router.get('/users', (req, res) => {
    userSchema
        .find()
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// GET USERS BY NAME //
router.get('/users/name/:name', (req, res) => {
    const name = req.params.name
    userSchema
        .find({ name: { $regex: name, $options: "i" } })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// GET USERS BY ID //
router.get('/users/id/:id', (req, res) => {
    const id = req.params.id
    userSchema
        .find({ _id: id })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// POST A USER ////////
router.post('/users/add', (req, res) => {
    const user = new userSchema(req.body);
    user.save()
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ message: 'Error saving user', error });
        });
});

///////////////////////////
// UPDATE A USER //////
router.put('/users/put/:id', async(req, res) => {
    const id = req.params.id
    const {
        username,
        name,
        role,
        userAccountStatus,
    } = userSchema(req.body)
    userSchema
        .updateOne({ _id: id }, {
            $set: {
                username,
                name,
                role,
                userAccountStatus,
            }
        })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

/////////////////////////////////////////////////////
// UPDATE THE PASSWORD OF AN USER WITH THE UID //////
router.put('/users/put/password/:id', async(req, res) => {
    const id = req.params.id
    const {
        userPassword
    } = userSchema(req.body)
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    userSchema
        .updateOne({ _id: id }, {
            $set: {
                userPassword: hashedPassword,
                updated_at: new Date()
            }
        })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

// ///////////////////////////
// DELETE A USER ///////////
router.delete('/users/delete/:id', (req, res) => {
    const id = req.params.id
    userSchema
        .deleteOne({ _id: id })
        .then((data) => {
            res.json(data)
        })
        .catch((error) => {
            console.error(error)
        })
})

module.exports = router;