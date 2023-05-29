

const registerButton = document.getElementById('registerButton');
const signinButton = document.getElementById('signinButton');

registerButton.addEventListener('click', async()=>{
     window.location.assign('http://localhost:3000/register');
})

signinButton.addEventListener('click', ()=>{
    window.location.assign('http://localhost:3000/login');
})