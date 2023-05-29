const page = document.getElementById('container-page');
const db = new PouchDB('user');
let res; 
let users = {};
import {userInfo, deleteFriend as fetchDelete, acceptPending as fetchAcceptPend, denyPending as fetchDenyPend, addFriend as fetchAccept} from '../fetching';

//Function to add a profile to your friends list
async function addFriend(profile){
    //Creates div elements for the profile
    const newProfile = document.createElement("div");
    newProfile.classList.add('profile');
    newProfile.setAttribute('id',profile['username']);

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = "Recently Listened To:\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0";
    newProfile.append(title);

    //Creates div elements for the picture, username, name, current song, and current artist
    for (let category in profile) {
        const newElement = document.createElement("div");
        newElement.classList.add(category)
        if(category === "picture"){
            const newPic = document.createElement("img");
            newPic.src = profile["picture"];
            newElement.append(newPic);
        }
        else{
            newElement.textContent = profile[category];
        }
        newProfile.append(newElement);
    }

    //Add most recent song and artist
    let mostRecent = await((await fetch(`/api/recently-played-tracks?user=${profile['username']}`)).json());
    let track = mostRecent.items[0].track;
    const newSongElement = document.createElement("div");
    newSongElement.classList.add("curListen"); 
    newSongElement.textContent = "Album Name: " + track.album.name;
    const newArtistElement = document.createElement("div");
    newArtistElement.classList.add("curArtist");
    newArtistElement.textContent = "Artist Name: " + track.artists[0].name;
    newProfile.append(newSongElement);
    newProfile.append(newArtistElement);

    //Add album picture 
    const newPicElement = document.createElement("div");
    newPicElement.classList.add("albumContainer");   
    const newPic = document.createElement("img");
    newPic.classList.add("albumPhoto");
    newPic.src = track.album.images[0].url;
    newPicElement.append(newPic);
    newProfile.append(newPicElement);



    //Makes the delete friend button
    const newContainer = document.createElement("div");
    newContainer.classList.add("buttonContainer");
    const newElement = document.createElement("button");
    newElement.classList.add("delete-button");
    newElement.textContent = "Delete Friend";
    newElement.addEventListener("click",deleteFriend);
    newElement.profile = profile;
    newContainer.append(newElement);
    newProfile.append(newContainer)

    page.append(newProfile);
}

//Adds a profile to the pending page, creates the same div elements as addFriend
function addPending(profile){
    let pendingPage = document.getElementById('pending-page');
    const newProfile = document.createElement("div");
    newProfile.classList.add('profile');
    newProfile.setAttribute('id',profile['username']);

    for (let category in profile) {
        const newElement = document.createElement("div");
        newElement.classList.add(category)
        if(category === "picture"){
            const newPic = document.createElement("img");
            newPic.src = profile["picture"];
            newElement.append(newPic);
        }
        else{
            newElement.textContent = profile[category];
        }
        newProfile.append(newElement);
    }

    //Makes the add friend button which will move the friend to friends page
    let newContainer = document.createElement("div");
    newContainer.classList.add("pendButtonContainer");
    let newElement = document.createElement("button");
    newElement.classList.add("delete-button");
    newElement.textContent = "Accept";
    newElement.addEventListener("click", addPendingFriend);
    newElement.profile = profile;
    newContainer.append(newElement);
    newProfile.append(newContainer)

    //Makes the reject friend button which will remove the friend from pending
    newElement = document.createElement("button");
    newElement.classList.add("delete-button");
    newElement.textContent = "Reject";
    newElement.addEventListener("click", rejectPending);
    newElement.profile = profile;
    newContainer.append(newElement);
    newProfile.append(newContainer)
    

    pendingPage.append(newProfile);    
}

//If you click reject, it will delete the DOM element for that profile
async function rejectPending(event){
    let profile = event.currentTarget.profile;
    let curUser = getCurUser();
    document.getElementById(profile["username"]).remove();
    await fetchDenyPend(curUser, profile["username"]);
}

//If you click add friend in the pending page, it will remove the DOM element for that 
//profile from the pending page and add it to the friends page
async function addPendingFriend(event){
    let profile = event.currentTarget.profile;
    let curUser = getCurUser();
    document.getElementById(profile["username"]).remove();
    addFriend(profile);
    await fetchAcceptPend(curUser,profile["username"]);
}

// Searches for friend in users. If the user does not exist, then it returns
// that nothing was found. If the user does exist and you already have them added, 
// it will return that you already have that profile added
async function searchFriend(){
    let searchBar = document.getElementById("search-bar");
    let addPage = document.getElementById("add-page");
    let value = searchBar.value;
    let newElement = document.getElementsByClassName("search-result");

    if(newElement !== null && newElement.length !== 0){
        newElement[0].remove();
    }

    let searchInfo = await userInfo(value);
    
    if(searchInfo === null){
        newElement = document.createElement("div");
        newElement.classList.add("search-result");
        newElement.textContent = "Nothing was found!";
        addPage.append(newElement);            
    }
    else{
        //Find the user associated with the profile
        //If already added, display that the user is already added
        //If not, add the user
            newElement = document.createElement("div");
            newElement.classList.add("search-result");
            let response = await fetchAccept(getCurUser(),value)
            newElement.textContent = response.response;
            addPage.append(newElement);  
        
    }
}

//Function to get the currently logged in user
function getCurUser(){
    return localStorage.getItem("username");
}

//Deletes a friend from the DOM, users object, and PouchDB 
async function deleteFriend(event){
    let profile = event.currentTarget.profile;
    let curUser = localStorage.getItem("username");
    await fetchDelete(curUser, profile["username"]);
    document.getElementById(profile["username"]).remove();
}

//Event listeners to only display the page of the button you clicked
document.getElementById('pending').addEventListener('click',()=>{
    let page = document.getElementById('container-page');
    page.style.display = "none";
    document.getElementById('pending-page').style.display ="grid";
    document.getElementById('add-page').style.display ="none";  
})
document.getElementById('all-friends').addEventListener('click',()=>{
    let page = document.getElementById('container-page');
    page.style.display = "grid";
    document.getElementById('pending-page').style.display ="none";
    document.getElementById('add-page').style.display ="none"; 
})
document.getElementById('add-friends').addEventListener('click',()=>{
    let page = document.getElementById('container-page');
    page.style.display = "none";
    document.getElementById('pending-page').style.display ="none";    
    document.getElementById('add-page').style.display ="grid";     
})
document.getElementById('search-button').addEventListener('click',searchFriend);

//This is the function that does dynamically adds friends and pending friends
//according to the user currently signed in 
async function main(){
    //Check if there exists a username in local storage
    if(localStorage.getItem("username")==null){
        //If there doesnt exist one, redirect the user to homepage
        window.location.assign('http://localhost:3000/');
    } else{
        //Otherwise, get the username of the user stored in localStorage
        let currentUser = localStorage.getItem("username");
        //Fetch their information 
        let dbInfo = await userInfo(currentUser);
        if(dbInfo === null){
            window.location.assign('http://localhost:3000/');
        }
        //This is just for friendslist, for every friend that the current user has,
        //I add a profile for them in friends list
        for(let friend of dbInfo.info.friends){
            let friendInfo =  await userInfo(friend);
            addFriend(friendInfo.info.profile);
        }
        for(let friend of dbInfo.info.pending){
            let friendInfo =  await userInfo(friend);
            addPending(friendInfo.info.profile);
        }        
    }
}

//Renders the whole page
main();