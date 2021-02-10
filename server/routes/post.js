const express = require('express');
const router = express.Router();
// middleware
const checkLogin = require('../middleware/checkLogin');
// mongo
const mongoose = require('mongoose');
const Post = mongoose.model("Post")

router.get('/mypost', checkLogin, (req, res, next) => {
    console.log({ posttedBy: req.user._id });
    Post.find({ posttedBy : req.user._id })
        .populate("posttedBy", "_id name")
        .then(result => {
            res.status(200).json({
                myposts: result
            })
        })
        .catch(err => {
            console.log(err);
        });
})

router.get('/allpost', checkLogin, (req, res, next) => {
    Post.find()
        .populate("posttedBy", "_id name")
        .then((result) => {
            return res.status(200).json({ posts: result })
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/createpost', checkLogin, (req, res, next) => {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(422).json({
            "status": "error",
            "message": "Please add all the fields"
        });
    }
    const post = new Post({
        title,
        body,
        posttedBy: req.user
    })
    post.save()
        .then(result => {
            res.json({ post: result })
        })
        .catch(err => {
            console.log(err);
        })

});

module.exports = router;