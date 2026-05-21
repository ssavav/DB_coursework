import { requireRole, updateHeaderAuth } from '../auth.js';
import { CONFIG } from '../config.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const tournamentId = urlParams.get('tournamentId');

updateHeaderAuth();
requireRole("organizer");

document.addEventListener('DOMContentLoaded', async () => {
    if (!tournamentId) {
        alert("Ошибка");
        return;
    }

    await loadApprovedTeams(tournamentId);

    const form = document.getElementById('match-form') as HTMLFormElement;
    form.addEventListener('submit', handleMatchSubmit);
});

async function loadApprovedTeams(tId: string) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/matches/tournament/${tId}/approved-teams`);
        if (!response.ok) throw new Error("Не удалось загрузить команды");
        
        const teams = await response.json();
        
        const team1Select = document.getElementById('m-team1') as HTMLSelectElement;
        const team2Select = document.getElementById('m-team2') as HTMLSelectElement;

        teams.forEach((team: any) => {
            const option1 = new Option(team.name, team.id);
            const option2 = new Option(team.name, team.id);
            team1Select.add(option1);
            team2Select.add(option2);
        });
    } catch (e) {
        console.error(e);
        alert("Ошибка при загрузке команд");
    }
}

async function handleMatchSubmit(e: Event) {
    e.preventDefault();

    const team1Id = (document.getElementById('m-team1') as HTMLSelectElement).value;
    const team2Id = (document.getElementById('m-team2') as HTMLSelectElement).value;
    const dateStr = (document.getElementById('m-date') as HTMLInputElement).value;
    const locId = (document.getElementById('m-location') as HTMLInputElement).value;
    const stage = (document.getElementById('m-stage') as HTMLSelectElement).value;

    if (team1Id === team2Id) {
        alert("Команда не может играть сама с собой!");
        return;
    }

    const payload = {
        tournament_id: tournamentId,
        team1_id: team1Id,
        team2_id: team2Id,
        match_date: dateStr,
        location_id: locId,
        stage_name: stage
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${CONFIG.API_URL}/matches`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Матч успешно создан!");
            window.location.href = `tournament.html?id=${tournamentId}`;
        } else {
            alert("Ошибка при создании матча");
        }
    } catch (error) {
        console.error(error);
        alert("Сбой сети");
    }
}