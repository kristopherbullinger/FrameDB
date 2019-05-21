let bcrypt = require('bcryptjs');

let password = "cat111";

console.log(password);

const hash = bcrypt.hashSync(password, 12);

console.log(hash);

let compareCorrect = bcrypt.compareSync("cat111", hash);

console.log("Correct: " + compareCorrect);

let compareIncorrect = bcrypt.compareSync("cat112", hash);

console.log("Incorrect: " + compareIncorrect);
