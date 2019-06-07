const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const operation = require('./operation');
const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

mongoClient.connect(url, (err, client) => {
    assert.equal(err, null);
    console.log("connected to server");

    const db = client.db(dbname);
    // const collection = db.collection("courses");
    // collection.insertOne({
    //     name: "CS180",
    //     description: "Intro to JAVA programming"
    // }, (err, result) => {
    //     assert.equal(err, null);
    //     console.log("After insert data:\n");
    //     console.log(result.ops);

    //     collection.find({}).toArray((err, docs) => {
    //         assert.equal(err, null);
    //         console.log("Found:\n");
    //         console.log(docs);

    //         db.dropCollection("courses", (err, result) => {
    //             assert.equal(err, null);
    //             client.close();
    //         });
    //     });
    // });

    operation.insertDocument(db, {name: "CS180", description: "Intro to java"}, "courses", (result) => {
        console.log("Inserted Document:\n", result.ops);

        operation.findDocument(db, "courses", (docs) => {
            console.log("Found document:\n", docs);

            operation.updateDocument(db, {name: "CS180"}, {description: "Intro to java programming"}, "courses", (result) => {
                console.log("Updated Document:\n", result.result);

                operation.findDocument(db, "courses", (docs) => {
                    console.log("Found the updated document:\n", docs);

                    operation.deleteDocument(db, {name: "CS180"}, "courses", (result) => {
                        console.log("delete document:\n", result.result);
                        
                        db.dropCollection("courses", (err, result) => {
                            assert.equal(err, null);
                            console.log("Dropped colletion", result);
                            client.close();
                        })
                    });
                });
            });
        });
    });
});