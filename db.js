var train = require('./app.js');
var Sugar = require('sugar');

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server




function getRecords (){
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");

	  
	   var collection = db.collection('documents');
	  // Find some documents
	  collection.find({}).toArray(function(err, docs) {
		assert.equal(err, null);
		console.log("Found the following records");
		console.log(docs);
		db.close()
		//callback(docs);
		});      
	; 
	});
}

function getPassed (){
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");

	  var time = Math.round((new Date()).getTime());
		time = Sugar.Date.format(new Date(time),  '{hh}:{mm}');
		console.log(time);
	   var collection = db.collection('documents');
	  // Find some documents
	  
	  collection.find({ predictedTime: { $lt : time } }).toArray(function(err, docs) {
		assert.equal(err, null);
		console.log("Found the following records");
		console.log(docs);
		db.close()
		//callback(docs);
		});      
	; 
	});
}

function deleteRecords (){
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");

	  var time = Math.round((new Date()).getTime() / 1000);
		time = time-300;
	   var collection = db.collection('documents');
	  // Find some documents
		try {
		   collection.deleteMany( { "timestamp" : { $lt : time } } );
		console.log(time);
		} catch (e) {
		   print (e);
		}	  


	});
}




var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });      
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}

var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}



var addRecords = function(){

train.train();
};

setInterval(addRecords,60000);
//var array = setInterval(getRecords,6000);
setInterval(deleteRecords,60000);
setInterval(getPassed,6000);

