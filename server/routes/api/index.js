const express = require('express');
const router = new express.Router();
const users = require('./users');
// this is where all the routes will be in 

router.use('/users', users);



router.use('/', (req, res) => {
    res.json({
      title: 'Split It',
      description: 'A web based server that could also be accessed on mobile to help split bills or payments.',
    });
  });



  module.exports = router;