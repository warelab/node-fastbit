// setup some dependencies
var express  = require('express'),
    app      = express(),
    cache    = require('web-cache'),
    validate = require('conform').validate,
    fb       = require('./build/Release/fb');

var port = process.argv.length > 2 ? process.argv[2] : 3000;

var schema = {
    describe: {
        description: "return the names and types of columns",
        properties: {}
    },
    SQL: {
        description: "simple SQL interface",
        properties: {
            select: {
                type: 'string',
                description: 'select clause',
                required: true
            },
            where: {
                type: 'string',
                description: 'where clause'
            },
            orderby: {
                type: 'string',
                description: 'column to sort by'
            }
        }
    },
    dist: {
        description: "1D distribution of data in a column",
        properties: {
            column: {
                type: 'string',
                description: 'column',
                required: true
            },
            where: {
                type: 'string',
                description: 'where clause'
            },
            adaptive: {
                type: 'boolean',
                description: 'adaptive binning'
            },
            nbins: {
                type: 'integer',
                description: 'number of bins for adaptive binning'
            },
            begin: {
                type: 'number',
                description: 'uniform binning min value'
            },
            end: {
                type: 'number',
                description: 'uniform binning max value'
            },
            stride: {
                type: 'number',
                description: 'uniform binning bin size'
            }
        }
    },
    dist2D: {
        description: "2D distribution of 2 columns",
        properties: {
            column1: {
                type: 'string',
                description: 'column1',
                required: true
            },
            column2: {
                type: 'string',
                description: 'column2',
                required: true
            },
            where: {
                type: 'string',
                description: 'where clause'
            },
            adaptive: {
                type: 'boolean',
                description: 'adaptive binning'
            },
            nbins1: {
                type: 'integer',
                description: 'number of bins for adaptive binning'
            },
            begin1: {
                type: 'number',
                description: 'uniform binning min value'
            },
            end1: {
                type: 'number',
                description: 'uniform binning max value'
            },
            stride1: {
                type: 'number',
                description: 'uniform binning bin size'
            },
            nbins2: {
                type: 'integer',
                description: 'number of bins for adaptive binning'
            },
            begin2: {
                type: 'number',
                description: 'uniform binning min value'
            },
            end2: {
                type: 'number',
                description: 'uniform binning max value'
            },
            stride2: {
                type: 'number',
                description: 'uniform binning bin size'
            }
        }
    },
    histogram: {
        description: "1D distribution of query results",
        properties: {
            select: {
                type: 'string',
                description: 'select clause',
                required: true
            },
            where: {
                type: 'string',
                description: 'where clause'
            },
            adaptive: {
                type: 'boolean',
                description: 'adaptive binning'
            },
            nbins: {
                type: 'integer',
                description: 'number of bins for adaptive binning'
            },
            begin: {
                type: 'number',
                description: 'uniform binning min value'
            },
            end: {
                type: 'number',
                description: 'uniform binning max value'
            },
            stride: {
                type: 'number',
                description: 'uniform binning bin size'
            }
        }
    },
    scatter: {
        description: "2D distribution of query results",
        properties: {
            select: {
                type: 'string',
                description: 'select clause',
                required: true
            },
            where: {
                type: 'string',
                description: 'where clause'
            },
            adaptive: {
                type: 'boolean',
                description: 'adaptive binning'
            },
            nbins1: {
                type: 'integer',
                description: 'number of bins for adaptive binning'
            },
            begin1: {
                type: 'number',
                description: 'uniform binning min value'
            },
            end1: {
                type: 'number',
                description: 'uniform binning max value'
            },
            stride1: {
                type: 'number',
                description: 'uniform binning bin size'
            },
            nbins2: {
                type: 'integer',
                description: 'number of bins for adaptive binning'
            },
            begin2: {
                type: 'number',
                description: 'uniform binning min value'
            },
            end2: {
                type: 'number',
                description: 'uniform binning max value'
            },
            stride2: {
                type: 'number',
                description: 'uniform binning bin size'
            }
        }
    }
};

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