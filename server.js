const express = require("express");
const userRoute = require("./users/userRouter");
const postRoute = require("./posts/postRouter");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/users", userRoute);
server.use("/api/posts", postRoute);



//custom middleware

// - `logger()`

//   - `logger` logs to the console the following information about each request: request method, request url, and a timestamp
//   - this middleware runs on every request made to the API
function logger(req, res, next) {
  console.log(
    `Request method: ${req.method}, Request url: ${
      req.url
    }, Timestamp: ${new Date().toISOString()}`
  );
  next();
}

module.exports = server;
