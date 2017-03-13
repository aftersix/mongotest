var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server

function deleteAll (){
	MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("Connected correctly to server");

	  var time = Math.round((new Date()).getTime() / 1000);
		time = time-300;
	   var collection = db.collection('documents');
	  // Find some documents
		try {
		   collection.deleteMany( {  } );
		console.log("deleted everything in the 'documents' collection");
		} catch (e) {
		   print (e);
		}	  


	});
}

deleteAll();