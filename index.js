const express = require('express');
const hb = require('express-handlebars');
const app = express();
const db = require('./db');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const { hash, compare } = require('./bc');
const { headerTitle, petitionReason, slides } = require('./petitionData');
const {
    passwordValidation,
    registerValidate,
    profileValidate,
    editProfileValidate,
    loginValidate,
    petitionValidate,
    validate,
} = require('./validatorRules');
let registered, signed, profile;

module.exports.app = app;

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
app.use((req, res, next) => {
    registered = req.session.registerId ? true : false;
    signed = req.session.signatureId ? true : false;
    profile = req.session.profileId ? true : false;
    next();
});

/////////////////////  ROUTES  //////////////////////
app.get('/', (req, res) => {
    console.log('/', req.session);
    res.render('home', {
        layout: 'landing',
        title: 'Switch to OSS',
        headerTitle,
        petitionReason,
        slides,
        registered,
        signed,
    });
});
app.post('/logout', (req, res) => {
    console.log('logout', req.session);
    req.session = null;
    res.redirect('/');
});
app.get('/updatePassword', (req, res) => {
    res.render('updatePassword', {
        title: 'Change Password',
    });
});

app.post('/updatePassword', passwordValidation(), (req, res) => {
    const { current, newPwd, repeatPwd } = req.body;
    const errors = [...validate(req)];
    db.getHash([req.session.registerId])
        .then((data) => {
            const { hash } = data.rows[0];
            return compare(current, hash);
        })
        .then((correct) => {
            if (correct === false) {
                errors.push('Current password incorrect');
            }
            if (newPwd != repeatPwd) {
                errors.push("New passwords don't match");
            }
            if (errors.length > 0) {
                console.log(errors);
                res.render('updatePassword', {
                    title: 'Change Password',
                    errors,
                });
            } else {
                hash(newPwd).then((hashed) => {
                    db.updateHash([req.session.registerId, hashed]).then(() => {
                        res.redirect('/profile');
                    });
                });
            }
        })
        .then(() => {})
        .catch((err) => console.log('Error in updateHash', err));
    // return compare(pwdInput, hash);
});
/////////////////// REGISTER ///////////////////////
app.get('/register', (req, res) => {
    console.log('register', req.session);
    if (req.session.registerId) {
        res.redirect('/petition');
    } else {
        res.render('register', {
            title: 'Register',
            headerTitle,
            register: true,
            registered,
            signed,
        });
    }
});
app.post('/register', registerValidate(), (req, res) => {
    // use hash here
    console.log('POST register', req.session);
    const errors = [...validate(req)];
    hash(req.body.pwdInput)
        .then((hashed) => {
            const { firstName, lastName, emailInput } = req.body;
            const usrArr = [firstName, lastName, emailInput, hashed];
            if (errors.length > 0) {
                return res.render('register', {
                    title: 'Register',
                    headerTitle,
                    errors,
                    registered,
                    signed,
                });
            } else {
                return usrArr;
            }
        })
        .then((data) => {
            return db.addUser(data);
        })
        .then((data) => {
            const { first, last, id } = data.rows[0];
            req.session.registerId = id;
            req.session.name = { first, last };
            res.redirect('/profile');
        })
        .catch((err) => {
            console.log('error in register', err);
            if (err.detail.includes('already exists')) {
                errors.push(
                    'That email is already in use. Would you like to log in?'
                );
            } else {
                errors.push('Something went wrong, please try again.');
            }
            res.render('register', {
                title: 'Register',
                headerTitle,
                errors,
                registered,
                signed,
            });
        });
});
//////////////////////  PROFILE  //////////////////////
app.get('/profile', (req, res) => {
    console.log('profile', req.session);
    if (profile) {
        db.getUserProfile([req.session.registerId])
            .then((data) => {
                const usrData = data.rows[0];
                const usrObj = {};
                for (let key in usrData) {
                    if (key !== 'profile_id') {
                        const label = key
                            .split('_')
                            .map(
                                (el) => el.charAt(0).toUpperCase() + el.slice(1)
                            )
                            .join(' ');
                        //if key is url add url: true to obj
                        key === 'homepage'
                            ? (usrObj[key] = {
                                  label,
                                  val: usrData[key],
                                  url: true,
                              })
                            : (usrObj[key] = { label, val: usrData[key] });
                    }
                }
                return usrObj;
            })
            .then((usrData) => {
                res.render('profile', {
                    headerTitle,
                    registered,
                    signed,
                    profile,
                    usrData,
                });
            });
    } else {
        res.render('profile', {
            headerTitle,
            registered,
            signed,
            profile,
        });
    }
});
app.post('/profile', profileValidate(), (req, res) => {
    const { age, city, url } = req.body;
    const params = [age, city, url, req.session.registerId];
    const errors = [...validate(req)];

    if (params.some((elem) => elem !== null)) {
        db.addUserProfile(params)
            .then((data) => {
                req.session.profileId = data.rows[0].id;
                res.redirect('/petition');
            })
            .catch((err) => {
                console.log('POST /profile error', err);
            });
    }

    if (errors.length > 0) {
        res.render('profile', {
            headerTitle,
            registered,
            signed,
            errors,
        });
    }
});
app.get('/profile/edit', (req, res) => {
    console.log('profile/edit', req.session);

    db.getUserProfile([req.session.registerId])
        .then((data) => {
            return data.rows[0];
        })
        .then((usrData) => {
            res.render('editProfile', {
                headerTitle,
                registered,
                signed,
                profile,
                usrData,
            });
        });
});
app.post('/profile/edit', editProfileValidate(), (req, res) => {
    console.log('POST profile/edit', req.session);
    const { first, last, email, age, city, homepage } = req.body;
    const errors = [...validate(req)];
    if (errors.length > 0) {
        res.render('editProfile', {
            headerTitle,
            registered,
            signed,
            usrData: {
                first_name: first,
                last_name: last,
                email,
                age,
                city,
                homepage,
            },
            errors: errors.array(),
        });
    } else {
        const updtUser = db.updateUser([
            req.session.registerId,
            first,
            last,
            email,
        ]);
        const updtProfile = db.updateUserProfile([
            req.session.registerId,
            age,
            city,
            homepage,
        ]);
        Promise.all([updtUser, updtProfile])
            .then(() => {
                res.redirect('/profile');
            })
            .catch((err) => {
                console.log('error in updateUser ', err);
            });
    }
});
//////////////////////  LOGIN  //////////////////////////
app.get('/login', (req, res) => {
    console.log('login', req.session);
    if (req.session.registerId) {
        res.redirect('/petition');
    } else {
        res.render('login', {
            headerTitle,
            registered,
            signed,
        });
    }
});
app.post('/login', loginValidate(), (req, res) => {
    console.log('POST login', req.session);

    const { emailInput, pwdInput } = req.body;
    const errors = [...validate(req)];
    if (errors.length > 0) {
        res.render('login', {
            headerTitle,
            registered,
            signed,
            errors,
        });
    } else {
        db.getUserLogin([emailInput])
            .then((data) => {
                console.log(data.rows[0]);
                const {
                    register_id,
                    first,
                    last,
                    signature_id,
                    profile_id,
                    hash,
                } = data.rows[0];
                return compare(pwdInput, hash).then((data) => {
                    if (data) {
                        // set login cookie
                        req.session.registerId = register_id;
                        req.session.signatureId = signature_id;
                        req.session.profileId = profile_id;
                        req.session.name = { first, last };
                        // check if signed
                        if (!signature_id) {
                            res.redirect('/petition');
                        } else {
                            res.redirect('/thanks');
                        }
                    } else {
                        errors.push("That email/password didn't work");
                        res.render('login', {
                            headerTitle,
                            registered,
                            signed,
                            errors,
                        });
                    }
                });
            })
            .catch((err) => {
                console.log('error getting user hash', err);
                errors.push("That email/password didn't work");
                res.render('login', {
                    headerTitle,
                    registered,
                    signed,
                    errors,
                });
            });
    }
});

/////////////////////////  PETITION  ////////////////////////////////
app.get('/petition', (req, res) => {
    console.log('petition', req.session);
    if (!req.session.registerId) {
        res.redirect('/register');
    } else if (req.session.signatureId) {
        res.redirect('/thanks');
    } else {
        res.render('petitionPage', {
            title: 'Petition',
            headerTitle,
            petitionReason,
            name: req.session.name,
            registered,
            signed,
        });
    }
});
app.post('/petition', petitionValidate(), (req, res) => {
    if (req.session.signatureId) {
        res.redirect('/thanks');
    } else {
        console.log('POST petition', req.session);
        const { signature } = req.body;
        const userId = req.session.registerId;
        const errors = [...validate(req)];
        if (errors.length > 0) {
            res.render('petitionPage', {
                title: 'Petition',
                headerTitle,
                petitionReason,
                name: req.session.name,
                registered,
                signed,
                errors,
            });
        } else {
            db.addSignature([signature, userId])
                .then((data) => {
                    req.session.signatureId = data.rows[0].id;
                    res.redirect('/thanks');
                })
                .catch((err) => console.log('error in add-signature', err));
        }
    }
});
//////////////////////////  SIGNERS  //////////////////////////
app.get('/petition/signers', (req, res) => {
    console.log('petition/signers', req.session);
    db.getNames()
        .then((data) => {
            let count = data.rows.length;
            const cleaned = data.rows.map((name) => {
                let { first, last, age, city, url, signed_on } = name;
                const date = new Date(signed_on).toLocaleDateString('de-DE');

                return { first, last, age, city, url, date };
            });
            res.render('signersPage', {
                title: 'Signers',
                headerTitle,
                signatures: cleaned,
                count,
                registered,
                signed,
            });
        })
        .catch((err) => {
            console.log('error in signers', err);
        });
});
app.get('/petition/signers/:city', (req, res) => {
    db.getNamesForCity([req.params.city]).then((data) => {
        let count = data.rows.length;
        const cleaned = data.rows.map((name) => {
            let { first, last, age, city, url, signed_on } = name;
            const date = new Date(signed_on).toLocaleDateString('de-DE');

            return { first, last, age, city, url, date };
        });
        res.render('signersPage', {
            title: 'Signers',
            headerTitle,
            signatures: cleaned,
            count,
            registered,
            signed,
        });
    });
});

///////////////////  THANKS  /////////////////////////
app.get('/thanks', (req, res) => {
    console.log('thanks', req.session);
    if (!req.session.registerId) {
        res.redirect('/register');
    } else if (!req.session.signatureId) {
        res.redirect('/petition');
    } else {
        db.getCount()
            .then((count) => {
                const num = count.rows[0].count;
                console.log(count.rows[0]);
                if (num === '0') {
                    res.redirect('/petition');
                } else {
                    return num;
                }
            })
            .then((num) => {
                return db.getSignature([req.session.registerId]).then((sig) => {
                    if (sig.rows.length < 1) {
                        res.redirect('/petition');
                    } else {
                        const { created_at, signature } = sig.rows[0];
                        return { num, created_at, signature };
                    }
                });
            })
            .then((userObj) => {
                return db.getUserName([req.session.registerId]).then((data) => {
                    const name = data.rows[0];
                    userObj.name = name;
                    return userObj;
                });
            })
            .then((userObj) => {
                const { num, created_at, signature, name } = userObj;
                const date = new Date(created_at).toLocaleString('de-DE');
                res.render('thanks', {
                    title: 'Thank You!',
                    headerTitle,
                    petitionReason,
                    signers: num,
                    date: date.split(', '),
                    signature,
                    name,
                    registered,
                    signed,
                });
            })
            .catch((err) => console.log('error in thanks', err));
    }
});
app.post('/signature/delete', (req, res) => {
    db.deleteSignature([req.session.registerId])
        .then(() => {
            delete req.session['signatureId'];
            res.redirect('/petition');
        })
        .catch((err) => {
            console.log('Error deleting signature', err);
        });
});

app.use(express.static('public'));

if (require.main === module) {
    app.listen(process.env.PORT || 8080, () =>
        console.log('My Petition server running at 8080')
    );
}
