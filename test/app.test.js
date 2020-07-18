const supertest = require('supertest');
const { app } = require('../index');
const cookieSession = require('cookie-session');

test('Request to / is successful', () => {
    return supertest(app)
        .get('/')
        .then((res) => {
            expect(res.statusCode).toBe(200);
            expect(res.headers['content-type']).toContain('text/html');
        });
});

test('Logged out users are redirected to registration from petition', () => {
    cookieSession.mockSessionOnce({});
    return supertest(app)
        .get('/petition')
        .then((res) => {
            expect(res.statusCode).toBe(302);
        });
});
test('Logged in users redirected to registration', () => {
    cookieSession.mockSessionOnce({ registerId: 66 });
    return supertest(app)
        .get('/register')
        .then((res) => {
            expect(res.statusCode).toBe(302);
        });
});
test('Logged in users redirected to login', () => {
    cookieSession.mockSessionOnce({ registerId: 66 });
    return supertest(app)
        .get('/login')
        .then((res) => {
            expect(res.statusCode).toBe(302);
        });
});
test('Logged in & signed users redirected to thanks from petition', () => {
    cookieSession.mockSessionOnce({ registerId: 66, signatureId: 66 });
    return supertest(app)
        .get('/petition')
        .then((res) => {
            expect(res.statusCode).toBe(302);
        });
});
test('Logged in & !signed users redirected to petition from thanks', () => {
    cookieSession.mockSessionOnce({ registerId: 66, signatureId: null });
    return supertest(app)
        .get('/thanks')
        .then((res) => {
            expect(res.statusCode).toBe(302);
        });
});
test('Logged in & !signed users redirected to petition from tPOST /petition', () => {
    cookieSession.mockSessionOnce({ registerId: 66, signatureId: 66 });
    return supertest(app)
        .post('/petition')
        .then((res) => {
            expect(res.statusCode).toBe(302);
        });
});
test('Logged in & !signed users redirected to petition from thanks', () => {
    cookieSession.mockSessionOnce({ registerId: 66, signatureId: null });
    return supertest(app)
        .get('/thanks')
        .then((res) => {
            expect(res.statusCode).toBe(302);
        });
});
/* 
    Write tests that confirm that the redirects in your petition app are working correctly. The following cases should be covered by your tests:

    1. Users who are logged out are redirected to the registration page when they attempt to go to the petition page

    2. Users who are logged in are redirected to the petition page when they attempt to go to either the registration page or the login page

    3. Users who are logged in and have signed the petition are redirected to the thank you page when they attempt to go to the petition page or submit a signature

    4. Users who are logged in and have not signed the petition are redirected to the petition page when they attempt to go to either the thank you page or the signers page

Pre-written mocks for the cookie-session and csurf modules are in the __mocks__ folder in the root of the project. Jest will automatically use these mocks in your tests. However, you will have to configure the cookie-session mock for each of your tests. You do this by calling its mockSessionOnce method.
*/
