const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');


let _db;

const client = new MongoClient("mongodb://localhost:27017", {useNewUrlParser: true});

client.connect( err => {
  if (err) throw err;
  _db = client.db("T7Movelists");
  console.log("Running");
});

// const initializeDb = () => {
//   fs.readdir('./character-data', (err, filenames) => {
//     filenames.forEach(filename => {
//       fs.readFile(`./character-data/${filename}`, (err, fileContent) => {
//         _db.collection("characters").insertOne(JSON.parse(fileContent));
//       });
//     });
//   });
// };
//
// const getChars = () => {
//   _db.collection("characters").find({}, {projection: {displayName: 1, label: 1, _id: 0} }).toArray()
//   .then(charNames => {
//       fs.writeFileSync('./charNames2.json', JSON.stringify(charNames.sort( (a,b) => (a.label > b.label) ? 1 : 0)));
//   });
// };

// const backUpDb = async () => {
//   let chars = await getDb().collection("characters").find({}).toArray();
//   console.log(`Found ${chars.length} chars`);
//   await getDb().collection("characters_backup").deleteMany({});
//   console.log("cleared backup");
//   await getDb().collection("characters_backup").insertMany(chars);
//   console.log("Populated backup");
// };

// const restoreBackup = async () => {
//   let chars = await getDb().collection("characters_backup").find({}).toArray();
//   console.log("Found backup!");
//   await getDb().collection("characters").deleteMany({});
//   console.log("Purged database");
//   await getDb().collection("characters").insertMany(chars);
//   console.log("Database restored!");
// }

const getDb = () => _db;

//setTimeout(restoreBackup, 5000);

exports.getDb = getDb;
