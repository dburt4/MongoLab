var http = require('http');
var fs = require('fs');
var url = require('url');

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
	fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data){
		console.log(ROOT_DIR + urlObj.pathname);
		console.log("URL path "+urlObj.pathname);
		console.log("URL search "+urlObj.search);
		console.log("URL query "+urlObj.query["q"]);	
		
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

		else
		{

			if(err){
				console.log("ERROR");
				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}
			
			else{
				
				
				res.writeHead(200);
				res.end(data);
				
			}
		}
	});	
	
}).listen(80);

var options = {
	hostname:'localhost',
	port: '8080',
	path: '/hello.html'

};

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

