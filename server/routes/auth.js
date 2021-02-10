const express = require('express');
const router = express.Router();
// db
const mongoose = require('mongoose');
const User = mongoose.model('User');
// encrypt
const bcrypt = require('bcrypt');
const saltRounds = 2;
// jwt
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
// middleware
const checkLogin = require('../middleware/checkLogin')

router.get('/', (req, res) => {
    res.send("hello world");
    res.end()
})
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        return res.status(422).json({
            error: "please add all the field"
        })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({
                    error: "Email is already used"
                })
            }
            bcrypt.hash(password, saltRounds, function (err, hashPassword) {
                if (err) console.log(err);
                console.log(hashPassword);
                const user = new User({
                    email,
                    name,
                    password: hashPassword
                })
                user.save(user)
                    .then(user => {
                        return res.status(200).json({
                            status: "success",
                            message: "saved successfully"
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            });

        })
        .catch(err => {
            console.log(err);
        })
})

router.get('/home',checkLogin,(req, res, next)=>{
    console.log(req.user);
})
router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({
            "error": "Fill the form"
        })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({
                    "error": "Email Not Found"
                })
            }
            bcrypt.compare(password, savedUser.password, function (err, result) {
                if (err) console.log(err);
                if (result === true) {
                    const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET, { expiresIn: '1h' })
                    res.status(200).json({
                        "status": "success",
                        "message": "signin success",
                        "token" : token
                    })
                } else {
                    res.status(422).json({
                        "status": "failure",
                        "message": "password not match"
                    })
                }
            });

        })
        .catch(err => {
            console.log(err);
        })

})
module.exports = router; 