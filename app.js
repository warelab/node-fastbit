// setup some dependencies
var express  = require('express'),
    app      = express(),
    validate = require('conform').validate,
	http     = require('http'),
    fb       = require('./build/Release/fb');


var schema = {
    SQL: {
        properties: {
            select: {
                type: 'string',
                description: 'select clause',
                required: true
            },
            from: {
                type: 'string',
                description: 'data table to query',
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
    histogram: {
        properties: {
            select: {
                type: 'string',
                description: 'select clause',
                required: true
            },
            from: {
                type: 'string',
                description: 'data table to query',
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
        properties: {
            select: {
                type: 'string',
                description: 'select clause',
                required: true
            },
            from: {
                type: 'string',
                description: 'data table to query',
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

var datasets = {
    baseball: {
        path:"example_data/Master",
        description:"baseball stats"
    }
};

app.use(app.router);
app.get('/', function (req, res) {
    res.json(datasets);
});

app.get('/:dataset', function (req, res) {
    var dataset = req.params.dataset;
    if (datasets.hasOwnProperty(dataset)) {
        res.json(fb['describe']({from:datasets[dataset].path}));
    } else {
        res.json({});
    }
});

app.get('/:dataset/:command', function (req, res) {
    var dataset = req.params.dataset;
	var command = req.params.command;
    req.query.from = datasets[dataset].path;
	var check = validate(req.query, schema[command], {cast:true,castSource:true});
	if (check['valid']) {
        res.json(fb[command](req.query));
	} else {
		res.json(schema[command].properties);
	}
});


app.listen(3000);
