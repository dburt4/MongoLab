var express = require('express'),
    jade = require('jade'),
    ejs = require('ejs');
var app = express();
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
app.use(bodyParser());

//var readLIne = require('readline');
//var ROOT_DIR = "html";

var options = {
	host:'127.0.0.1',
	key: fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync('ssl/server.crt')
};

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);

app.get('/', function(req, res){
	res.send("Get Index");
});

app.use('/', express.static('./html', {maxAge: 60*60*1000}));

app.get('/getcity', function (req, res){
	console.log("In get city route");
	//res.json([{city:"Provo"},{city:"provo"}]);
	 
	console.log("Req object: " + req.url);
	
	var urlObj = url.parse(req.url, true, false);
		
		
			
			console.log("Entering REST service");
			fs.readFile('/var/node/html/cities.dat.txt', function(err, data){
				if(err) throw err;
				console.log(data);
				var cities = data.toString().split("\n");
				for(var i = 0; i < cities.length; i++)
				{
					console.log(cities[i]);
				}
			
			
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
	

});

app.get('/comment', function (req, res){
	console.log("Comment get route");
	//resarray = [{Name: 'Mickey', Comment: 'Hello', _id:'52f34513241231231'}];
	
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


//	res.json(resarray);

});

var basicAuth = require('basic-auth-connect');
var auth = basicAuth(function(user, pass){
	return ((user ==='cs360')&&(pass === 'test'));

});
app.post('/comment', auth, function(req,res){
	console.log("Comment post route");
	//console.log(req.body);
	console.log(req.user);
	console.log("remote user");
	console.log(req.remoteUser);
	
	
	var name = req.body.Name;
	var comment = req.body.Comment;
	var reqObj = JSON.parse('{"name":"' + name + '", "comment":"' + comment + '"}');
	
						var mongoClient = require('mongodb').MongoClient;
						mongoClient.connect("mongodb://localhost/weather", function(err, db){
							if(err)throw err;
							db.collection('comments').insert(req.body, function(err, records){
								console.log("Record added as " + records[0]._id);

							});
						});	

	console.log(req.body.Name);
	console.log(req.body.Comment);
	res.status(200);
	res.end();
	
});






//var jade = require('jade');
//var ejs = require('ejs');
app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', jade.__express);
app.engine('html', ejs.renderFile);
//app.listen(80);

/*
app.locals({
	uname:"Brad",
	vehicle:"Jeep",
	terrain: "Mountains",
	climate: "Desert",
	location: "Unknown"
});
*/

app.get('/jade', function(req, res){
	res.render('user_jade');
});
app.get('/ejs', function(req, res){
	app.render('user_ejs.html', function(err, renderedData){
		res.send(renderedData);
	});
});



app.get('/json', function(req, res){
	app.set('json spaces', 4);
	res.json({name:"Smithsonian", built:'1846', items:'137M', centers:['art', 'astrophysics', 'natural history', 'planetary', 'biology', 'space', 'zoo']});
});
app.get('/error', function(req, res){
	res.json(500, {status:false, message:"Internal server error "});
});

app.get('/jsonp', function (req, res){
	app.set('jsonp callback name', 'cb');
	
	res.jsonp({name:"Smithsonian", built:'1846', items:'137M', centers:['art', 'astrophysics', 'natural history', 'planetary', 'biology', 'space', 'zoo']});
});

app.get('/find', function(req, res){
	console.log("REACHED FIND!");
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var response = 'Finding Book: Author: ' + query.author + ' Title: ' + query.title;
	console.log("\nQuery URL: " + req.originalUrl);
	console.log("response: " );
	console.log(response);
	res.send(response);

});

app.get(/^\/book\/(\w+)\:(\w+)?$/, function(req, res){
	console.log("entered reg ex method");
	var response = 'Get Book: Chapter: ' + req.params[0] + ' Page: ' + req.params[1];
	console.log('\nRegex URL: ' + req.originalUrl);
	console.log(response);
	res.send(response);


});

app.get('/user/:userid', function(req, res){
	var response = 'Get user: ' + req.param('userid');
	console.log('\nParam URL: ' + req.originalUrl);
	console.log(response);
	res.send(response);
});

app.get('userid', function(req, res, next, value){
	console.log("Request recieved with user id: " + value);
	next();
});


