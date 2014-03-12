// setup some dependencies
var express  = require('express'),
    app      = express(),
    cache    = require('web-cache'),
    validate = require('conform').validate,
    fb       = require('./build/Release/fb'),
    schema   = require('./config/schema').schema,
    fs       = require('fs'),
    mongodb  = require('mongodb').MongoClient;

var port = process.argv.length > 2 ? process.argv[2] : 3000;

var meta = JSON.parse(fs.readFileSync('config/fbdata.json', 'utf8'));
app.use(express.logger());
app.use(express.compress());
app.use(cache.middleware({
    clean: true
}));
app.use(app.router);
app.get('/', function (req, res, next) {
    var datasets = new Object();
    for(var k in meta.datasets) {
        if (meta.datasets.hasOwnProperty(k)) {
            datasets[k] = meta.datasets[k];
        }
    }
    if (meta.hasOwnProperty('mongodb')) {
        mongodb.connect('mongodb://'
            + meta.mongodb.host + ':'
            + meta.mongodb.port + '/'
            + meta.mongodb.db
            , {db: {native_parser: true}}, function(err, db) {
                if (err) throw err;
                var collection = db
                    .collection(meta.mongodb.collection)
                    .find({})
                    .toArray(function(err, sets) {
                        for(var i in sets) {
                            var set = sets[i];
                            if (set.hasOwnProperty('id') &&
                                set.hasOwnProperty('path') &&
                                set.hasOwnProperty('description')) {
                                    datasets[set.id] = {
                                        path: set.path,
                                        description: set.description
                                    }
                            }
                        }
                        res.json(datasets);
                        db.close();
                });
        });
    }
    else res.json(datasets);
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