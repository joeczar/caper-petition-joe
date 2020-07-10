const express = require('express');
const app = express();

////////////// Handlebars Boilerplate DO NOT TOUCH!!! ///////////
Handlebars.templates = Handlebars.templates || {};
var templates = document.querySelectorAll(
    'script[type="text/x-handlebars-template"]'
);
Array.prototype.slice.call(templates).forEach(function (script) {
    Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
});
////////////// Handlebars Boilerplate DO NOT TOUCH!!! ///////////

app.use(express.static('public'));

app.listen(8080, () => console.log('Server running at http://localhost:8080'));
