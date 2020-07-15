const spicedPg = require('spiced-pg');
const db = spicedPg(
    'postgres:ripley:IfIhad1PostGres!@localhost:5432/caper-petition'
);

module.exports.getNames = () => {
    let q = 'SELECT first, last, created_at FROM users';
    return db.query(q);
};
module.exports.getCount = () => {
    return db.query('SELECT count(*) FROM signatures');
};
module.exports.addSignature = (sigArr) => {
    const q = `INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING id`;
    const params = sigArr;
    return db.query(q, params);
};
module.exports.getSignature = (params) => {
    return db.query(
        `SELECT created_at, signature  FROM signatures WHERE user_id=$1`,
        params
    );
};
module.exports.addUser = (userArr) => {
    const q = `INSERT INTO users (first, last, email, hash) VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = userArr;
    return db.query(q, params);
};
module.exports.getUserName = (params) => {
    return db.query(`SELECT first, last FROM users WHERE  id=$1`, params);
};
module.exports.getUserLogin = (params) => {
    return db.query(`SELECT id, hash FROM users WHERE email=$1 `, params);
};
