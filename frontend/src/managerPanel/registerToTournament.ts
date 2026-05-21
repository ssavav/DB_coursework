import { getUserData, requireRole, updateHeaderAuth } from "../auth";
import { CONFIG } from "../config";
import type { JWTPayload } from "../interfaces";

updateHeaderAuth()
requireRole("manager")

const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;
const teamNameTag = document.getElementById("team-name-tag") as HTMLDivElement;


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
        await loadAvailableTournaments(currentTeamId);

    } catch (error) {
        console.error(error);
        alert(error);
    }
}

async function loadAvailableTournaments(teamId: number) {
    try {
        const res = await fetch(`${CONFIG.API_URL}/tournament-registration/available-for-team/${teamId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Не удалось загрузить турниры");
        
        const resTeamName = await fetch(`${CONFIG.API_URL}/team/name/${teamId}`);
        const dataTeamName = await resTeamName.json();
        teamNameTag.textContent = dataTeamName.teamName || "Команда";

        renderTable(data || [], teamId);
    } catch(error) {
        console.error(error);
        alert(error);
    }
}

function renderTable(tournaments: any[], teamId: number) {
    tableBody.innerHTML = '';
    
    tournaments.forEach(tournament => {
        const row = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.className = "organizer-tag";
        nameTd.innerHTML = `<a href="/tournament.html?id=${tournament.id}">${tournament.name}</a>`
 
        const sportTd = document.createElement('td');
        sportTd.textContent = tournament.sport_type;

        const orgTd = document.createElement('td');
        orgTd.className = "organizer-tag";
        orgTd.innerHTML = `<a href="organizer.html?id=${tournament.organizer_id}">${tournament.organizer_company_name}</a>`;
        
        const actionTd = document.createElement('td');
        const regBtn = document.createElement('button');
        regBtn.className = "reg-btn"
        regBtn.textContent = 'Зарегистрироваться';

        regBtn.onclick = () => registerToTournament(teamId, tournament.id);
        actionTd.appendChild(regBtn);

        row.appendChild(nameTd);
        row.appendChild(sportTd);
        row.appendChild(orgTd);
        row.appendChild(actionTd);

        tableBody.appendChild(row);
    });
}

async function registerToTournament(teamId: number, tournamentId: number) {
    
    const requestBody: any = {
        teamId: teamId,
        tournamentId: tournamentId
    };
    
    try {
        const response = await fetch(`${CONFIG.API_URL}/tournament-registration/register`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(requestBody)
            });
        if(response.ok) {
            if(currentTeamId) loadAvailableTournaments(currentTeamId);
        } else {
            const data = await response.json();
            alert(data.error || "Ошибка");
        }
    } catch(err) {
        console.error(err);
        alert(err);
    }
}

document.addEventListener("DOMContentLoaded", loadTeamId);