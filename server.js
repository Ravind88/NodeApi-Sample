var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
var route = require('./api/routes/todoListRoutes');
var bodyParser = require('body-parser');
var ev = require('express-validation');
var customFunction = require('./api/util/customFuntions');
app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
app.use(bodyParser.json({ limit: "1mb" }));
//create custom headers to aa our custom headers
function customHeaders(req, res, next) {
    // OR set your own header here
    res.setHeader('x-mycure-App-Version', 'v1.0.0');
    //res.header("Content-Type", "application/json");
    res.header("Accept", "application/json, text/plain,*/*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,Access-Control-Allow-Origin,Access-Control-Allow-Methods,access-token");

    next();
}
app.use(customHeaders);
app.use('/api', route);
app.use(function (err, req, res, next) {
    // specific for validation errors
    if (err instanceof ev.ValidationError) {
        return customFunction.makeResponse(res, false, 305, "failed", 1.0, err.errors[0].messages);
        // return res.status(err.status).json(err);
    }


    // other type of errors, it *might* also be a Runtime Error
    // example handling
    if (process.env.NODE_ENV !== 'production') {
        return res.status(500).send(err.stack);
    } else {
        return res.status(500);
    }
});

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);