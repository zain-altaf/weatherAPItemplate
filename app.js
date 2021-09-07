const express = require("express");
const https = require("https"); // this allows you to get information from an external server
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

// app.use("view engine", 'ejs');

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

    const query = req.body.cityName;
    const apiKey = "**ENTER YOUR API KEY HERE";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey +"&units=" + units;
    // this will allow you to make a get request to the server to obtain information
    https.get(url, function(response){ // this callback function will give us a response
        response.on('data', function(data){ // this callback function will recieve that data from the external server
            //currently the data is in hexidecimal format we need to have the data in JSON format
            const weatherData = JSON.parse(data);
            const temperature = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";
            res.write("<h1>The temperature in " + query + " is " + temperature + " degrees Celcius</h1>" );
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write(`<img src="${imageURL}">`);
            // res.render("index", {thisCity: query, cityTemp: temperature, description: weatherDescription, image: imageURL});
            res.send();
        });
    });
});


app.listen(process.env.PORT || 3000, function(){
    console.log("The app is running on port 3000");
});
