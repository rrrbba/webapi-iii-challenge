const express = require('express');

const router = express.Router();

const db = require('./userDb');
const postdb = require('../posts/postDb');


router.post('/', validateUser, (req, res) => {
    const newUser = req.body;

    db.get()
        .then(users => { //checking for if a user with the same name exists as the one in the req then send the 400 message
                if (users.find(item =>item.name === req.body.name)){
                    res.status(400).json({ error: "A user with this name already exists!"})
                }
        })
    db.insert(newUser)
    .then(user => {
        res.status(201).json(user);
    })
    .catch(err => {
        res.status(500).json({ error: "POST FAILED!" })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const text = req.body.text;
    const user = req.user.id; //not req.params.id because it's a string not a number like we want

    postdb.insert({text, user})
    .then(post => {
        res.status(201).json(post);
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

    res.status(200).json(req.user);

    // const id = req.params.id;
    // db.getById(id)
    // .then(user => {
    //     res.status(200).json(user);
    // })
    // .catch(err => {
    //     res.status(500).json({ error: "GET FAILED!"})
    // })
});


//GET POSTS BY THE ID OF THE USER
router.get('/:id/posts', validateUserId, (req, res) => {
    const id = req.user.id; //the user id

    db.getUserPosts(id)
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({ error: "GET FAILED!"})
    })
    
});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.user.id;

        db.remove(id) //then remove said user
        .then(list => { //the user is removed from the list of users
            res.status(204).json(req.user); //return the deleted user
        })
        .catch(err => {
            res.status(500).json({ error: "DELETE FAILED!"})
        })
   
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    const id = req.user.id;
    const newPost = req.body;

        db.update(id, newPost)
        .then(update => {
            db.getById(id)
            .then(userObj =>
            res.status(200).json(update));
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
            req.user = user;
            next();
        } else {
            res.status(404).json({ message: "GIVE ME AN ID!" })
        }
    })
    .catch(err => {
        res.status(500).json({ message: "Server error!"})
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
    } else if (!req.body.text){
        res.status(400).json({ message: "Missing required text field"});
    } else {
        next();
    }
};


module.exports = router;
