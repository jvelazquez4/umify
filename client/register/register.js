function isPasswordValid(){
    const password = document.getElementById("password").value;
    const passwordError = document.getElementById("passwordError");

    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const specialCharRegex = /[!@#$%^&*]/;

    if(password.length < 8){
        passwordError.innerText = "password must be 8 characters long!"
        return false;
    }
    if (!uppercaseRegex.test(password)) {
        passwordError.innerText = "Password must contain at least 1 uppercase letter!";
        return false;
    }
    
    if (!lowercaseRegex.test(password)) {
        passwordError.innerText = "Password must contain at least 1 lowercase letter!";
        return false;
    }
    
    if (!specialCharRegex.test(password)) {
        passwordError.innerText = "Password must contain at least 1 special character from the following !@#$%^&*";
        return false;
    }
      
    passwordError.innerText = "Perfect!"
    return true;
}

//all our js has to be under this event listener due to the password function being called on input
document.addEventListener('DOMContentLoaded',() => {


    document.getElementById('register').addEventListener('click', async () => {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        //registering first checks that the user does not already exist within the database
        //Then it checks if the password is valid.
        //if both checks are completed the user is created and put into the DB and then redirected to their profile

        
        if(isPasswordValid()){ 
            //create user and put user into database if user exists it will error out
            console.log("user put into database!")
            //fetch register, if successful authenticate with spotify, if spotify authentication is
            //unsuccessful then dont save user into database.
            const response = 
                await fetch("http://localhost:3000/register",{
                    method: "POST",
                    body: JSON.stringify({
                        "username" : username,
                        "password" : password
                    }),
                    headers: {
                      "Content-type": "application/json"
                    }
                });
            
            let data = await response.json();
            let authURL = data.authURL;
            
            localStorage.setItem("username",username);
            window.location.href = authURL;
            
            
            
        } else {
            alert("Error!")
        }

    });
  });


// This is Steven's Happy Place:


function generateCircularMarquees(num) {

    const marqueeParent = document.getElementById("waves-of-color");

    for (let i = 0; i < num; i++) {
        let newMarquee = document.createElement("div")

        newMarquee.className = "circ-marquee";

        newMarquee.style.right = String(Math.floor(Math.random() * 1600) + 80) + "px";
        newMarquee.style.top = String(Math.floor(Math.random() * 1300) + 80) + "px";
        newMarquee.animate

        marqueeParent.appendChild(newMarquee);
    }
}