import { logout } from "./auth";
import { CONFIG } from "./config";

const loginBtn = document.getElementById("submit-btn") as HTMLButtonElement 
const emailInput = document.getElementById("email-field") as HTMLInputElement
const passwordInput = document.getElementById("password-field") as HTMLInputElement

const logoutBtn = document.getElementById("logout-btn");

logoutBtn?.addEventListener('click', async (e) => {
    e.preventDefault()
    logout();
})


if(loginBtn){
    loginBtn.addEventListener('click', async (e) =>{
        e.preventDefault();
        const emailValue: string = emailInput.value;
        const passwordValue: string = passwordInput.value;

        if(!emailValue){
            emailInput.style.borderColor= 'red'
        }
        emailInput.style.borderColor= '#cccccc'

        if(!passwordValue){
            passwordInput.style.borderColor= 'red'
        }
        passwordInput.style.borderColor= '#cccccc'

        try{
            const response = await fetch(`${CONFIG.API_URL}/auth/login`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({email: emailValue, passwordRaw: passwordValue})
            });

            const data = await response.json();

            if(!response.ok){
                alert(data.error);
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.user.email);
            // localStorage.setItem('id', data.user.id)

            if (data.user.role === 'organizer') {
                window.location.href = '/organizer-panel.html'
            } else if (data.user.role === 'manager') {
                window.location.href = '/manager-panel.html'
            } else {
                window.location.href = '/index.html'
            }
        } catch (error) {
            console.log(error);
        }
    })
}