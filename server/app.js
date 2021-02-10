const express = require('express');
const app = express();
const PORT = 5000;
const cors = require('cors');
//db config
const { MONGOURI, JWT_SECRET } = require('./keys')
const mongoose = require('mongoose')

// model
require('./models/user')
require('./models/post')

// connect db
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected', () => {
    console.log("Connected to dbs")
})
mongoose.connection.on('error', (err) => {
    console.log("Error to connect dbs : ", err)
})

// route
const auth = require('./routes/auth')
const post = require('./routes/post')

app.use(cors())

app.use(express.json());

app.use(auth)
app.use(post)

app.listen(PORT, () => {
    console.log("server is running on ", PORT)
}) 