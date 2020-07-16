const spicedPg = require('spiced-pg');
const db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:ripley:IfIhad1PostGres!@localhost:5432/caper-petition'
);

module.exports.getNames = () => {
    let q = `SELECT users.first AS first, users.last AS last, signatures.created_at AS signed_on 
    FROM users
    JOIN signatures
    ON users.id = signatures.user_id`;
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
        `SELECT id, created_at, signature  FROM signatures WHERE user_id=$1`,
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
module.exports.addUserProfile = (params) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id) VALUES (1$, 2$, $3, $4)`,
        params
    );
};
