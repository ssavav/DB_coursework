import { CONFIG } from "./config";

const registerBtn = document.getElementById("submit-btn") as HTMLButtonElement 
const emailInput = document.getElementById("email-field") as HTMLInputElement
const passwordInput = document.getElementById("password-field") as HTMLInputElement
const passwordRepeatInput = document.getElementById("repeat-password-field") as HTMLInputElement
const roleInput = document.getElementById("role-input") as HTMLSelectElement

const managerFields = document.getElementById("manager-fields") as HTMLDivElement;
const organizerFields = document.getElementById("organizer-fields") as HTMLDivElement;

const teamNameInput = document.getElementById("team-name-field") as HTMLInputElement;
const companyNameInput = document.getElementById("company-name-field") as HTMLInputElement;
const phoneInput = document.getElementById("phone-field") as HTMLInputElement;

roleInput.addEventListener('change', () => {
    if (roleInput.value === 'manager') {
        managerFields.classList.remove('hidden');
        organizerFields.classList.add('hidden');
    } else if (roleInput.value === 'organizer') {
        managerFields.classList.add('hidden');
        organizerFields.classList.remove('hidden');
    } else {
        managerFields.classList.add('hidden');
        organizerFields.classList.add('hidden');
    }
});

if(registerBtn){
    registerBtn.addEventListener('click', async (e) =>{
        e.preventDefault();
        
        const passwordRepeatValue: string = passwordRepeatInput.value;
        const passwordValue: string = passwordInput.value;
        const emailValue: string = emailInput.value;
        const roleValue: string = roleInput.value;
        
        let valid = true;

        if (!roleValue || roleValue.trim() === '') {
            roleInput.style.borderColor = 'red';
            valid = false;
        } else {
            roleInput.style.borderColor = '#cccccc';
        }

        if (!emailValue || emailValue.trim() === '') {
            emailInput.style.borderColor = 'red';
            valid = false;
        } else {
            emailInput.style.borderColor = '#cccccc';
        }

        if (!passwordValue) {
            passwordInput.style.borderColor = 'red';
            valid = false;
        } else {
            passwordInput.style.borderColor = '#cccccc';
        }

        if (!passwordRepeatValue) {
            passwordRepeatInput.style.borderColor = 'red';
            valid = false;
        } else {
            passwordRepeatInput.style.borderColor = '#cccccc';
        }

        if (passwordValue !== passwordRepeatValue) {
            alert('Пароли не совпадают!');
            passwordInput.value = '';
            passwordRepeatInput.value = '';
            valid = false;
        }

        if (roleValue === 'manager') {
            if (!teamNameInput.value.trim()) {
                teamNameInput.style.borderColor = 'red';
                valid = false;
            } else {
                teamNameInput.style.borderColor = '#cccccc';
            }
        }

        if (roleValue === 'organizer') {
            if (!companyNameInput.value.trim()) {
                companyNameInput.style.borderColor = 'red';
                valid = false;
            } else {
                companyNameInput.style.borderColor = '#cccccc';
            }

            if (!phoneInput.value.trim()) {
                phoneInput.style.borderColor = 'red';
                valid = false;
            } else {
                phoneInput.style.borderColor = '#cccccc';
            }
        }

        if (!valid) return;

        let requestBody: any = {
            email: emailValue,
            passwordRaw: passwordValue,
            role: roleValue
        };

        if (roleValue === 'manager') {
            requestBody.team_name = teamNameInput.value;
        } else if (roleValue === 'organizer') {
            requestBody.name = companyNameInput.value;
            requestBody.phone = phoneInput.value;
        }

        try{
            const response = await fetch(`${CONFIG.API_URL}/auth/register`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if(!response.ok){
                alert(data.error || "Ошибка регистрации");
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('email', data.user.email);

            if (data.user.role === 'organizer') {
                window.location.href = '/organizer-panel.html'
            } else if (data.user.role === 'manager') {
                window.location.href = '/manager-panel.html'
            } else {
                window.location.href = '/index.html'
            }
        } catch (error) {
            console.log(error);
            alert("Произошла ошибка при отправке запроса");
        }
    })
}