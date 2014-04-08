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

function transpose (oa) {
    var keys = Object.keys(oa);
    var length = oa[keys[0]].length;
    var ao = new Array(length);
    for (var i=0;i<length;i++) {
        ao[i] = new Object();
        for (k in oa) ao[i][k] = oa[k][i];
    }
    return ao;
}

function transposeDist2D (oa,c1,c2,t) {
    var a = oa[c1];
    var b = oa[c2];
    var c = oa[t];
    var ao = new Array(c.length);
    for (var i=0; i<a.length; i++) {
        for (var j=0;j<b.length; j++) {
            var k = i*b.length + j;
            ao[k] = new Object();
            ao[k][c1] = a[i];
            ao[k][c2] = b[j];
            ao[k][t] = c[k];
        }
    }
    return ao;
}

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
                var output = fb[command](req.query);
                if (req.query.transpose) {
                    output = transpose(output);
                }
                if (req.query.transposeDist2D) {
                    output = transposeDist2D(output,req.query.column1,req.query.column2,'count');
                }
                if (req.query.mincount) {
                    var a = [];
                    output.forEach(function(o) {if (o.count >= req.query.mincount) a.push(o)});
                    output = a;
                }
                res.json(output);
        	} else {
        		res.json(schema[command].properties);
        	}
        }
    }
});


app.listen(port);
console.log("server listening on port " + port);