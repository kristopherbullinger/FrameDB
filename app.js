const fs = require('fs');
const path = ('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const { getDb, MONGODB_URI } = require('./util/db.js');
const characters = require('./util/chars.js');
const t7Router = require('./routes/tekken7.js');
const t7DevRouter = require('./routes/dev/tekken7.js');
const authRouter = require('./routes/auth.js');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const { appendLocalsToViews, inputValidator } = require('./util/helpers.js');

const store = new MongoDBStore({uri: MONGODB_URI, collection: "sessions"});

store.on("error", err => {
  console.log(err);
});

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static("public"));
app.use(express.json());
app.use(session({
  secret: "my_secret_string",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 7} //valid 1 wk
}));

//map session info to response object
app.use(appendLocalsToViews);

app.set('view engine', 'ejs');
app.set('views', './views');

app.get("/", (req, res, next) => {
  res.redirect("/tekken7");
});

app.use("/tekken7", t7Router);
app.use("/dev/tekken7", t7DevRouter);
app.use("/auth", authRouter);

app.use("/", (req, res) => {
  res.status(404).render("error.ejs");
});

app.listen(3000);
