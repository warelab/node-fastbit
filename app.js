// setup some dependencies
var express  = require('express'),
    app      = express(),
    cache    = require('web-cache'),
    validate = require('conform').validate,
    fb       = require('./build/Release/fb'),
    schema   = require('./config/schema').schema;

var port = process.argv.length > 2 ? process.argv[2] : 3000;

var fs    = require('fs');
var datasets = JSON.parse(fs.readFileSync('config/fbdata.json', 'utf8'));
app.use(express.logger());
app.use(express.compress());
app.use(cache.middleware({
    path: /^\//,
    clean: true
}));
app.use(app.router);
app.get('/', function (req, res, next) {
    res.json(datasets);
});

app.get('/:dataset', function (req, res, next) {
    var dataset = req.params.dataset;
    
    var commands = new Object;
    for(var cmd in schema) {
        commands[dataset + '/' + cmd] = schema[cmd].description;
    }
    res.json(commands);
});

app.get('/:dataset/:command', function (req, res, next) {
    var dataset = req.params.dataset;
	var command = req.params.command;
    req.query.from = datasets[dataset].path;
    if (req.query.hasOwnProperty('part')) {
        req.query.from += "/" + req.query.part;
    }
	var check = validate(req.query, schema[command], {cast:true,castSource:true});
	if (check['valid']) {
        res.json(fb[command](req.query));
	} else {
		res.json(schema[command].properties);
	}
});


app.listen(port);
console.log("server listening on port " + port);