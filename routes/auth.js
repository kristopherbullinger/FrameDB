const { getDb } = require('../util/db.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const characters = require('../util/chars.js');

//app.use("/auth") =>

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await getDb().collection("users").findOne({username});
  if (user) {
    const authenticated = await bcrypt.compare(password, user.password);
    if (authenticated) {
      req.session.loggedIn = true;
      return res.redirect("/");
    }
    return res.status(401).send();
  }
  return res.status(401).send();
});

router.get("/logout", async (req, res, next) => {
  await req.session.destroy();
  res.redirect("/");
});


module.exports = router;
