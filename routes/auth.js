const { getDb } = require('../util/db.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const characters = require('../util/chars.js');
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../env.js');

//app.use("/auth") =>

router.post("/login", async (req, res, next) => {
  const { username, password, location } = req.body;
  const user = await getDb().collection("users").findOne({username});
  if (user) {
    const authenticated = await bcrypt.compare(password, user.password);
    if (authenticated) {
      req.session.loggedIn = true;
      req.session.username = user.username;
      req.session.userId = user._id;
      return res.redirect("/");
    }
  }
  return res.redirect("/tekken7");
});

router.get("/logout", async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
});

router.get("/generate-token", (req, res, next) => {
  if (!req.session.loggedIn) return res.redirect("/");
  let token = jwt.sign({referrer_id: req.session.userId}, jwt_secret, {expiresIn: 60 * 20});
  res.send({token});
});

router.get("/signup", (req, res, next) => {
  let { token } = req.query;
  res.send(jwt.verify(token, jwt_secret));
  // let token =
});


module.exports = router;
