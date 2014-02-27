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
    select: "height",
    from: data,
    begin: height.min[0],
    end: height.max[0],
    stride: 1
};
console.log("fb.histogram",args);
console.log(fb.histogram(args));
args = {
    select: "weight",
    from: data,
    begin: 50,
    end: 400,
    stride: 50
};
console.log("fb.histogram",args);
console.log(fb.histogram(args));
args = {
    select: "weight",
    from: data,
    adaptive: true,
    nbins: 10
};
console.log("fb.histogram",args);
console.log(fb.histogram(args));

// args = {
//     select: "height,weight",
//     from: data,
//     begin1: 0,
//     end1: 100,
//     stride1: 10,
//     begin2: 0,
//     end2: 500,
//     stride2: 50,
//     where: "1=1"
// };
// console.log("fb.scatter",args);
// console.log(fb.scatter(args));
// 
// args = {
//     select: "height,weight",
//     from: data,
//     where: "1=1",
//     adaptive: true,
//     nbins1: 10,
//     nbins2: 10
// };
// console.log("fb.scatter",args);
// console.log(fb.scatter(args));
// 

