var path = require('path');
module.exports = function (app) {
    var router = app.loopback.Router();
    app.get('/', function (req, res) {
        if (req.session == null || req.session.username == null || req.session.username == undefined) {
            return res.sendFile(pt('client/login.html'));
        } /*else {
            return res.sendFile(pt('client/index.html'));
        }*/
    });
    app.use(router);
}


function pt(relative) {
    return path.resolve(__dirname, '../..', relative);
}