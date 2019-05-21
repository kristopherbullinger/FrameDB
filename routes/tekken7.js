const express = require('express');
const router = express.Router();

const characters = require('../util/chars.js');
const { getDb } = require('../util/db.js');

// app.use("/tekken7") =>

router.get("/", (req,res,next) => {
  res.render("index.ejs", {characters, character: null})
});

router.get("/:char/:tag?", (req, res, next) => {
  let {char, tag} = req.params;
  char = char.toLowerCase();
  if (!characters.find(c => c.label === char)) next();
  getDb().collection("characters").findOne({label: char}).then(character => {
    res.render('characterTable.ejs', {characters, character: character})
  })
});

router.post("/:char", (req, res, next) => {
  const { char } = req.params;
  const updateFields = req.body;

  //generate update object for database
  const dynamicUpdate = {};
  Object.keys(updateFields).forEach(key => dynamicUpdate[`movelist.$[move].${key}`] = updateFields[key]);

  getDb().collection("characters").updateOne({label: char}, {$set: dynamicUpdate}, {arrayFilters: [{"move.notation": updateFields.notation}]})
  .then(ll => res.status(202).send());
});

module.exports = router;
