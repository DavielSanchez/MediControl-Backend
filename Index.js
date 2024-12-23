const express = require('express')
const dotenv = require('dotenv')
const { mongoConnection } = require('./DB')
const cors = require('cors')
    // const port = 3000

// // External routes //
// const Categories = require('./Endpoints/Categories')
// const Products = require('./Endpoints/Products')
// const Reviews = require('./Endpoints/Reviews')
const Users = require('./Endpoints/User')
const Login = require('./Endpoints/Login')
    // const ShoppingCart = require('./Endpoints/ShoppingCart')
    //     ////////////////////

// Server run //
const app = express()


////////////////


dotenv.config();
mongoConnection(process.env.MONGODB_URI);


// // MIDDLEWARES //
app.use(cors())
    // app.use(cors({
    //     origin: 'http://localhost:5173',
    //     methods: ['GET', 'POST'],
    // }));
app.use(express.json())
    // app.use('/', Categories)
    // app.use('/', Products)
    // app.use('/', Reviews)
app.use('/', Users)
app.use('/', Login)
    // app.use('/', ShoppingCart)

// ////////////////

app.get('/', (req, res) => {
    res.json({
        response: 'success'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`App corriendo en http://localhost:${process.env.PORT}`);
})