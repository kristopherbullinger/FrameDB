const express = require('express');
const router = express.Router();

const { getDb } = require('../../util/db.js');

//app.use("dev/tekken7") =>

router.get("/", (req, res, next) => {
  res.status(200).setHeader("Content-Type", "application/json");
  let cursor = getDb().collection("characters").find({}, {projection: {_id: 0}});
  cursor.toArray( (err, chars) => res.send(chars));
});

router.get("/:char/:tag?", (req, res, next) => {
  const {char, tag} = req.params;
  res.status(200).setHeader("Content-Type", "application/json");
  getDb().collection("characters").findOne({label: char}, {projection: {_id: 0}}).then(char => res.send(char));
});

module.exports = router;
