var Sugar = require('sugar');
var request = require('request');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

//var mbtaFeed; //needs to be a universal variable to pass outside of the 





console.log("ran predictions.js");






var salemSchedule = {table: [] };
var trainAlerts;

	var salemPromise = new Promise((resolve, reject) => {
		request({
		url: 'http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=wX9NwuHnZU2ToO7GmGR9uw&stop=Salem&format=json',
		json: true
		},

		 function (error, response, jsonObject) {
		  if (!error && response.statusCode == 200) {
			 
				for (var i=0; i<jsonObject['mode'].length; i++){  
					var mode = jsonObject['mode'][i];
					for (var j=0; j<mode['route'].length; j++){
						var route = mode['route'][j];
						
						for (var k=0; k<route['direction'].length; k++){
							var direction = route['direction'][k];
							//console.log(route['direction'][k]['direction_name']);
							for (var l=0; l<direction['trip'].length; l++){
								//console.log(direction['trip'][l]['trip_name']);
								
								
								var difference = direction['trip'][l]['pre_dt'] - direction['trip'][l]['sch_arr_dt'];
								//difference = Math.abs(difference);
								
								
								direction['trip'][l]['sch_arr_dt'] = Sugar.Date.format(new Date(direction['trip'][l]['sch_arr_dt']*1000),  '{hh}:{mm}');
								//console.log("Scheduled at: " + direction['trip'][l]['sch_arr_dt']);
								direction['trip'][l]['pre_dt'] = Sugar.Date.format(new Date(direction['trip'][l]['pre_dt']*1000),  '{hh}:{mm}');
								//console.log("Predicted at: " + direction['trip'][l]['sch_arr_dt']);
								
								//console.log(difference);
								
								salemSchedule.table.push({train_direction: route['direction'][k]['direction_name'], train_name: direction['trip'][l]['trip_name'], scheduleTime: direction['trip'][l]['sch_arr_dt'],predictedTime:direction['trip'][l]['pre_dt'],difference:difference});
								console.log(salemSchedule);
								
								
							}
						}
					}
				  }  
		  }
		 
		 resolve(); 
		
		});
	  });
	  
	var alertPromise = new Promise((resolve, reject) => {  
		request({
		url: 'http://realtime.mbta.com/developer/api/v2/alertsbyroute?api_key=wX9NwuHnZU2ToO7GmGR9uw&route=CR-Newburyport&include_access_alerts=false&include_service_alerts=true&format=json',
		json: true
		},

		function (error, response, trainAlert) {
		  if (!error && response.statusCode == 200) {
				for (var i=0; i<trainAlert['alerts'].length; i++){  
					
					//console.log(trainAlert['alerts'][i]['short_header_text']);
				 }  
		  }
		trainAlerts = trainAlert;  
		resolve();
		});
	});
	

	Promise.all([salemPromise, alertPromise]).then(values => { 
	console.log("promise done - request is done");
	  MongoClient.connect(url, function(err, db) {
		  assert.equal(null, err);
		  console.log("Connected correctly to server");
			 var collection = db.collection('documents');
			  // Insert some documents
			collection.deleteOne({  }, function(err, result) {
			assert.equal(err, null);
			console.log("Removed the document with the field a equal to 3");
				});
			 // Insert some documents
			for(var i=0; i<salemSchedule['table'].length; i++) {
			collection.insert([
				{train_direction: salemSchedule['table'][i]['train_direction'], train_name: salemSchedule['table'][i]['train_name'], scheduleTime: salemSchedule['table'][i]['scheduleTime'],predictedTime:salemSchedule['table'][i]['predictedTime']}
			  ], function(err, result) {
				assert.equal(err, null);
				console.log("added the train times");
			  });
			}	
			db.close();
		});
	});

	
	


