const fs = require('fs');
const path = ('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const { getDb } = require('./util/db.js');
const characters = require('./util/chars.js');
const { inputValidator } = require('./util/helpers.js');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static("public"));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get("/", (req, res, next) => {
  res.redirect("/tekken7");
});

app.get("/dev/tekken7", (req, res, next) => {
  res.status(200).setHeader("Content-Type", "application/json");
  let cursor = getDb().collection("characters").find({}, {projection: {_id: 0}});
  cursor.toArray( (err, chars) => res.send(chars));
})

app.get("/dev/tekken7/:char/:tag?", (req, res, next) => {
  const {char, tag} = req.params;
  res.status(200).setHeader("Content-Type", "application/json");
  getDb().collection("characters").findOne({label: char}, {projection: {_id: 0}}).then(char => res.send(char));
});

app.get("/tekken7", (req,res,next) => {
  res.render("index.ejs", {characters, character: null})
});

app.get("/tekken7/:char/:tag?", (req, res, next) => {
  let {char, tag} = req.params;
  char = char.toLowerCase();
  if (!characters.find(c => c.label === char)) next();
  getDb().collection("characters").findOne({label: char}).then(character => {
    res.render('characterTable.ejs', {characters, character: character})
  })
});

app.post("/tekken7/:char", (req, res, next) => {
  const { char } = req.params;
  const updateFields = req.body;

  //generate update object for database
  const dynamicUpdate = {};
  Object.keys(updateFields).forEach(key => dynamicUpdate[`movelist.$[move].${key}`] = updateFields[key]);
  
  getDb().collection("characters").updateOne({label: char}, {$set: dynamicUpdate}, {arrayFilters: [{"move.notation": updateFields.notation}]})
  .then(ll => res.status(202).send());
});

app.use("/", (req, res) => {
  res.status(404).send("<h1>Bad Request</h1>");
})
app.listen(3000);
