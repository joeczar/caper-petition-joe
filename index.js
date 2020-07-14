const express = require('express');
const hb = require('express-handlebars');
const app = express();
const db = require('./db');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const { hash, compare } = require('./bc');

const headerTitle = {
    headline: 'Switch to Open Source Software',
    subText: [
        'Say no to surveillance capitalism!',
        'Say yes to privacy!',
        'Say yes to open source, not for profit software!',
    ],
};
const petitionReason =
    'say no to surveillance capitalism, protect your privacy and support open source, not for profit software!';

app.use(
    cookieSession({
        secret: `I'm a cookie`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(csurf());
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
});
app.get('/', (req, res) => {
    res.render('home', {
        layout: 'landing',
        title: 'Zoom Petition',
        headerTitle,
        petitionReason,
    });
});
app.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register',
        headerTitle,
    });
});
app.post('/register', (req, res) => {
    // use hash here
    hash(req.body.pwdInput)
        .then((hashed) => {
            const { firstName, lastName, emailInput } = req.body;
            const usrArr = [firstName, lastName, emailInput, hashed];

            db.addUser(usrArr).then((data) => {
                req.session.registerId = data.rows[0].id;
                res.redirect('/petition');
            });
        })
        .catch((err) => console.log('error in register', err));
    // req.body.password
});
app.get('/login', (req, res) => {
    res.render('login', {
        headerTitle,
    });
});
app.post('/login', (req, res) => {
    // log req.body
    //get email to  check ifUserExists & get user hash
    // if no email match rerender login w/ error
    // compare user input pw with hash
});
app.get('/petition', (req, res) => {
    console.log(req.session);
    if (req.session.signatureId) {
        res.redirect('/thanks');
    } else {
        db.getUserName(req.session.registerId).then((data) => {
            const name = data.rows[0];
            res.render('petitionPage', {
                title: 'Petition',
                headerTitle,
                petitionReason,
                name,
            });
        });
    }
});
app.get('/petition/signers', (req, res) => {
    db.getNames()
        .then((data) => {
            let count = 0;
            const cleaned = data.rows.map((name) => {
                let { first, last, created_at } = name;
                const date = new Date(created_at).toLocaleString('de-DE');
                count++;

                return { first, last, date };
            });
            res.render('signersPage', {
                title: 'Signers',
                headerTitle,
                signatures: cleaned,
                count,
            });
        })
        .catch((err) => {
            console.log('error in signers', err);
        });
});
app.get('/thanks', (req, res) => {
    if (!req.session.registerId) {
        res.redirect('/register');
    } else if (!req.session.signatureId) {
        res.redirect('/petition');
    } else {
        db.getCount()
            .then((count) => {
                const num = count.rows[0].count;
                console.log(num);
                if (num === '0') {
                    res.redirect('/petition');
                } else {
                    db.getSignature(req.session.signatureId)
                        .then((sig) => {
                            db.getUserName(req.session.registerId)
                                .then((data) => {
                                    const name = data.rows[0];
                                    return name;
                                })
                                .then((name) => {
                                    const {
                                        created_at,
                                        signature,
                                    } = sig.rows[0];
                                    const date = new Date(
                                        created_at
                                    ).toLocaleString('de-DE');
                                    res.render('thanks', {
                                        title: 'Thank You!',
                                        headerTitle,
                                        petitionReason,
                                        signers: num,
                                        date: date.split(', '),
                                        signature,
                                        name,
                                    });
                                });
                        })
                        .catch((err) =>
                            console.log('error in getSignature', err)
                        );
                }
            })
            .catch((err) => console.log('error in get-signatures', err));
    }
});

app.post('/petition', (req, res) => {
    const { signature } = req.body;
    const userId = req.session.registerId;

    db.addSignature([signature, userId])
        .then((data) => {
            req.session.signatureId = data.rows[0].id;
            res.redirect('/thanks');
        })
        .catch((err) => console.log('error in add-signature', err));
});
app.use(express.static('public'));

app.listen(8081, () => console.log('Server running at http://localhost:8081'));
