import { getUserData, requireRole, updateHeaderAuth } from "../auth";
import { CONFIG } from "../config";
import type { JWTPayload } from "../interfaces";

updateHeaderAuth()
requireRole("manager")

const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;
const teamNameTag = document.getElementById("team-name-tag") as HTMLDivElement;
const addPlayerBtn = document.getElementById("add-player-btn") as HTMLButtonElement;
const nameInput = document.getElementById("name-inpt") as HTMLInputElement;
const dateInput = document.getElementById("date-inpt") as HTMLInputElement;


let currentTeamId: number | null = null;

async function loadTeamId() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const userData: JWTPayload | null = getUserData();  
    if(!userData){
        alert("Ошибка!")
        window.location.href = '/index.html'
        return;
    }

    try {
        const res = await fetch(`${CONFIG.API_URL}/team/my-team/${userData.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Не удалось загрузить команду");
        
        currentTeamId = Number(data.teamId);
        await loadTeamSquad(currentTeamId);

    } catch (error) {
        console.error(error);
        alert(error);
    }
}

async function loadTeamSquad(teamId: number) {
    try {
        const res = await fetch(`${CONFIG.API_URL}/team/squad/${teamId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Не удалось загрузить состав");

        teamNameTag.textContent = data.teamName || "Состав команды";

        renderTable(data.squad || []);
    } catch(error) {
        console.error(error);
        alert(error);
    }
}

function renderTable(squad: any[]) {
    tableBody.innerHTML = '';
    
    squad.forEach(player => {
        const row = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = player.real_name;
        
        const dateTd = document.createElement('td');
        const d = new Date(player.birth_date);
        dateTd.textContent = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        
        const actionTd = document.createElement('td');
        const delBtn = document.createElement('button');
        delBtn.className = "delete-btn"
        delBtn.textContent = 'Удалить';

        delBtn.onclick = () => deletePlayer(player.id);
        actionTd.appendChild(delBtn);

        row.appendChild(nameTd);
        row.appendChild(dateTd);
        row.appendChild(actionTd);

        tableBody.appendChild(row);
    });
}

async function deletePlayer(playerId: number) {
    if(!confirm("Удалить игрока?")) return;

    try {
        const res = await fetch(`${CONFIG.API_URL}/team/player/${playerId}`, {
            method: 'DELETE'
        });
        if(res.ok) {
            if(currentTeamId) loadTeamSquad(currentTeamId);
        } else {
            const data = await res.json();
            alert(data.error || "Ошибка удаления");
        }
    } catch(err) {
        console.error(err);
        alert("Ошибка сети");
    }
}

addPlayerBtn.addEventListener('click', async () => {
    if(!currentTeamId) return;

    const nameVal = nameInput.value.trim();
    const dateVal = dateInput.value;

    if(!nameVal || !dateVal) {
        alert("Заполните оба поля");
        return;
    }

    try {
        const payload = {
            teamId: currentTeamId,
            realName: nameVal,
            birthDate: dateVal
        };

        const res = await fetch(`${CONFIG.API_URL}/team/player`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if(res.ok) {
            nameInput.value = '';
            dateInput.value = '';
            loadTeamSquad(currentTeamId);
        } else {
            const data = await res.json();
            alert(data.error || "Ошибка добавления");
        }

    } catch (err) {
        console.error(err);
        alert("Ошибка сети");
    }
});

document.addEventListener("DOMContentLoaded", loadTeamId);