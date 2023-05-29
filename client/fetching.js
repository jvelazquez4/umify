async function getAllListeners() {
    console.log("Hello World");
    return await fetch(
        "http://localhost:3000/allListeners"
    ).then( (res) => {
        return res.json().then((data) => {
            return data;   
        });
    });
}

async function addFriend(curUser, friend) {
    let response = await fetch(
        "http://localhost:3000/addFriend", {
            method: "POST",
            body: JSON.stringify({
                "user" : curUser,
                "friend" : friend
            }),
            headers: {
              "Content-type": "application/json"
            }
        }
    )
    return await response.json();
}   

async function deleteFriend(user, friend) {
    await fetch(
        "http://localhost:3000/deleteFriend", {
            method: "POST",
            body: JSON.stringify({
                "curUser" : user,
                "friend" : friend
            }),
            headers: {
              "Content-type": "application/json"
            }
        }
    )
}

async function acceptPending(user, friend) {
    await fetch(
        "http://localhost:3000/acceptPending", {
            method: "POST",
            body: JSON.stringify({
                "user" : user,
                "friend" : friend
            }),
            headers: {
              "Content-type": "application/json"
            }
        }
    )
}

async function denyPending(user, friend) {
    await fetch(
        "http://localhost:3000/denyPending", {
            method: "POST",
            body: JSON.stringify({
                "user" : user,
                "pending" : friend
            }),
            headers: {
              "Content-type": "application/json"
            }
        }
    )
}

async function login(username, password) {
    return await fetch(
        "http://localhost:3000/login", {
            method: "POST",
            body: JSON.stringify({
                "username" : username,
                "password" : password
            }),
            headers: {
              "Content-type": "application/json"
            }
        }
    )
}

async function register(username,password) {
    await fetch(
        "http://localhost:3000/register", {
            method: "POST",
            body: JSON.stringify({
                "username" : username,
                "password" : password
            }),
            headers: {
              "Content-type": "application/json"
            }
        }
    )
}

async function updateProfile(username, profile_info) {
    await fetch (
        "http://localhost:3000/profile", {
            method: "POST",
            body: JSON.stringify({
                "_user" : username,
                "profile-info" : profile_info
            }),
            headers: {
              "Content-type": "application/json"
            }
        }
    );
}

async function userInfo(username) {
    let response =  await fetch (
        "http://localhost:3000/userInfo", {
            method: "POST",
            body: JSON.stringify({"username":username}),
            headers: {
              "Content-type": "application/json"
            }
        }
    );
    return await response.json();
}



export { denyPending, userInfo, getAllListeners, addFriend, deleteFriend, acceptPending, login, register, updateProfile }; 
