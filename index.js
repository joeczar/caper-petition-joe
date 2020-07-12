const express = require('express');
const hb = require('express-handlebars');
const app = express();
const db = require('./db');
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

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Zoom Petition',
        headerTitle,
        petitionReason,
    });
});
app.get('/petition', (req, res) => {
    res.render('petitionPage', {
        title: 'Petition',
        headerTitle,
        petitionReason,
    });
});
app.get('/petition/signers', (req, res) => {
    db.getNames().then((data) => {
        let count = 0;
        const cleaned = data.rows.map((name) => {
            let { first, last, created_at } = name;
            const date = new Date(created_at).toLocaleString('de-DE');
            count++;
            return { first, last, date };
        });
        res.render('signersPage', {
            title: 'Signers',
            headerTitle: `${count} supporters have signed out petition`,
            signatures: cleaned,
        });
    });
});
app.get('/thanks', (req, res) => {
    db.getCount()
        .then((count) => {
            const num = count.rows[0].count;
            res.render('thanks', {
                title: 'Thank You!',
                headerTitle,
                petitionReason,
                signers: num,
            });
        })
        .catch((err) => console.log('error in get-signatures', err));
});

app.get('/get-signatures', (req, res) => {
    db.getSignatures()
        .then((data) => console.log(data.rows))
        .catch((err) => console.log('error in get-signatures', err));
});

app.post('/add-signature', (req, res) => {
    const { first, last, signature } = req.body;

    // needs an array of [first, last, signature]
    db.addSignature([first, last, signature])
        .then(() => {
            console.log('added signature.');
            res.redirect('/thanks');
        })
        .catch((err) => console.log('error in add-signature', err));
});
app.use(express.static('public'));

app.listen(8080, () => console.log('Server running at http://localhost:8080'));
