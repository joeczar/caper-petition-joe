const express = require('express');
const hb = require('express-handlebars');
const app = express();
const db = require('./db');

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get('/petition', (req, res) => {
    res.render('petition', {
        title: 'Petition',
    });
});

app.get('/thanks', (req, res) => {
    db.getSignatures()
        .then((data) => {
            res.render('thanks', {
                title: 'Thank You!',
                signatures: data.rows,
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
