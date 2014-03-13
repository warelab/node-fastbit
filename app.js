// setup some dependencies
var express  = require('express'),
    app      = express(),
    cache    = require('web-cache'),
    validate = require('conform').validate,
    fb       = require('./build/Release/fb'),
    schema   = require('./config/schema').schema,
    metadata = require('./config/metadata');

var port = process.argv.length > 2 ? process.argv[2] : 3000;

app.use(express.logger());
app.use(express.compress());
app.use(cache.middleware({
    clean: true,
    exclude: [ /^\/update$/ ]
}));
app.use(app.router);
var datasets = metadata.update();
app.get('/', function (req,res,next) {
    res.json(datasets);
});

app.get('/update', function (req,res,next) {
    datasets = metadata.update();
    res.json({});
})

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
    if (!datasets.hasOwnProperty(dataset)) {
        datasets = metadata.update();
        res.json({"error":dataset + ": unknown data set"});
    }
    else {
        if (!schema.hasOwnProperty(command)) {
            res.json({"error":command + ": unknown command"});
        }
        else {
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
        }
    }
});


app.listen(port);
console.log("server listening on port " + port);