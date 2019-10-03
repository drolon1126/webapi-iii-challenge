const express = require('express');

const userDb = require('./userDb.js');
const postDb = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  userDb.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'There was an error while saving the user to the database.' })
    });

});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // {text:'whatever"} - req.body
  const postObject = req.body;
  postObject.user_id = req.params.id;
  postDb.insert(postObject)
   .then(post=>{
     res.status(201).json(post);
   })
   .catch(()=>{
    res.status(500).json({ errorMessage: 'There was an error while saving the post to the database.' });
   });



});

router.get('/', (req, res) => {
  userDb.get()
    .then(users=>{
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({ error: "The users information could not be retrieved." });
    });

});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  userDb.getUserPosts(req.params.id)
    .then(posts=>{
      res.status(200).json(posts);
    })
    .catch(()=>{
      res.status(500).json({ error: "The user post information could not be retrieved." });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  userDb.remove(req.params.id)
    .then(()=>{
      res.status(200).json(req.user);
    })
    .catch(()=>{
      res.status(500).json({ error: "The user could not be removed." });
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  userDb.update(req.params.id,req.body)
    .then(ud=>{
      userDb.getById(req.params.id)
        .then(user=>{
          res.status(200).json(user);
        })
        .catch(()=>{
          res.status(400).json({ errorMessage: "invalid user id" });    
        });
    })
    .catch(()=>{
      res.status(500).json({ error: "The user information could not be modified." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  userDb.getById(req.params.id)
    .then(user=>{
      if(!user)
        res.status(404).json({errorMessage: 'Id does not exist'})
      req.user = user;
      next();
    })
    .catch(()=>{
      res.status(400).json({ errorMessage: "invalid user id" });
    });
};

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ errorMessage: "Missing user data" });
  } else {
    if (!req.body.name){
      res.status(400).json({ errorMessage: "Please provide a name" });
    } else {
      next();
    }
  }
};

function validatePost(req, res, next) {
  if(!req.body){
    res.status(400).json({ errorMessage: "Missing post data" });
  } else{
    if(!req.body.text){
      res.status(400).json({ errorMessage: "Please provide a text" });
    } else {
      next();
    }
  }
};

module.exports = router;
