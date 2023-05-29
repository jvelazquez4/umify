import {userInfo} from '../fetching';

const grid = document.getElementById("grid-container");
const info = document.getElementById("info");
const page = document.getElementById("container-fluid");
let scrollBar = document.getElementById('scroll-bar');
let barRect = scrollBar.getBoundingClientRect();
let scrollButton = document.getElementById('scroll-button');
let buttonRect = scrollButton.getBoundingClientRect();
let dragging = false;
let songProfiles = {};

// This creates the genre list with associated colors
let genres = ["?","ambient","bass","bit music","blues & country","breaks","caribbean music","chillout","classical music","drum & bass","dubstep","easy listening","edm","electronic pop","experimental","folk","funk","future bass","hard dance","hardcore [edm]","house","industrial","jazz","leftfield bass","metal","midtempo edm","miscellaneous","new age","pop","psy","psychedelia","punk","regional music","r&b","release","soul","synthesizer music","synthwave","techno","tekno","traditional music","trance","trap latino","uk electronic","uk garage","vapor","reggaeton","rock","heavy metal","country","tango","gospel","exotica","mariachi","soul / funk","ska","folk / traditional","disco","salsa","calypso","samba","cumbia","contemporary christian","rumba","reggae","flamenco","electronic","new age / space music","polka","hip hop","blues / r&b","afrobeat","pop music","a cappella","k-pop","j-pop","k-rap","anime","indian pop","j-rap","indie pop", "bedroom pop", "rap", "afrofuturism", "neo soul", "lo-fi indie", 
"dream pop","colombian pop", "modern rock","viral pop","indie pop rap","electropop", "alt z","chill r&b","korean r&b", "korean city pop","conscious hip hop","punk blues","norwegian indie","canadian pop","trap","la indie","canadian contemporary r&b","chill pop","kawaii metal","j-pixie","indie rock","japanese soul","screamo","pop punk","pop dance","electro house","korean shoegaze","j-rock","hyperpop","emo","instrumental rock", "kawaii future bass","alternative emo","hyperpop","bubblegrunge","plunderphonics","chill breakcore"];
let colors = ["#b9b9b9", "#f0b4b5", "#c99700", "#92de68", "#b5680c", "#4258a8", "#f6b26b", "#afafff", "#d0ad60", "#f61a03", "#941de8", "#faeed5","#0aff12", "#9c8aa4", "#7ec8ca", "#757c65", "#d0ad60", "#6988a2", "#8989ff", "#3ea500", "#009600", "#eb8200", "#282828", "#ed9f80", "#46596b", "#003a12", "#0a9655", "#b9b9b9", "#f0b4b5", "#16acb0", "#006796", "#5f986d", "#610061", "#b94e48", "#6988a2", "#b9b9b9", "#6988a2", "#d982b5", "#674ea7", "#2a3fd7", "#128465", "#d0ad60", "#0080e6", "#810029", "#333266", "#bf7fff", "#e924ef", "#FF0000", "#b30b2c", "#BB0022", "#A52A2A", "#800000", "#A0522D", "#FA8072", "#E9967A", "#FFA500", "#FF8C00", "#DAA520", "#FFA500", "#EEE8AA", "#BDB76B", "#9ACD32", "#7FFFD4", "#90EE90", "#36A667", "#008000", "#006400", "#edc511", "#8D9092", "#FAEBD7", "#00008B", "#0000E1", "#00BFFF", "#87CEEB", "#DDBBBB", "#1B5BED", "#5ABDED", "#1B5BED", "#FC5C5C", "#DF1D7D", "#D2D365", "#a8c484", "#a891db", "#7a3026", "#adfc00", "#070463", "#d99cc7", "#94629c","#e6671e","#453830", "#be68e3", "#758234","#52d998", "#6b7b8a","#887d9e","#f314ff","#735887","#54a80f","#1d5182","#8cad9c","#9e43cc","#d9882b","#d1ca8c","#2b6945","#7ba1b5","#cc85ff","#58db65","#7f5b8c","#9c6b82","#e80000","#8219bf","#bf19bf","#00b2c2","#4579d9","#c26004","#0e9296","#596e5d","#98FF98","#191970","#b613ec","#730f62","#edbf18","#74d6a7"];
let genreColor = {}
for (let i = 0; i < genres.length; ++i){
    genreColor[genres[i]] = colors[i];
};


//Function to get a random int between the min and max
function randomInt(min,max){
    return Math.floor(Math.random() * (max - min) + min);
}

// Function to create the grid, includes event listeners
const createGrid = (num) => {
    for (let i = 0; i<num; i++){
        const newItem = document.createElement("div");
        newItem.classList.add("grid-item")
        //On mouse over, a pop-up will appear to the side that shows the top
        //songs of the mood associated with the square.
        newItem.addEventListener('mouseover', (event)=>{
            //This creates the header
            info.style.display = 'grid';
            const newElement = document.createElement("div");
            newElement.classList.add("info-header");
            newElement.textContent =`Songs of ${event.currentTarget.genre}`;
            info.append(newElement);

            //For every song in the current genre (up to three), this will create a mini profile 
            //for it, where artist and picture are created as div elements and added. 
            for(let i = 0; i < Math.min(songProfiles[event.currentTarget.genre].length, 3); ++i){
                const description = document.createElement("div");
                description.classList.add("top-songs");
                let curGenre = songProfiles[event.currentTarget.genre];
                //This adds in the picture and artist to the div element
                for(let item in curGenre[i]){
                    const newElement = document.createElement("div");
                    newElement.classList.add(item)
                    //If the category is picture, a different structure is needed for the div
                    if(item === "picture"){
                        const newPic = document.createElement("img");
                        newPic.src = curGenre[i][item];
                        newElement.append(newPic);
                    }
                    else{
                        newElement.textContent = curGenre[i][item];
                    }
                    description.append(newElement);
                }
                info.appendChild(description);
            }
        })
        // When the mouse leaves the square, it will revert to its original 
        // appearance
        newItem.addEventListener('mouseout', ()=>{
            info.style.display = 'none';
            let infoHeader = document.getElementsByClassName("info-header");
            infoHeader[0].remove();
            let topSongs = document.getElementsByClassName("top-songs");
            for(let i = 0; i<3; ++i){
                topSongs[0].remove();
            }

        })
        grid.appendChild(newItem);
    }
}

// Function that takes in a size and updates the grid to be that size. The size should 
// be some number n squared.
const updateGrid = (size)=>{
    let gridItems = document.getElementsByClassName("grid-item");
    //If the new size is greater than the current size, then add elements 
    //to the grid until the size equals new size 
    if(size > gridItems.length){
        while(gridItems.length < size){
            //This adds the "settings" and event listeners to the new grid items
            const newItem = document.createElement("div");
            newItem.classList.add("grid-item")
            newItem.addEventListener('mouseover', (event)=>{
                info.style.display = 'grid';
                const newElement = document.createElement("div");
                newElement.classList.add("info-header");
                newElement.textContent =`Songs of ${event.currentTarget.genre}`;
                info.append(newElement);
    
                for(let i = 0; i < Math.min(songProfiles[event.currentTarget.genre].length, 3); ++i){
                    const description = document.createElement("div");
                    description.classList.add("top-songs");
                    let curGenre = songProfiles[event.currentTarget.genre];
                    //This adds in the picture, artist, and song to the div element
                    for(let item in curGenre[i]){
                        const newElement = document.createElement("div");
                        newElement.classList.add(item)
                        if(item === "picture"){
                            const newPic = document.createElement("img");
                            newPic.src = curGenre[i][item];
                            newElement.append(newPic);
                        }
                        else{
                            newElement.textContent = curGenre[i][item];
                        }
                        description.append(newElement);
                    }
                    info.appendChild(description);
                }
            })
            // Adds the event listener where when you move your mouse off the element 
            // it reverts back to its original status.
            newItem.addEventListener('mouseout', ()=>{
                info.style.display = 'none';
                let infoHeader = document.getElementsByClassName("info-header");
                infoHeader[0].remove();
                let topSongs = document.getElementsByClassName("top-songs");
                for(let i = 0; i<3; ++i){
                    topSongs[0].remove();
                }    
            })
            grid.appendChild(newItem);
        }
        // Adjust the columns to be equal to the square root of the size
        grid.style.gridTemplateColumns = `repeat(${Math.sqrt(size)}, auto)`;
        //Recolors the grid
        fillGrid();
    }
    else{
        // Otherwise, remove elements until the current size is equal to the new size 
        while(gridItems.length > size){
            gridItems[gridItems.length-1].remove();
        }
        // Adjust the columns to be equal to the square root of the size   
        grid.style.gridTemplateColumns = `repeat(${Math.sqrt(size)}, auto)`;
        fillGrid();
    }
}

// Function to fill the grid with the colors of each user
function fillGrid(){
    let gridItems = document.getElementsByClassName("grid-item");
    for(let i = 0; i < gridItems.length; i++){
        let genre = Object.keys(songProfiles)[i];
        let gridItem = gridItems[i];
        gridItem.genre = genre;
        gridItem.style.background = genreColor[genre];
    }
}

// Function to change the background based on the entries
const changeBackground = () => {
    let maxValue = Object.keys(songProfiles).length-1;
    let chosenColor = genreColor[Object.keys(songProfiles)[randomInt(0,maxValue)]];
    page.style.background = `linear-gradient(315deg, #D384BD 20% , ${chosenColor} 75%)`;
}

// Allows for the scroll bar to be dragged
//The code for the scrollbar movement was inspired by code online. However,
//I was unable to find the source of the code. I tried to search for the source
//in my browser history but couldn't find it. Only the movement of the scrollbar
//button within the scroll bar container was taken from online. 
scrollBar.addEventListener('mousedown', (e)=>{
    e.preventDefault();
    dragging = true;
})

//When the mouse moves while clicking on the bar, the scroll bar will move
//Depending on the position of the mouse, the grid will decrease or increase sizes
document.addEventListener('mousemove', (e)=>{
    e.preventDefault();
    if(dragging && buttonRect.width + e.clientX <= barRect.right && e.clientX >= barRect.left)
    {
        if(e.clientX <= (barRect.left + 100)){
            updateGrid(4);
        }
        else if(e.clientX <= (barRect.left + 200)){
            updateGrid(9);
        }
        else if(e.clientX <= (barRect.left + 300) ){
            updateGrid(16);
        }   
        else if(e.clientX <= (barRect.left + 400)){
            updateGrid(25);
        }              
        scrollButton.style.left = `${e.clientX}px`;
    } 
})

//Once the mouse is off of the scroll bar, it will no longer be able to be dragged
document.addEventListener('mouseup',(e)=>{
    e.preventDefault();
    dragging = false;
})

//This function renders the whole page. It gets every friend of the currently logged 
//in user and finds their top artists. It adds the genres of top artists to songProfiles
//It creates the 5x5 grid and fills in the colors using the genres from songProfiles
async function main(){
    //Checks if there exists a username in the local storage
    if(localStorage.getItem("username")==null){
        //If there doesnt exist one, redirect the user to homepage
        window.location.assign('http://localhost:3000/');
    } else{
        //Otherwise, get the username of the user stored in localStorage
        let currentUser = localStorage.getItem("username");
        //Fetch their information 
        let dbInfo = await userInfo(currentUser);
        let friends = dbInfo.info.friends;
        let neededSongs = friends.length < 25 ? Math.ceil(25/friends.length) : 1;
        //Go their friendslist
        for (let friend of friends){
            //Call spotify function 
            let fetchInfo = await (await fetch(`/api/top-artist?user=${friend}`)).json();
            let recentSongs = fetchInfo.items;
            //Add top artists and their respective genre to songProfiles
            for(let i = 0; i < Math.min(neededSongs, recentSongs.length); ++i){
                let track = recentSongs[i];
                let trackGenres = track.genres;
                let index = 0;
                while(index < trackGenres.length){
                    let foundGenre = trackGenres[index];
                    if(genres.includes(foundGenre)){
                        if (foundGenre in songProfiles){
                            songProfiles[foundGenre].push({
                                "picture": track.images[0].url,
                                "artist": track.name
                            })
                        }
                        else{
                            songProfiles[foundGenre] = [{
                                "picture": track.images[0].url,
                                "artist": track.name
                            }]
                        }
                    }
                    index = index+1;
                }
            }
        }
    }
    createGrid(25);
    fillGrid();
    changeBackground();
}

//The whole page is rendered
main();