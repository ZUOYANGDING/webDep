const assert = require('assert');

exports.insertDocument = (db, document, colletionName, _callback) => {
   var coll = db.collection(colletionName);
//    with Promise
   return coll.insert(document); 

//    coll.insert(document, (err, result) => {
//        assert.equal(err, null);
//        console.log("Inserted: " + result.result.n + " documents into the collection " + colletionName);
//        callback(result);
//    });
};

exports.findDocument = (db, colletionName, _callback) => {
    var coll = db.collection(colletionName);
    // with Promise
    return coll.find({}).toArray();

    // coll.find({}).toArray((err, docs) => {
    //     assert.equal(err, null);
    //     callback(docs);
    // });
};

exports.updateDocument = (db, document, update, colletionName, _callback) => {
    var coll = db.collection(colletionName);
    // with Promise
    return coll.updateOne(document, {$set: update}, null);

    // coll.updateOne(document, {$set: update}, null, (err, result) => {
    //     assert.equal(err, null);
    //     console.log("Update the document with: ", update);
    //     callback(result);
    // });
};

exports.deleteDocument = (db, document, colletionName, _callback) => {
    var coll = db.collection(colletionName);
    return coll.deleteOne(document);

    // coll.deleteOne(document, (err, result) => {
    //     assert.equal(err, null);
    //     console.log("Deleted the document: ", document);
    //     callback(result);
    // });
};