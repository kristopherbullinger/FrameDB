const { getDb } = require('../util/db.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//app.use("/auth") =>

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await getDb().collection("users").findOne({username});
  console.log(user);
  if (user) {
    const authenticated = await bcrypt.compare(password, user.password);
    console.log(authenticated);
    if (authenticated) {
      return res.redirect("/");
    }
    return res.status(401).send();
  }
  return res.status(401).send();
});


module.exports = router;
