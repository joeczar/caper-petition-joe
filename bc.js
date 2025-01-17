const bcrypt = require('bcryptjs');
let { genSalt, hash, compare } = bcrypt;
const { promisify } = require('util');

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

module.exports.compare = compare;
module.exports.hash = (plainTxtPw) =>
    genSalt().then((salt) => hash(plainTxtPw, salt));

///////////////////  functionality demo  /////////////
// genSalt()
//     .then((salt) => {
//         console.log(salt);
//         return hash('Gangastas gonna bang', salt);
//     })
//     .then((hashedPw) => {
//         console.log(hashedPw);
//         return compare('Gangastas gonnabang', hashedPw);
//     })
//     .then((resolve) => {
//         console.log(resolve);
//     });
///////////////////////////////////////////////////////
