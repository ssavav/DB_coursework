import type { JWTPayload } from "./interfaces";

export function getUserData(): JWTPayload | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const payload = JSON.parse(decodedJson) as JWTPayload;
        
        if (payload.exp * 1000 < Date.now()) {
            logout(); 
            return null;
        }

        return payload;
    } catch (e) {
        console.error("Ошибка расшифровки токена", e);
        return null;
    }
}


export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    // localStorage.removeItem('id');
    window.location.href = '/index.html';
}

export function updateHeaderAuth(){
    const userData = getUserData();
    const loginElement = document.getElementById("login-tag") as HTMLAnchorElement;
    if (userData){
        const authArea = document.getElementById("auth-area") as HTMLDivElement

        const controlElement = document.createElement('a');
        controlElement.id = "control-tag";
        controlElement.textContent = "Управление"

        if (userData.role === "manager") controlElement.href = "manager-panel.html"
        else if (userData.role === "organizer") controlElement.href = "organizer-panel.html"

        authArea.appendChild(controlElement)

        loginElement.textContent = "Log out";
        loginElement.href = "#";
        
        
        loginElement.addEventListener('click', (e) => {
            e.preventDefault()
            logout();
        })
    } else {
        if(loginElement){
            loginElement.textContent = "Log in";
            loginElement.href = "login.html";
        }
    }
}

export function requireRole(requiredRole: string) {
    const userData = getUserData();

    if(!userData){
        alert("Пожалуйста, войдите в систему");
        window.location.href = "/login.html";
        return;
    }
    
    if(userData.role !== requiredRole){
        alert("Недостаточно прав для просмотра этой страницы");
        window.location.href = "/index.html";
        return;
    }
}