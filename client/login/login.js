import { login } from "../fetching";

// To use example the local database has 2 users user0 and user1. Both have the same password "notsafepasswd"
    document.getElementById('login').addEventListener('click', async () => {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        console.log('username: ' + username);
        console.log('password: ' + password);
        let succesful = await login(username,password)
        if(succesful){
            localStorage.setItem("username",username);
            localStorage.setItem("password",password);
            window.location.href = "/listeners";
        } else {
            console.log("fail")
        }
    });
    document.getElementById("register").addEventListener("click",() => {
        //redirect to register.html
        console.log("redirecting")
    })
