exports.schema = {
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
