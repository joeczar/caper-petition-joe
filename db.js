const spicedPg = require('spiced-pg');
const db = spicedPg(
    'postgres:ripley:IfIhad1PostGres!@localhost:5432/caper-petition'
);

module.exports.getNames = () => {
    let q = 'SELECT first, last, created_at FROM signatures';
    return db.query(q);
};
module.exports.getCount = () => {
    return db.query('SELECT count(*) FROM signatures');
};
module.exports.addSignature = (sigArr) => {
    const q = `INSERT INTO signatures (first, last, signature) VALUES ($1, $2, $3) RETURNING id`;
    const params = sigArr;
    return db.query(q, params);
};
module.exports.getSignature = (id) => {
    return db.query(
        `SELECT first, last, created_at, signature  FROM signatures WHERE id=${id}`
    );
};
