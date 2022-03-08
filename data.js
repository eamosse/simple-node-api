const util = require('util')
const mongodb = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

module.exports = {
    save: function (data, callback) {
        //console.log("Save in collection " + collection);
        save(data, callback);
    },
    all: function(success, error) {
        all(success, error)
    },
    complete: function(id, status, success) {
        complete(id, status, success)
    },
    delete: function(id, success) {
        remove(id, success)
    }
}

client = null;
DB_URI =  "mongodb+srv://%s:%s@%s/?retryWrites=true&w=majority"
db_name = 'todos'
collection = 'tasks'

function getClient(callback) {
    if (client != null) {
        callback(client);
        return;
    }

    const DATABASE_URI = util.format(DB_URI, 'root', 'bbiaPUH79IIIgKwj', 'course.ue7xa.mongodb.net')
    mongodb.connect(DATABASE_URI, function (err, c) {
        if (err) {
            callback(null);
            console.log(err);
        }
        else {
            console.log("Initializing a new connection to mongodb...")
            client = c;
            callback(c);
        }
    });
}

function all(success, error) {
    getClient((client) => {
        let db = client.db(db_name);
         db.collection(collection)
            .find({}, {})
            .toArray(function (err, items) {
                if (err) {
                    error(err);
                } else {
                    success(items);
                }
            });
    });
}

function save(data, callback) {
    console.log(data)
    getClient(async (client) => {
        let db = client.db(db_name);
        db.collection(collection).insertOne(data, function (error, result) {
            console.log(error)
            callback(error, result);
        });
    });
}

function complete(id, status, callback) {
    getClient(async (client) => {
        const db = client.db(db_name);
        const options = { upsert: false };

        const result = await db.collection(collection).updateOne({
            "_id": new ObjectId(id)
        }, 
        {
         $set:{
            'completed': parseInt(status) == 1
        }
        }, options);
        
        callback(result);
    });
}

function remove(id, callback) {
    getClient(async (client) => {
        const db = client.db(db_name);

        const result = await db.collection(collection).deleteOne(
            {
                "_id": new ObjectId(id)
            }
        );

        callback(result);
    });

}