const assert = require('assert');

exports.insertDocument = (db, document, colletionName, callback) => {
   var coll = db.collection(colletionName);
   coll.insert(document, (err, result) => {
       assert.equal(err, null);
       console.log("Inserted: " + result.result.n + " documents into the collection " + colletionName);
       callback(result);
   }); 
};

exports.findDocument = (db, colletionName, callback) => {
    var coll = db.collection(colletionName);
    coll.find({}).toArray((err, docs) => {
        assert.equal(err, null);
        callback(docs);
    });
};

exports.updateDocument = (db, document, update, colletionName, callback) => {
    var coll = db.collection(colletionName);
    coll.updateOne(document, {$set: update}, null, (err, result) => {
        assert.equal(err, null);
        console.log("Update the document with: ", update);
        callback(result);
    });
};

exports.deleteDocument = (db, document, colletionName, callback) => {
    var coll = db.collection(colletionName);
    coll.deleteOne(document, (err, result) => {
        assert.equal(err, null);
        console.log("Deleted the document: ", document);
        callback(result);
    });
};