import { CONFIG } from "./config";
import { updateHeaderAuth } from "./auth";

updateHeaderAuth();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const teamID = urlParams.get('id');

const titleElement = document.getElementById("tournament-name-tag");
const detailsDiv = document.getElementById("tournament-details");
const tableBody = document.getElementById("tableBody") as HTMLTableSectionElement;

if (!teamID) {
    document.body.innerHTML = "<h1 style='text-align:center;margin-top:50px;'>Ошибка: Команда не найдена!</h1>";
} else {
    loadTeamDetails(teamID);
}

async function loadTeamDetails(id: string) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/team/card/${id}`);
        if(!response.ok) throw new Error("Команда не найдена");
        const team = await response.json();
        
        renderTeamPage(team);
    } catch(err) {
        console.error(err);
        document.body.innerHTML = "<h1 style='text-align:center;margin-top:50px;'>Ошибка сети!</h1>";
    }
}

function renderTeamPage(team: any) {
    if (titleElement) titleElement.textContent = team.name;

    if (detailsDiv) {
        const oldParams = detailsDiv.querySelectorAll('.param-name, .param-value');
        oldParams.forEach(el => el.remove());

        const cTitle = document.createElement("div"); cTitle.className = "param-name"; cTitle.textContent = "Страна"; 
        const cVal = document.createElement("div"); cVal.className = "param-value"; cVal.textContent = team.country || "-";
        
        const dTitle = document.createElement("div"); dTitle.className = "param-name"; dTitle.textContent = "Дата основания";
        const dVal = document.createElement("div"); dVal.className = "param-value"; 
        dVal.textContent = team.foundation_date ? new Date(team.foundation_date).toLocaleDateString("ru-RU") : "-";

        const tableNode = detailsDiv.querySelector("table");
        detailsDiv.insertBefore(cTitle, tableNode);
        detailsDiv.insertBefore(cVal, tableNode);
        detailsDiv.insertBefore(dTitle, tableNode);
        detailsDiv.insertBefore(dVal, tableNode);
    }

    renderMembersTable(team.players, team.coaches);
}

function renderMembersTable(players: any[], coaches: any[]) {
    tableBody.innerHTML = '';

    coaches.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>Тренер</td>
            <td>${c.last_name || ""} ${c.first_name || ""}</td>
            <td>Опыт: ${c.experience_years} лет</td>
        `;
        tableBody.appendChild(tr);
    });

    players.forEach(p => {
        const tr = document.createElement("tr");
        const dateStr = p.birth_date ? new Date(p.birth_date).toLocaleDateString("ru-RU") : "";
        tr.innerHTML = `
            <td>Игрок</td>
            <td>${p.real_name}</td>
            <td>г.р.: ${dateStr}</td>
        `;
        tableBody.appendChild(tr);
    });
}