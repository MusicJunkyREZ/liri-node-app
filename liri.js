require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

const env = process.env;

var Spotify = require('node-spotify-api');


var spotify = new Spotify({
    id: env.SPOTIFY_ID,
    secret: env.SPOTIFY_SECRET
});


//Input on CLI
var query = process.argv;
var type = process.argv[2];
var array = [];

//Loop through and join name of arguments after file name
for (var i = 3; i < query.length; i++) {
    array.push(query[i]);
    array.push("+")
}

array.splice(-1); //Get rid of last plus sign, if left errors caused
var finalSearch = array.join("");

//Switch statement to determine type selected
switch (type) {
    case 'concert-this':
        concertMe()
        break;
    case 'spotify-this-song':
        spotifyIt()
        break;
    case 'movie-this':
        movieThis()
        break;
    case 'do-what-it-says':
        itSays()
        break;
    default:
        console.log("No type value found");
}


function concertMe() {
    if (finalSearch === "") {
        console.log('\n')
        console.log("No Artist entered. Please enter an Artist")
        console.log('\n')
    } else {
        axios.get("https://rest.bandsintown.com/artists/" + finalSearch + "/events?app_id=codingbootcamp").then(
        function (response) {
           if(response.data.length <= 0) {
               console.log("No info for this Artist")
           }else {
            for(var i=0; i < response.data.length; i++) {
                // console.log(response.data[i])
                // console.log('\n')
                // console.log("Venue: " + response.data[i].venue.name)
                // console.log("Location: " + response.data[i].venue.city + ", " + response.data[0].venue.region)
                // console.log("Event Date: " + moment(response.data[i].datetime).format('LL'))
                // console.log('\n')

                var currData = `\n
    Venue: ${response.data[i].venue.name}
    Location: ${response.data[i].venue.city + ", " + response.data[0].venue.region}
    Event Date: ${moment(response.data[i].datetime).format('LL')}
            `
            console.log(currData)
            }
           }
           
            dataLog(currData)
        }
    );
    }

    
}

function spotifyIt() {

    if (finalSearch === "") {
        finalSearch = "ace+of+base+the+sign"
    }

    spotify.search({
        type: 'artist,track',
        query: finalSearch
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('\n')
        console.log("Artist: " + data.tracks.items[0].artists[0].name)
        console.log("Track: " + data.tracks.items[0].name)
        console.log("Preview: " + data.tracks.items[0].preview_url)
        console.log("Album: " + data.tracks.items[0].album.name)
        // if (finalSearch === "ace+of+base+the+sign") {
        //     //API does not provide Month & Date for Release Date of Ace of Base - The Sign. Only the year
        //     console.log("Released: October 29, " + data.tracks.items[0].album.release_date)
        // } else {
        //     console.log("Released: " + moment(data.tracks.items[0].album.release_date).format('MMMM Do YYYY'))
        // }
        
        console.log('\n')

        var currData = `\n
    Artist: ${data.tracks.items[0].artists[0].name}
    Track: ${data.tracks.items[0].name}
    Preview: ${data.tracks.items[0].preview_url}
    Album: ${data.tracks.items[0].album.name}
            `

            dataLog(currData)

    });
}

function movieThis() {

    if (finalSearch === "") {
        finalSearch = "mr+nobody"
    }

    axios.get("http://www.omdbapi.com/?t=" + finalSearch + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log('\n')
            console.log("Title: " + response.data.Title);
            console.log("Released: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatos Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log('\n')

            var currData = `\n
    Title: ${response.data.Title}
    Released: ${response.data.Year}
    IMDB Rating: ${response.data.imdbRating}
    Rotten Tomatos Rating: ${response.data.Ratings[1].Value}
    Country: ${response.data.Country}
    Language: ${response.data.Language}
    Plot: ${response.data.Plot}
    Actors: ${response.data.Actors}
            `

            dataLog(currData)
        }
    );

    
}

function itSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          return console.log(error);
        }
      
        // console.log(data);
        var dataArr = data.split(",");
        // console.log(dataArr);
      
        finalSearch = dataArr[1];
        spotifyIt()
      });
}

//Input Logger & Data Logger

var logQuery = query.splice(0,2)
logQuery =  "\n" + query.join(" ") + "\n"
console.log(logQuery)

fs.appendFile("log.txt", logQuery, function(err) {

    if (err) {
      console.log(err);
    } else {
      console.log("Log Updated");
    }
  
  });

function dataLog(data) {
    fs.appendFile("log.txt", data, function(err) {

        if (err) {
          console.log(err);
        } else {
          console.log("Log Updated");
        }
      
      });
  }