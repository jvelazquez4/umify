import { getAllListeners } from "../fetching"; // DO NOT CHANGE THIS TO fetching.js I WILL FIND YOU
// import { getCurrentlyPlaying } from "../../server/spotify-api";

const listenersNearYou = document.getElementById("listeners-near-you");
const flavorText = document.getElementById("listen-header");

// NEW DATABASE JUST DROPPED LET'S GO!
let db = new PouchDB('user_information');

// The following two global variables represen the current user's randomized position
let USER_LATITUDE = 20;
let USER_LONGITUDE = 20;

const DUMMY_ENTRIES = 100; // Represents how many 'dummy' users will be stashed in our localDB
const DEFAULT_CIRCLES = 14; // Represents the maximum number of circles to be on the screen at any given point
const DISTANCE_CUTOFF = 100000; // Represents the maximum distance between any other user and the current user for the other user to be included as 'nearby'

const listOfFlavorText = [ 

// The following is just a list of flavor texts that will be displayed to the user periodically, fades in 
// and out over time, feel free to add any of your own :)
    
    "Nearby groovin\'",
    "Eavesdropping time!",
    "[Object object]",
    "Terrible tastes, all of them",
    "They are listening to what now?",
    "Probably not dwarfcore",
    "Cool music listeners near you",
    "Some of the music of all time",
    "Join the Ronan Collective",
    "Funky with the boogy woogy",
    "Circles. Circles. Circles everywhere!",
    "Alexa, play my nightcore playlist",
    "You are the dancing queen"
]

// This function accepts the JSON output of findAllListeners() and performs a check to see if they are within the current 
// User's radius of DISTANCE_CUTOFF. Returns a promise whose resolved value is a list of JSON objects, each of which is a
// user within the current user's radius.

function determineValidListeners(usersObject, userLong, userLat) {

    console.log(usersObject);

    let validUsers = [];
    for (let i = 0; i < usersObject.length; i++) {
        try {
            if (distanceBetween(userLat, userLong, usersObject[i].geoData.latitude, usersObject[i].geoData.longitude) <= DISTANCE_CUTOFF && usersObject[i]._username !== localStorage.username) {
                validUsers.push(usersObject[i]);
            }
        } catch (err) {
            continue;
        }
    }
    return validUsers;
}

// Formula for calculating the distance between two geolocational points based on latitude and longitude. 6380 represents the
// radius of the Earth in kilometers.

function distanceBetween(lat1, long1, lat2, long2) {
    return Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(long2 - long1)) * 6380;
}

// The function below generates a list of numCircles randomly placed non-intersecting circles. The radii of the circles
// may be changed within the function themselves, global parameters to be added later:

// !!! Add global param for circle MIN_RADIUS and MAX_RADIUS !!!
function generateRandomCircles(numCircles) {
    let listOfCircles = []; // Each circle is a JSON object containing the following: {center : {x :_ y :_}, radius :_)}

    let attempts = 0; // Attempt at placing circle before giving up
    
    while (listOfCircles.length < numCircles) { // Loop whilst the length of the list of output circles is less than the requested number of circles

        if (attempts > 40) { // If after 40 attempts, a circle cannot be placed, we break out of the loop and simply return what we've got
            break;  
        }

        attempts += 1;

        // Circle parameters below are semi-random within a set range. Sets the (x, y) coordinates and radius
        let xCor = Math.ceil(900 * Math.random() + 350);
        let yCor = Math.ceil(350 * Math.random() + 20);
        let radius = Math.ceil(35 * Math.random() + 55);

        // We define the circle as a JSON object
        let newCircle = {"center" : {"x" : xCor, "y" : yCor}, "radius" : radius};

        // For the purposes of pushing the first circle onto the list, no need to check list of existing circles for overlapping, thus we just continue
        if (listOfCircles.length == 0) {
            listOfCircles.push(newCircle);
            continue;
        }

        let flag = true; // Boolean flag telling us whether the current circle being constructed does not intersect with any existing ones

        for (let i = 0; i < listOfCircles.length; i++) { // Iterates through the list of existing circles
            // Distance formula shenanigans
            if (Math.sqrt(Math.pow(listOfCircles[i].center.x - newCircle.center.x, 2) + Math.pow(listOfCircles[i].center.y - newCircle.center.y, 2)) < radius + listOfCircles[i].radius + 55) {
                flag = false;
                break;
            } 
        }

        if (flag) { // If the current circle does not intersect with any existing circles, we push it onto the list, else, time to try again.
            listOfCircles.push(newCircle);
            attempts = 0;
        }

    }
    return listOfCircles;
}

// The function below takes the output of the list of circles from the function above and creates html div elements for each of them.

function placeCircles(listOfCircles) {
    for (let i in listOfCircles) { // iterates through the list of circles
        let circle = document.createElement("div");
        circle.className = "circle";
        circle.id = "circle_" + i; // id will be important later for editing the innerText 

        // Here we finally use the circle parameter information for placing the circles into our HTML webpage
        circle.style.height = listOfCircles[i].radius * 2;
        circle.style.width = listOfCircles[i].radius * 2;
        circle.style.marginLeft = listOfCircles[i].center.x;
        circle.style.marginTop = listOfCircles[i].center.y;
        circle.style.opacity = 0;

        let link = document.createElement("a");
        link.id = "link_" + i;
        link.href = "javascript: void(0)";

        let spanner = document.createElement("span");
        spanner.className = "spanner";

        link.appendChild(spanner);

        // We create a songLabel h2 element for the purposes of song labeling which is key for the purpose of our webpage
        let songLabel = document.createElement("div");
        songLabel.className = "song-label";
        songLabel.id = "song-label_" + i; // id will be important later as well
        songLabel.innerText = "Song Name";

        let artistLabel = document.createElement("div");
        artistLabel.className = "artist-label";
        artistLabel.id = "artist-label_" + i;
        artistLabel.innerText = "Artist Name";
        artistLabel.style.top = listOfCircles[i].radius;
        artistLabel.style.position = "relative";

        // Append the songLabel as a child element of our circle div element
        circle.appendChild(songLabel);
        circle.appendChild(artistLabel);
        circle.appendChild(link);

        circle.onclick = () => { // Just for fun
            console.log("Please don't touch me. Thanks.")
        }

        // We append the circle to the listenersNearYou div element which was created to contain all of our circles
        listenersNearYou.appendChild(circle);
    }
}


// The function below, as well as prevNum, is used to alternate between the existing flavorTexts lists that was
// shown further above. prevNum is used here just to make sure we don't get the same one twice in a row, for variety's sake.

let prevNum = -1;

function flavorTime() { 
    let index = Math.ceil(listOfFlavorText.length * Math.random() - 1); // generate a random index

    while (prevNum == index) { // If this index is the same as prevNum, we regenerate it
        index = Math.ceil(listOfFlavorText.length * Math.random() - 1);
    }

    flavorText.innerText = listOfFlavorText[index]; // edit the flavorText div's innerText to the selected string.

    prevNum = index; // set prevNum to index to keep track of the last flavor text.
}

// The function below is where things finally get going. The parameters below, start & nextAt, are here for animation timing purposes
// because CSS and Javascript timers are slightly off from eachother, and this is to make sure JS doesn't wander too far off track.
// The funtion below calls the functions above and initializes the webpage, populating the db, showing off the circles, etc.

let start;
let nextAt;

async function initializeWebsite() {

    // The chunk of code below (thanks StackOverflow) handles the issue of JS timers and CSS timers being out of sync. 
    // This keep the margin of error between fade-ins/outs within 20ms.

    if (!start) {
        start = new Date().getTime();
        nextAt = start;
    }
    nextAt += 6000;

    setInterval(flavorTime, nextAt - new Date().getTime());

    let circles = generateRandomCircles(10); // We get our circles

    console.log(circles); // Logging for debug
    placeCircles(circles); // We place the circles onto the webpage

    periodicFrontEndUpdate();
}

// The function below updates the front-end circles to reflect the changes in the database and is called right after the DB update.
// Follows the same logic in the initializeWebsite() function.

function periodicFrontEndUpdate() {
    getAllListeners().then(async (listeners) => { 

        await navigator.geolocation.getCurrentPosition( async (result) => {
            console.log(result.coords);

            let validUsers = determineValidListeners(listeners, result.coords.longitude, result.coords.latitude);

            console.log(validUsers);

            for (let i = 0; i < DEFAULT_CIRCLES; i++) { // Iterate through the total number of circles.

                let songLabel = document.getElementById("song-label_" + i); // songlabel div
                let artistLabel = document.getElementById("artist-label_" + i);
                let currentCircle = document.getElementById("circle_" + i); // circle div
                let link = document.getElementById("link_" + i); // circle div

                if (currentCircle === null) {
                    break;
                }

                if (i < validUsers.length) { // Check for when the total number of circles exceeds the total number of validUsers

                    let username = validUsers[i]._username; // users id here used for song name, probably will be !!! CHANGED IN THE FUTURE !!! as we clean up.

                    if (username === undefined) { // edge case for when the songName is undefined, I had originally known why this could happen but I don't now but it can so here we are.
                        break;
                    } else {

                        // The circle made it here? FUCK YES, things went well. We change the innerText to match the song name and set the opacity
                        // of the circle to 1 in case it was 0 before (probably won't ever be but just in case).
                        
                        let url = "/api/currently-playing?user=" + username;

                        console.log(url);

                        await fetch(url).then(async (jsonOutput) => {
                            jsonOutput.json().then((jsonValue) => {
                                if ("status" in jsonValue) {
                                    return;
                                } else if (jsonValue.is_playing) {
                                    console.log(jsonValue.item)

                                    
                                    songLabel.innerText = jsonValue.item.name; 
                                    artistLabel.innerText = jsonValue.item.album.artists[0].name;
                                    link.href = jsonValue.item.external_urls.spotify;

                                    currentCircle.style.opacity = "1.0"; 
                                    currentCircle.style.backgroundImage = "url(" + jsonValue.item.album.images[1].url + ")";
                                    currentCircle.style.backgroundSize = currentCircle.style.height;
                                } else {
                                    currentCircle.style.opacity = "0.0";
                                    link.href = "javascript: void(0)";
                                }
                            });
                        });
                    
                        //console.log(songName);
                    }
                } else { // Once the validUsers have been depleted i.e. there were more circles than valid users, we simply make the other circles disappear *pop*!
                    currentCircle.style.opacity = "0.0";
                    link.href = "javascript: void(0)";
                }
            }
        })
    })
}

initializeWebsite(); // Call to intialize website

// Below is where all hell breaks loose, my CPU died and this has killed it. Please for the love of all things good do not change the time parameter
// to any small number. All Hail Timothy Richards. All Hail Timothy Richards. All Hail Timothy Richards. All Hail Timothy Richards. All Hail Timothy Richards. 
const DBInterval = setInterval(() => {
    // periodicDBUpdate();
    periodicFrontEndUpdate();
}, 5000);

