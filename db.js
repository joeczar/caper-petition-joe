const spicedPg = require('spiced-pg');
const db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:ripley:IfIhad1PostGres!@localhost:5432/caper-petition'
);

module.exports.getNames = () => {
    let q = `SELECT users.first AS first, users.last AS last, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS URL, signatures.created_at AS signed_on 
    FROM users
    JOIN signatures
    ON users.id = signatures.user_id
    LEFT OUTER JOIN user_profiles
    ON users.id = user_profiles.user_id;`;
    return db.query(q);
};
module.exports.getNamesForCity = (params) => {
    let q = `SELECT users.first AS first, users.last AS last, user_profiles.age AS age, user_profiles.city AS city, user_profiles.url AS URL, signatures.created_at AS signed_on 
    FROM users
    JOIN signatures
    ON users.id = signatures.user_id
    LEFT OUTER JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE LOWER(user_profiles.city)=LOWER($1)`;
    return db.query(q, params);
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
module.exports.deleteSignature = (params) => {
    const q = `DELETE FROM signatures WHERE user_id=$1`;
    return db.query(q, params);
};
module.exports.addUser = (params) => {
    const q = `INSERT INTO users (first, last, email, hash) VALUES ($1, $2, $3, $4) RETURNING id`;
    return db.query(q, params);
};
module.exports.updateUser = (params) => {
    const q = `UPDATE users 
    SET first=$2, last=$3, email=$4 
    WHERE id=$1`;
    return db.query(q, params);
};
module.exports.getUserName = (params) => {
    let q = `SELECT first, last FROM users WHERE id=$1`;
    return db.query(q, params);
};
module.exports.getUserLogin = (params) => {
    return db.query(
        `SELECT users.id AS register_id, users.first AS first, users.last AS last, users.hash AS hash, signatures.id AS signature_id, user_profiles.id AS profile_id
        FROM users
        LEFT OUTER JOIN signatures
        ON users.id = signatures.user_id
        LEFT OUTER JOIN user_profiles
        ON users.id = user_profiles.user_id
        WHERE users.email=$1`,
        params
    );
};
module.exports.getHash = (params) => {
    const q = `SELECT hash FROM users WHERE id=$1`;
    return db.query(q, params);
};
module.exports.updateHash = (params) => {
    const q = `UPDATE users SET hash=$2 WHERE id=$1`;
    return db.query(q, params);
};
module.exports.addUserProfile = (params) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id) 
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET 
        age = COALESCE(EXCLUDED.age, user_profiles.age),
        city = COALESCE(EXCLUDED.city, user_profiles.city),
        url = COALESCE(EXCLUDED.url, user_profiles.url)
        RETURNING id;`,
        params
    );
};
module.exports.updateUserProfile = (params) => {
    const q = `UPDATE user_profiles
    SET age=$2, city=$3, url=$4
    WHERE user_id=$1`;
    return db.query(q, params);
};
module.exports.getUserProfile = (params) => {
    let q = `SELECT users.first AS first_name, users.last AS last_name, users.email AS email, user_profiles.age AS age, user_profiles.city as city, user_profiles.url AS homepage, user_profiles.id AS profile_id
    FROM users
    LEFT OUTER JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE users.id=$1`;
    return db.query(q, params);
};
