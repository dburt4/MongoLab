var http = require('http');
var fs = require('fs');
var url = require('url');
var readLIne = require('readline');
var ROOT_DIR = "html";

var messages = [
	'Hellow World',
	'From a basic Node.js server',
	'Take luck!'];
http.createServer(function(req, res){
/*	res.setHeader("Content-Type", "text/html");
	res.writeHead(200);
	res.write('<html><head><title>Simple HTML</title></head>');
	res.write('<body>');
	for(var idx in messages){
		res.write('\n<h1>' + messages[idx] + '</h1>');
		
	}
	res.end('\n</body></html>');
	*/

	var urlObj = url.parse(req.url, true, false);
		if(urlObj.pathname.indexOf("getcity") != -1)
		{
			
			console.log("Entering REST service");
			fs.readFile('/var/node/html/cities.dat.txt', function(err, data){
				if(err) throw err;
				console.log(data);
				var cities = data.toString().split("\n");
			/*	for(var i = 0; i < cities.length; i++)
				{
					console.log(cities[i]);
				}
			*/
			
			//Now use a regex to get the strings that we want:
				var regEx = new RegExp("^" + urlObj.query["q"]);
				console.log(regEx);
				var jsonresult = [];
				for(var i = 0; i < cities.length; i++){
					var result = cities[i].search(regEx);
					if(result != -1){
						console.log(cities[i]);
						jsonresult.push({city:cities[i]});
					}
	
				}					
				console.log(jsonresult);

				res.writeHead(200);
				res.end(JSON.stringify(jsonresult));
			});
		}

		else if(urlObj.pathname.indexOf("comment") != -1)
		{
			
			 if(urlObj.pathname.indexOf("comment") != -1){
				console.log("COMMENT ROUTE");
				if(req.method === "POST"){
					console.log("COMMENT POST ROUTE");
					var jsonData = "";
					req.on('data', function(chunk){
						jsonData += chunk;
						
					
					});
					req.on('end', function(){
						var reqObj = JSON.parse(jsonData);
						console.log(reqObj);
						console.log("Name: " + reqObj.Name);
						console.log("Comment:" + reqObj.Comment);
						//Now put it in the database:
						var mongoClient = require('mongodb').MongoClient;
						mongoClient.connect("mongodb://localhost/weather", function(err, db){
							if(err)throw err;
							db.collection('comments').insert(reqObj, function(err, records){
								console.log("Record added as " + records[0]._id);

							});
		

						});
						
						res.writeHead(200);
						res.end("");
					});
					
					
				}
				
				else if(req.method === "GET"){
					console.log("IN GET");
					//read teh DB entries:
					var MongoClient = require('mongodb').MongoClient;
					MongoClient.connect("mongodb://localhost/weather", function(err, db){
						if(err)console.log("ERROR in .connect in GET");
						db.collection("comments", function(err, comments){
							if(err)console.log("Error in .collection");
							comments.find(function(err,items){
								if(err)console.log("erro in .find");
								items.toArray(function(err, itemArr){
									if(err)console.log("Error in .toArray");
									console.log("Documenet array: ");
									console.log(itemArr);
									res.writeHead(200);
									res.end(JSON.stringify(itemArr));
								});
							}); 
							
						});


					});
					
						
				}



			}
		}
		else{

			fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data){
			console.log(ROOT_DIR + urlObj.pathname);
			console.log("URL path "+urlObj.pathname);
			console.log("URL search "+urlObj.search);
			console.log("URL query "+urlObj.query["q"]);	
		

			if(err){
				console.log("ERROR HERE");
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			
			else{
				
				
				res.writeHead(200);
				res.end(data);
				
			}
		});
	

		}

		
	
}).listen(80);

function handleResponse(response){
	var serverData = '';
	response.on('data', function (chunk){
		serverData += chunk;

	});
	response.on('end', function(){
		console.log(serverData);
	});

}
/*
http.request(options, function(response){
	handleResponse(response);
}).end();

*/

