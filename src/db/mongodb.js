//CRUD create read update delete

/* const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; */

const { MongoClient, ObjectID} = require('mongodb');

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';



MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.log(error);
    }

    const db = client.db(databaseName);

  /*   const updatePromise = db.collection('users').updateOne({
        _id : new ObjectID("5c97982afa06203088e93e1b")
    }, {
        $set: {
            name : 'Juan Jose'
        }
    });

    updatePromise.then((result)=>{
        console.log(result);
    }).catch((error)=>{
        console.log(error);
    }); */

    const updateManyPromise = db.collection('tasks').updateMany({}, {
        $set: {
            completed : true
        }
    });

    updateManyPromise.then((result)=>{
        console.log(result);
    }).catch((error)=>{
        console.log(error);
    });

});