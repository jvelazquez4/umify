import { updateProfile, userInfo} from '../fetching';

// parsing current username
let currentURL = window.location.href;
// let user = peopleDb.readUser(currentURL.split('profile/')[1]);

if(localStorage.getItem("username") === null){
    //If username is not in local storage then return back to homepage
    window.location.assign("http://localhost:3000/")
} else {
    var user = await userInfo(localStorage.getItem("username"));
    console.log(user)
}



// console.log(await updateProfile("user1", { "_user" : "user1", "profile-info" : { "_user": "user1",
// "friends": ["user2", "user3", "user4"],
// "spotify-id": "123984825346whatever",
// "profile-info": ["name", "profile-pic-url-or-saved-location", "pronouns", "bio"]}}))

// HTML DOM elements
let pic = document.getElementById('profile-pic');
let pfp = document.getElementById('pfp');
let name = document.getElementById('profile-name');
let user_pronouns = document.getElementById('profile-user-pronouns');
let bio = document.getElementById('profile-bio');
let top_genre = document.getElementById('topgenre');

/* === PROFILE INITIALIZATION AND EDITING === */

// parsing user data (user["info"]) --> HTML DOM elements
function initialize_profile() {
    // spotify-id
    // let spotify_url = "https://open.spotify.com/user/" + user["spotifyData"][""];
    // pic.addEventListener("click", () => {
    //     window.location.href = spotify_url;
    // });
    
    // profile-info
    // name [0]
    name.innerText = user["info"]["username"];
    
    // profile picture [1]
    let img = pic.querySelector("img");
    img.setAttribute("src", user["spotifyData"]["images"]);
    img.setAttribute("alt", "profile_picture");

    // pronouns [2]
    user_pronouns.innerText = "👤 @" + user["spotifyData"]["display_name"] + " | " + user["info"]["pronouns"];

    // bio [3]
    bio.innerText = user["info"]["bio"];

}   

function edit_user_pronouns() {    
    let edit_user_pronouns = document.querySelector(".edit-user-pronouns-box"); 
    edit_user_pronouns.style.display = 'block';

    let submit_pronouns = document.getElementById("submit-pronouns");
    let text_pronouns = document.getElementById("text-pronouns");

    let submit_user = document.getElementById("submit-username");
    let text_user = document.getElementById("text-username");
    
    user_pronouns.replaceWith(edit_user_pronouns);
    
    // CHECK IF USERNAME IN DB ALREADY FIRST
    submit_user.addEventListener('click', () => {
        user_pronouns.innerText = "👤 @" + text_user.value + " | " + user["info"]["profile-info"][2];
        edit_user_pronouns.replaceWith(user_pronouns);

        // store in db
        peopleDb.updateUserInfo(user, {
            "_user" : text_user.value,
            "friends" : friends,
            "spotify-id" : spotify_id,
            "profile-info" : [name.value, pfp.src, user["info"]["profile-info"][2], bio.value]
        });

        // re-render
        initialize_profile();            
    }); 
    
    submit_pronouns.addEventListener('click', () => {
        user_pronouns.innerText = "👤 @" + user["info"]["profile-info"][2] + " | " + text_pronouns.value;
        edit_user_pronouns.replaceWith(user_pronouns);

        // store in db
        peopleDb.updateUserInfo(user, {
            "_user" : user,
            "friends" : friends,
            "spotify-id" : spotify_id,
            "profile-info" : [name.value, pfp.src, text_pronouns.value, bio.value]
        });

        // re-render
        initialize_profile();            
    }); 
}

function edit_bio() {
    let edit_bio = document.querySelector(".edit-bio-box"); 
    edit_bio.style.display = 'block';
    let submit = document.getElementById("submit-bio");
    let text = document.getElementById("text-bio");
    bio.replaceWith(edit_bio);

    submit.addEventListener('click', () => {
        bio.innerText = "✏️ " + text.value;
        edit_bio.replaceWith(bio);

        // store in db
        peopleDb.updateUserInfo(user, {
            "_user" : user,
            "friends" : friends,
            "spotify-id" : spotify_id,
            "profile-info" : [name.value, pfp.src, user["info"]["profile-info"][2], text.value]
        });

        // re-render
        initialize_profile();            
    }); 
}

// editing profile event listeners
bio.addEventListener('click', () => { edit_bio(); });
name.addEventListener('click', () => { edit_name(); });
user_pronouns.addEventListener('click', () => { edit_user_pronouns(); });

/* === ANALYTICS INITIALIZATION AND EDITING === */

async function initialize_analytics() {
    // top genres
    // let parsed_genres = "";
    // given_top_genres.forEach((x) => { 
    //     parsed_genres += x;
    //     if (x !== given_top_genres[given_top_genres.length - 1]) {   
    //         parsed_genres += ' | '; 
    //     } 
    // });
    // let text = document.createTextNode(parsed_genres);
    // top_genre.appendChild(text);

    //sets up our top genres
    let username = user.info.username;
    let data = await (await fetch("/api/top-artist?user=" + username)).json();
    let data_items = data.items
    let top_genres = ""
    for(let i = 0; i < data_items.length; ++i){
        for(let j = 0; j < data_items[i].genres.length; ++j){
            top_genres += data_items[i].genres[j];
            top_genres += "  |  ";
        }
        
    }
    let text = document.createTextNode(top_genres);
    top_genre.appendChild(text);
    


    // top playlists
    let playlists = await (await fetch('/api/top-playlist?user=' + username)).json();
    console.log(playlists)
    let playlist_container = document.getElementById('topplaylist');
    let card_container = document.createElement('div')
    card_container.classList.add('cards')

    for(let i = 0; i < 5; ++i){
        let card = document.createElement('div');
        card.classList.add('card');
        card.id = `Playlist #${i}`;

        let imageBox = document.createElement('div');
        imageBox.classList.add('card-image-box');
        let img = document.createElement('img');
        try{
            img.src = playlists.items[i].images[1].url; 
        } catch {
            img.src = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.analyticdesign.com%2Fwebsite-troubleshooting-fixing-broken-images%2F&psig=AOvVaw3a9gMBy0LCbh4s5cdIGoZL&ust=1684404117665000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCJDPjrmM_P4CFQAAAAAdAAAAABAE"
        }
        img.alt = playlists.items[i].name;

        imageBox.appendChild(img);

        let title = document.createElement('div');
        title.classList.add('card-title');
        title.textContent = playlists.items[i].name;

        card.appendChild(imageBox);
        card.appendChild(title);

        card_container.appendChild(card);
    }
    playlist_container.appendChild(card_container);

    //card1_img.setAttribute('src', given_friends[0][1]);
    //card1_img.setAttribute('alt', 'friend1');

    // friends list
}


async function dynamic_page(){

    //check if user is in local storage
    if(localStorage.getItem("username") === null){
        //If username is not in local storage then return back to homepage
        window.location.assign("http://localhost:3000/")
    } else {
        //otherwise get username of user
        let currUser = localStorage.getItem("username");
        //get their information
        let dbinfo = await userInfo(currUser);
        if(dbInfo === null){
            //if user not in database go back to homepage
            window.location.assign("http://localhost:3000/")
        }


    }
}

initialize_profile();
initialize_analytics();