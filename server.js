const express = require('express');
const helmet = require('helmet');

// const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.use(logger);
server.use(helmet());
server.use(express.json());
server.use('/api/users', userRouter);


server.get('/', logger, userRouter, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {

  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`)

  next();
};


module.exports = server;
