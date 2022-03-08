const util = require('util')
const mongodb = require('mongodb');
const ObjectId = require('mongodb').ObjectID;

module.exports = {
    config: function(success) {
        getConfig(success)
    }, 
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

function getConfig(success) {
    const env = process.env;
    success(env)
}

function getClient(callback) {
    if (client != null) {
        callback(client);
        return;
    }
    const env = process.env;

    const DATABASE_URI = util.format(DB_URI, env.MONGO_USER, env.MONGO_PWD, env.MONGO_URI)
    console.log("URI is", DATABASE_URI)
    mongodb.connect(DATABASE_URI, function (err, c) {
        if (err) {
            console.log(err);
            callback(null);
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