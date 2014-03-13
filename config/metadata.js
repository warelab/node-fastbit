var mongodb  = require('mongodb').MongoClient;
exports.update = function() {
    var datasets = {
        "baseball": {
            "path": "example_data/Master",
            "description": "baseball stats"
        }
    };

    mongodb.connect('mongodb://127.0.0.1:27017/test'
        , {db: {native_parser: true}}, function(err, db) {
        if (err) throw err;
        var collection = db.collection('fastbit').find({}).toArray(function(err, sets) {
            for(var i in sets) {
                var set = sets[i];
                datasets[set.setID] = {
                    path: set.path,
                    description: set.description
                }
            }
            db.close();
        });
    });
    return datasets;
}