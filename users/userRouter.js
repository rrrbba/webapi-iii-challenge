const express = require('express');

const router = express.Router();

const db = require('./userDb');
const postdb = require('../posts/postDb');


router.post('/', validateUser, (req, res) => {
    const newUser = req.body;

    db.insert(newUser)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({ error: "POST FAILED!" })
    })
});

router.post('/:id/posts', validateUserId, (req, res) => {
    const newPost = req.body;

    postdb.insert(newPost)
    .then(post => {
        res.status(200).json(post);
    })
    .catch(err => {
        res.status(500).json({ error: "POST FAILED!" })
    })
});

router.get('/', (req, res) => {
    db.get()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({ error: "GET FAILED!"})
        })
});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id;

    db.getById(id)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({ error: "GET FAILED!"})
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
    const id = req.params.id;

    db.getUserPosts(id)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({ error: "GET FAILED!"})
    })
    
});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id;

    db.getById(id) //find the user by id
    .then(user => {
        db.remove(id) //then remove said user
        .then(list => { //the user is removed from the list of users
            res.status(200).json(user); //return the deleted user
        })
        .catch(err => {
            res.status(500).json({ error: "DELETE FAILED!"})
        })
    })
});

router.put('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    const newPost = req.body;

        db.update(id, newPost)
        .then(update => {
            res.status(200).json(update);
        })
        .catch(err => {
            res.status(500).json({ error: "UPDATE FAILED!"})
        })
    
});

//custom middleware

function validateUserId(req, res, next) {
    const id = req.params.id;

    db.getById(id)
    .then(user => {
        if(user){ //if theres an id
            next();
        } else {
            res.status(404).json({ message: "GIVE ME AN ID!" })
        }
    })
    .catch(err => {
        res.status(400).json({ message: "Invalid user id!"})
    })
};

function validateUser(req, res, next) {
    if(!req.body){
        res.status(400).json({ message: "Missing user data."})
    } else if (!req.body.name){
        res.status(400).json({ message: "Missing required name field"});
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    if(!req.body){
        res.status(400).json({ message: "Missing post data."})
    } else if (!req.body.name){
        res.status(400).json({ message: "Missing required text field"});
    } else {
        next();
    }
};


module.exports = router;
