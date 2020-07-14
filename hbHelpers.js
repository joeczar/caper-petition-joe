const hb = require('handlebars');
module.exports.formWrapper = function formWrapper(options, context) {
    const args = options.hash;
    return new hb.SafeString(`
        <div class='formWrapper shadow-3'>
    <form
        id=${args.id}
        name=${args.name}
        action=${args.action}
        method=${args.method}
        target=${args.target}
    >
        ${options.fn(this)}
    </form>
</div>;
    `);
};
