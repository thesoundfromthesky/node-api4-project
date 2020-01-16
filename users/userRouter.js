const express = require("express");
const users = require("./userDb");
const posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  // do your magic!
  users
    .insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      if (err.errno === 19) {
        res.status(409).json({ error: "Duplicate Id" });
      } else {
        res.status(500).json({ error: "Internal Error" });
      }
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  // do your magic!
  req.body.user_id = req.user.id;
  posts
    .insert(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ error: "Internal error" });
    });
});

router.get("/", (req, res) => {
  // do your magic!
  users.get().then(users => {
    res.status(200).json(users);
  });
});

router.get("/:id", validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  users.getUserPosts(req.user.id).then(posts => {
    res.status(200).json(posts);
  });
});

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
  users.remove(req.user.id).then(isDeleted => {
    res.sendStatus(204);
  });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  // do your magic!
  users.update(req.user.id, req.body).then(isUpdated => {
    users.getById(req.user.id).then(user => {
      res.status(200).json(user);
    });
  });
});

//custom middleware
// - `validateUserId()`

//   - `validateUserId` validates the user id on every request that expects a user id parameter
//   - if the `id` parameter is valid, store that user object as `req.user`
//   - if the `id` parameter does not match any user id in the database,
//     cancel the request and respond with status `400` and `{ message: "invalid user id" }`
function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  users.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  });
}

// - `validateUser()`

//   - `validateUser` validates the `body` on a request to create a new user
//   - if the request `body` is missing, cancel the request and respond with status `400` and `{ message: "missing user data" }`
//   - if the request `body` is missing the required `name` field, cancel the request and respond with status `400` and `{ message: "missing required name field" }`
function validateUser(req, res, next) {
  // do your magic!
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

// - `validatePost()`
//   - `validatePost` validates the `body` on a request to create a new post
//   - if the request `body` is missing, cancel the request and respond with
//     status `400` and `{ message: "missing post data" }`
//   - if the request `body` is missing the required `text` field,
//     cancel the request and respond with status `400` and `{ message: "missing required text field" }`
function validatePost(req, res, next) {
  // do your magic!
  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
