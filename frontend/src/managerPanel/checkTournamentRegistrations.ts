import { getUserData, requireRole, updateHeaderAuth } from "../auth";
import { CONFIG } from "../config";
import type { JWTPayload } from "../interfaces";

updateHeaderAuth()
requireRole("manager")

const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;
const teamNameTag = document.getElementById("team-name-tag") as HTMLDivElement;


let currentTeamId: number | null = null;

function chooseBadge(status: string){
    const statuses: Record<string, string> = {
        'pending': '<span class="badge registration">На рассмотрении</span>',
        'approved': '<span class="badge active">Одобрена</span>',
        'rejected': '<span class="badge cancelled">Отклонена</span>'
    };
    
    return statuses[status] || `<span class="badge active">${status}</span>`;
}

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
        const res = await fetch(`${CONFIG.API_URL}/tournament-registration/all/${teamId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Не удалось загрузить турниры");
        
        const resTeamName = await fetch(`${CONFIG.API_URL}/team/name/${teamId}`);
        const dataTeamName = await resTeamName.json();
        teamNameTag.textContent = dataTeamName.teamName || "Команда";

        renderTable(data || []);
    } catch(error) {
        console.error(error);
        alert(error);
    }
}

function renderTable(tournaments: any[]) {
    tableBody.innerHTML = '';
    
    tournaments.forEach(tournament => {
        const row = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.className = "organizer-tag";
        nameTd.innerHTML = `<a href="/tournament.html?id=${tournament.tournament_id}">${tournament.tournament_name}</a>`
 
        const sportTd = document.createElement('td');
        sportTd.textContent = tournament.sport_type;

        const orgTd = document.createElement('td');
        orgTd.className = "organizer-tag";
        orgTd.innerHTML = `<a href="organizer.html?id=${tournament.organizer_id}">${tournament.organizer_company_name}</a>`;
        
        const badgeTd = document.createElement('td');
        badgeTd.innerHTML = chooseBadge(tournament.status_registration)

        row.appendChild(nameTd);
        row.appendChild(sportTd);
        row.appendChild(orgTd);
        row.appendChild(badgeTd);

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", loadTeamId);