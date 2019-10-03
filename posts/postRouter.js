const express = require('express');

const postDb = require('./postDb.js');

const router = express.Router();

router.get('/', (req, res) => {
  postDb.get()
    .then(posts=>{
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(500).json({ error: "The posts information could not be retrieved." });
    });
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id',validatePostId, (req, res) => {
  postDb.remove(req.params.id)
    .then(()=>{
      res.status(200).json(req.post);
    })
    .catch(()=>{
      res.status(500).json({ error: "The post could not be removed." });
    });
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  postDb.update(req.params.id,req.body)
    .then(pd=>{
      postDb.getById(req.params.id)
        .then(post=>{
          res.status(200).json(post);
        })
        .catch(()=>{
          res.status(400).json({ errorMessage: "invalid post id" });    
        });
    })
    .catch(()=>{
      res.status(500).json({ error: "The user information could not be modified." });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  postDb.getById(req.params.id)
    .then(post=>{
      if(!post)
        res.status(404).json({errorMessage: 'Id does not exist'})
      req.post = post;
      next();
    })
    .catch(()=>{
      res.status(400).json({ errorMessage: "invalid post id" });
    });
};

function validatePost(req, res, next) {
  if(!req.body)
    res.status(400).json({ errorMessage: "Missing post data" });
  if(!req.body.text)
    res.status(400).json({ errorMessage: "Please provide a text" });
  
  req.body.user_id = req.params.id;
  next();
};

module.exports = router;