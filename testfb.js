var bins = 10;
var fb = require('./build/Release/fb');
var data = "example_data/Master";
var args = {
	select: "bats,count(*) as count",
	from: data
};
console.log("fb.SQL",args);
console.log(fb.SQL(args));

var height = fb.SQL({select: "min(height) as min,max(height) as max", from: data});
console.log("height", height);
var weight = fb.SQL({select: "min(weight) as min,max(weight) as max", from: data});
console.log("weight", weight);

args = {
    column: "height",
    from: data,
    begin: height.min[0],
    end: height.max[0],
    stride: 10
};
console.log("fb.dist",args);
console.log(fb.dist(args));

args = {
    column: "weight",
    from: data,
    begin: weight.min[0],
    end: weight.max[0],
    stride: 50
};
console.log("fb.dist",args);
console.log(fb.dist(args));

args = {
    column: "height",
    from: data,
    adaptive: true,
    nbins: 10
};
console.log("fb.dist",args);
console.log(fb.dist(args));

args = {
    column: "weight",
    from: data,
    adaptive: true,
    nbins: 10
};
console.log("fb.dist",args);
console.log(fb.dist(args));

args = {
    select: "height,weight",
    from: data,
    begin1: height.min[0],
    end1: height.max[0],
    stride1: 10,
    begin2: weight.min[0],
    end2: weight.max[0],
    stride2: 50
};
console.log("fb.scatter",args);
console.log(fb.scatter(args));

args = {
    select: "height,weight",
    from: data,
    adaptive: true,
    nbins1: 10,
    nbins2: 10
};
console.log("fb.scatter",args);
console.log(fb.scatter(args));

console.log(fb.describe({from: data}));
